import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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

export default function ComplaintsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Pending' | 'Resolved'>('Pending');

  const complaints = [
    { id: 'C-1001', room: '101', issue: 'AC Not Cooling', category: 'Electrical', status: 'Pending', date: 'Today, 09:30 AM', priority: 'High' },
    { id: 'C-1002', room: '204', issue: 'Tap Leaking', category: 'Plumbing', status: 'Pending', date: 'Yesterday, 04:15 PM', priority: 'Medium' },
    { id: 'C-1003', room: '105', issue: 'Fan making noise', category: 'Electrical', status: 'Resolved', date: '2 days ago', priority: 'Low' },
    { id: 'C-1004', room: '302', issue: 'WiFi signal weak', category: 'Internet', status: 'Resolved', date: 'Last week', priority: 'Medium' },
  ];

  const filtered = complaints.filter(c => c.status === activeTab);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return colors.danger;
      case 'Medium': return colors.warning;
      default: return colors.success;
    }
  };

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
              Pending ({complaints.filter(c => c.status === 'Pending').length})
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <CheckCircle2 color={colors.success} size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>There are no {activeTab.toLowerCase()} complaints at the moment.</Text>
          </View>
        ) : (
          filtered.map((complaint) => (
            <TouchableOpacity key={complaint.id} style={styles.complaintCard} activeOpacity={0.8}>
              <View style={styles.cardHeader}>
                <View style={styles.roomIdBadge}>
                  <Text style={styles.roomIdText}>Room {complaint.room}</Text>
                </View>
                <Text style={styles.dateText}>{complaint.date}</Text>
              </View>
              
              <Text style={styles.issueTitle}>{complaint.issue}</Text>
              
              <View style={styles.cardFooter}>
                <View style={styles.categoryPill}>
                  <Wrench color={colors.textSecondary} size={12} strokeWidth={2.5} />
                  <Text style={styles.categoryText}>{complaint.category}</Text>
                </View>

                {activeTab === 'Pending' ? (
                  <View style={[styles.priorityPill, { backgroundColor: `${getPriorityColor(complaint.priority)}15` }]}>
                    <AlertTriangle color={getPriorityColor(complaint.priority)} size={12} strokeWidth={2.5} />
                    <Text style={[styles.priorityText, { color: getPriorityColor(complaint.priority) }]}>
                      {complaint.priority}
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
          ))
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
