import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Users,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMyVisitorRequests } from '../../service/visitorRequestService';
import { useFocusEffect } from '@react-navigation/native';

export default function VisitorRequestsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getMyVisitorRequests();
      if (response.status === 200 && response.data?.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch visitor requests:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests(true);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Visitor Requests</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }>
        
        {/* Request Card */}
        <View style={styles.requestCard}>
          <View style={styles.iconWrapper}>
            <Users color={colors.primary} size={32} />
          </View>
          <Text style={styles.requestTitle}>Invite a Visitor</Text>
          <Text style={styles.requestSubtitle}>
            Submit a request to register a visitor entry (e.g. parents, friends) for permission.
          </Text>
          <TouchableOpacity 
            style={styles.applyButton} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ApplyVisitorRequest')}>
            <Text style={styles.applyButtonText}>Request Visitor Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Requests Logs */}
        <Text style={styles.sectionTitle}>Request History</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading requests…</Text>
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <AlertCircle color={colors.textTertiary} size={32} />
            <Text style={styles.emptyStateText}>No visitor requests found</Text>
          </View>
        ) : (
          requests.map((req) => {
            const isApproved = req.status === 'Approved';
            const isRejected = req.status === 'Rejected';
            return (
              <View key={req._id} style={styles.passCard}>
                <View style={styles.passHeader}>
                  <View>
                    <Text style={styles.passReason}>{req.visitorName}</Text>
                    <Text style={styles.relationText}>{req.relation} • {req.visitorPhone}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    isApproved ? styles.statusApproved : isRejected ? styles.statusRejected : styles.statusPending
                  ]}>
                    {isApproved ? (
                      <CheckCircle2 color={colors.success} size={14} />
                    ) : isRejected ? (
                      <XCircle color={colors.danger} size={14} />
                    ) : (
                      <AlertCircle color={colors.warning} size={14} />
                    )}
                    <Text style={[
                      styles.statusText,
                      isApproved ? { color: colors.success } : isRejected ? { color: colors.danger } : { color: colors.warning }
                    ]}>
                      {req.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.passDetailsRow}>
                  <View style={styles.passDetail}>
                    <Calendar color={colors.textSecondary} size={14} />
                    <Text style={styles.passDetailText}>Date: {formatDate(req.visitDate)}</Text>
                  </View>
                  <View style={styles.passDetail}>
                    <Clock color={colors.textSecondary} size={14} />
                    <Text style={styles.passDetailText}>Expected Time: {req.visitTime}</Text>
                  </View>
                  {req.purpose ? (
                    <View style={styles.passDetail}>
                      <Text style={[styles.passDetailText, { fontWeight: '700' }]}>Purpose: </Text>
                      <Text style={styles.passDetailText}>{req.purpose}</Text>
                    </View>
                  ) : null}
                  {req.remarks ? (
                    <View style={styles.remarksBox}>
                      <Text style={styles.remarksLabel}>Hostel Remarks:</Text>
                      <Text style={styles.remarksText}>{req.remarks}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })
        )}

      </ScrollView>
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
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.s,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.l,
    paddingBottom: 40,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  requestSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
    lineHeight: 20,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  passCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  passReason: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  relationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusApproved: {
    backgroundColor: colors.successBg,
  },
  statusPending: {
    backgroundColor: colors.warningBg,
  },
  statusRejected: {
    backgroundColor: colors.dangerBg,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  passDetailsRow: {
    gap: 8,
  },
  passDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  passDetailText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  remarksBox: {
    marginTop: spacing.s,
    padding: spacing.s,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  remarksLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  remarksText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
  },
});
