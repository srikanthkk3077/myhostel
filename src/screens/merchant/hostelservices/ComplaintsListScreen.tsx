import React, { useState, useEffect, useCallback, useRef } from 'react';
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
} from 'react-native';
import {
  ArrowLeft,
  Plus,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getMerchantComplaints, updateComplaintStatus } from '../../../service/complaintService';

const getPriority = (category: string) => {
  switch (category) {
    case 'Electrical': return 'High';
    case 'Plumbing': return 'Medium';
    case 'Internet': return 'Medium';
    default: return 'Low';
  }
};

const formatTime = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeStr = '';
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  if (diffDays === 0 && now.getDate() === d.getDate()) {
    return `Today, ${timeStr}`;
  } else if (diffDays === 1 || (diffDays === 0 && now.getDate() !== d.getDate())) {
    return `Yesterday, ${timeStr}`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    const standardMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${standardMonths[d.getMonth()]} ${d.getFullYear()}`;
  }
};

export default function ComplaintsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Pending' | 'Resolved'>('Pending');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getMerchantComplaints();
      if (response.status === 200 && response.data?.success) {
        setComplaints(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch merchant complaints', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComplaints(true);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints(false);
  };

  const handleToggleStatus = (complaint: any) => {
    const isResolved = complaint.status === 'Resolved';
    const targetStatus = isResolved ? 'In Progress' : 'Resolved';
    
    Alert.alert(
      isResolved ? 'Reopen Complaint?' : 'Resolve Complaint?',
      `Are you sure you want to mark "${complaint.title}" (Room ${complaint.member?.room || '-'}) as ${isResolved ? 'In Progress' : 'Resolved'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: isResolved ? 'Reopen' : 'Resolve', 
          style: isResolved ? 'destructive' : 'default',
          onPress: async () => {
            try {
              const response = await updateComplaintStatus(complaint._id, { 
                status: targetStatus,
                updateText: isResolved ? 'Merchant reopened the issue.' : 'Merchant resolved the issue.' 
              });
              if (response.status === 200 && response.data?.success) {
                Alert.alert('Success', `Complaint marked as ${targetStatus}`);
                fetchComplaints(false);
              } else {
                Alert.alert('Error', response.data?.message || 'Failed to update status');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Something went wrong');
            }
          }
        }
      ]
    );
  };

  const complaintsCountPending = complaints.filter(c => c.status === 'In Progress').length;
  const filtered = complaints.filter(c => activeTab === 'Pending' ? c.status === 'In Progress' : c.status === 'Resolved');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return colors.danger;
      case 'Medium': return colors.warning;
      default: return colors.success;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
          Loading complaints…
        </Text>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Complaints</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('RaiseComplaint')}
            activeOpacity={0.7}>
            <Plus color="#FFFFFF" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Pending' && styles.tabActive]}
            onPress={() => setActiveTab('Pending')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'Pending' && styles.tabTextActive]}>
              Pending ({complaintsCountPending})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Resolved' && styles.tabActive]}
            onPress={() => setActiveTab('Resolved')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'Resolved' && styles.tabTextActive]}>
              Resolved
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <CheckCircle2 color={colors.success} size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>There are no {activeTab.toLowerCase()} complaints at the moment.</Text>
          </View>
        ) : (
          filtered.map((complaint) => {
            const priority = getPriority(complaint.category);
            return (
              <TouchableOpacity 
                key={complaint._id} 
                style={styles.complaintCard} 
                activeOpacity={0.8}
                onPress={() => handleToggleStatus(complaint)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.roomIdBadge}>
                    <Text style={styles.roomIdText}>Room {complaint.member?.room || '-'}</Text>
                  </View>
                  <Text style={styles.dateText}>{formatTime(complaint.createdAt)}</Text>
                </View>
                
                <Text style={styles.issueTitle}>{complaint.title}</Text>
                
                <View style={styles.cardFooter}>
                  <View style={styles.categoryPill}>
                    <Wrench color={colors.textSecondary} size={12} strokeWidth={2.5} />
                    <Text style={styles.categoryText}>{complaint.category}</Text>
                  </View>

                  {activeTab === 'Pending' ? (
                    <View style={[styles.priorityPill, { backgroundColor: `${getPriorityColor(priority)}15` }]}>
                      <AlertTriangle color={getPriorityColor(priority)} size={12} strokeWidth={2.5} />
                      <Text style={[styles.priorityText, { color: getPriorityColor(priority) }]}>
                        {priority}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.priorityPill, { backgroundColor: colors.successBg }]}>
                      <CheckCircle2 color={colors.success} size={12} strokeWidth={2.5} />
                      <Text style={[styles.priorityText, { color: colors.success }]}>Resolved</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 40 }} />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.s,
    gap: spacing.m,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
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
  },
  complaintCard: {
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
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  roomIdBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roomIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.m,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
