import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
  User,
  Phone,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMerchantVisitorRequests, updateVisitorRequestStatus } from '../../../service/visitorRequestService';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export default function VisitorRequestsApprovalScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'Pending' | 'History'>('Pending');
  
  // Modal state
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [actioning, setActioning] = useState(false);

  const fetchRequests = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getMerchantVisitorRequests();
      if (response.status === 200 && response.data?.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch visitor requests for merchant:', error);
      Alert.alert('Error', 'Failed to load visitor requests.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests(true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests(false);
  };

  const handleAction = async (status: 'Approved' | 'Rejected') => {
    if (!selectedRequest) return;
    
    setActioning(true);
    try {
      const response = await updateVisitorRequestStatus(selectedRequest._id, {
        status,
        remarks: remarks.trim() || undefined,
      });

      if (response.status === 200 && response.data?.success) {
        ReactNativeHapticFeedback.trigger('notificationSuccess', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
        Alert.alert('Success', `Visitor request has been ${status.toLowerCase()} successfully.`);
        setSelectedRequest(null);
        setRemarks('');
        fetchRequests(false);
      }
    } catch (error: any) {
      console.error('Error updating visitor request:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update request.');
    } finally {
      setActioning(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const historyRequests = requests.filter(r => r.status === 'Approved' || r.status === 'Rejected');
  
  const displayedRequests = activeTab === 'Pending' ? pendingRequests : historyRequests;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Visitor Requests</Text>
            <Text style={styles.headerSubtitle}>Approve Guest Entries</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Pending' && styles.tabActive]}
            onPress={() => setActiveTab('Pending')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'Pending' && styles.tabTextActive]}>
              Pending ({pendingRequests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'History' && styles.tabActive]}
            onPress={() => setActiveTab('History')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'History' && styles.tabTextActive]}>
              History ({historyRequests.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching requests…</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }>
          
          {displayedRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <AlertCircle color={colors.textTertiary} size={64} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Requests</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'Pending' 
                  ? 'There are no pending visitor requests currently.' 
                  : 'No past visitor requests found.'}
              </Text>
            </View>
          ) : (
            displayedRequests.map((req) => {
              const isApproved = req.status === 'Approved';
              const isRejected = req.status === 'Rejected';
              const studentName = req.member?.name || 'Unknown Student';
              const roomBed = req.member ? `Room ${req.member.room} / Bed ${req.member.bed}` : 'No Room Info';
              
              return (
                <TouchableOpacity
                  key={req._id}
                  style={styles.requestCard}
                  activeOpacity={0.9}
                  onPress={() => activeTab === 'Pending' ? setSelectedRequest(req) : null}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.visitorName}>{req.visitorName}</Text>
                      <Text style={styles.relationText}>{req.relation} • {req.visitorPhone}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      isApproved ? styles.statusApproved : isRejected ? styles.statusRejected : styles.statusPending
                    ]}>
                      <Text style={[
                        styles.statusBadgeText,
                        isApproved ? { color: colors.success } : isRejected ? { color: colors.danger } : { color: colors.warning }
                      ]}>
                        {req.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Invited By:</Text>
                    <Text style={styles.infoValue}>{studentName} ({roomBed})</Text>
                  </View>

                  {req.purpose ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Purpose:</Text>
                      <Text style={styles.infoValue}>{req.purpose}</Text>
                    </View>
                  ) : null}

                  <View style={styles.timeBox}>
                    <View style={styles.timeColumn}>
                      <View style={styles.timeLabelRow}>
                        <Calendar color={colors.textTertiary} size={13} />
                        <Text style={styles.timeLabel}>Visit Date</Text>
                      </View>
                      <Text style={styles.timeText}>{formatDate(req.visitDate)}</Text>
                    </View>

                    <View style={styles.timeColumn}>
                      <View style={styles.timeLabelRow}>
                        <Clock color={colors.textTertiary} size={13} />
                        <Text style={styles.timeLabel}>Expected Time</Text>
                      </View>
                      <Text style={styles.timeText}>{req.visitTime}</Text>
                    </View>
                  </View>

                  {req.remarks ? (
                    <View style={styles.remarksDisplayBox}>
                      <Text style={styles.remarksDisplayLabel}>Remarks:</Text>
                      <Text style={styles.remarksDisplayText}>{req.remarks}</Text>
                    </View>
                  ) : null}

                  {activeTab === 'Pending' && (
                    <View style={styles.actionPrompt}>
                      <Text style={styles.actionPromptText}>Tap to review & take action</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Review Request Modal */}
      <Modal
        visible={!!selectedRequest}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedRequest(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Review Visitor Request</Text>
              <TouchableOpacity onPress={() => setSelectedRequest(null)}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalMeta}>
                  <Text style={styles.modalLabel}>Visitor Details</Text>
                  <Text style={styles.modalStudentName}>{selectedRequest.visitorName}</Text>
                  <Text style={styles.modalStudentRoom}>
                    Relation: {selectedRequest.relation}
                  </Text>
                  <Text style={styles.modalStudentPhone}>Phone: {selectedRequest.visitorPhone}</Text>
                </View>

                <View style={styles.modalMeta}>
                  <Text style={styles.modalLabel}>Invited By</Text>
                  <Text style={styles.modalStudentName}>{selectedRequest.member?.name}</Text>
                  <Text style={styles.modalStudentRoom}>
                    Room {selectedRequest.member?.room} • Bed {selectedRequest.member?.bed}
                  </Text>
                  <Text style={styles.modalStudentPhone}>Phone: {selectedRequest.member?.mobile}</Text>
                </View>

                <View style={styles.modalDetailGroup}>
                  <Text style={styles.modalLabel}>Visit Schedule</Text>
                  <Text style={styles.modalValue}>
                    {formatDate(selectedRequest.visitDate)} at {selectedRequest.visitTime}
                  </Text>
                </View>

                {selectedRequest.purpose ? (
                  <View style={styles.modalDetailGroup}>
                    <Text style={styles.modalLabel}>Purpose of Visit</Text>
                    <Text style={styles.modalValue}>{selectedRequest.purpose}</Text>
                  </View>
                ) : null}

                <View style={styles.modalRemarksGroup}>
                  <Text style={styles.modalLabel}>Warden Remarks (Optional)</Text>
                  <View style={styles.remarksInputContainer}>
                    <MessageSquare color={colors.textSecondary} size={18} style={styles.remarksIcon} />
                    <TextInput
                      style={styles.remarksInput}
                      placeholder="e.g. Approved, visit allowed"
                      placeholderTextColor={colors.textTertiary}
                      value={remarks}
                      onChangeText={setRemarks}
                    />
                  </View>
                </View>

                {actioning ? (
                  <ActivityIndicator color={colors.primary} size="large" style={{ marginVertical: spacing.l }} />
                ) : (
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      activeOpacity={0.8}
                      onPress={() => handleAction('Rejected')}>
                      <XCircle color={colors.danger} size={18} />
                      <Text style={styles.rejectBtnText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      activeOpacity={0.8}
                      onPress={() => handleAction('Approved')}>
                      <CheckCircle2 color="#FFFFFF" size={18} />
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.l,
  },
  loadingContainer: {
    paddingVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.l,
    marginBottom: spacing.s,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: 20,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  visitorName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  relationText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  statusApproved: {
    backgroundColor: colors.successBg,
  },
  statusRejected: {
    backgroundColor: colors.dangerBg,
  },
  statusPending: {
    backgroundColor: colors.warningBg,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  infoLabel: {
    width: 80,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  timeBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeColumn: {
    flex: 1,
  },
  timeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  remarksDisplayBox: {
    marginTop: spacing.m,
    padding: spacing.m,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  remarksDisplayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  remarksDisplayText: {
    fontSize: 13,
    color: colors.text,
    fontStyle: 'italic',
  },
  actionPrompt: {
    marginTop: spacing.m,
    alignItems: 'center',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.m,
  },
  actionPromptText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  closeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalMeta: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalStudentName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  modalStudentRoom: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  modalStudentPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalDetailGroup: {
    marginBottom: spacing.l,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  modalRemarksGroup: {
    marginBottom: spacing.xl,
  },
  remarksInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
  },
  remarksIcon: {
    marginRight: spacing.s,
  },
  remarksInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    color: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  rejectBtnText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '800',
  },
  approveBtn: {
    backgroundColor: colors.success,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
