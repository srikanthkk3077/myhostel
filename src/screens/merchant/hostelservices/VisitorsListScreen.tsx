import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Plus,
  UserCheck,
  UserMinus,
  Search,
  Clock,
  LogOut,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VisitorsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Inside' | 'Checked Out'>('Inside');
  const [searchQuery, setSearchQuery] = useState('');

  const visitors = [
    {
      id: 'V-101',
      name: 'Ramesh Kumar',
      visiting: 'Amit Verma (Room 101)',
      phone: '+91 9876543210',
      checkIn: 'Today, 10:30 AM',
      checkOut: null,
      status: 'Inside',
      relation: 'Father',
    },
    {
      id: 'V-102',
      name: 'Suresh Singh',
      visiting: 'Rahul Sharma (Room 204)',
      phone: '+91 8765432109',
      checkIn: 'Today, 11:15 AM',
      checkOut: 'Today, 01:30 PM',
      status: 'Checked Out',
      relation: 'Brother',
    },
    {
      id: 'V-103',
      name: 'Arun Patel',
      visiting: 'Vikram Singh (Room 302)',
      phone: '+91 7654321098',
      checkIn: 'Yesterday, 04:00 PM',
      checkOut: 'Yesterday, 06:45 PM',
      status: 'Checked Out',
      relation: 'Uncle',
    },
  ];

  const filtered = visitors.filter(v => v.status === activeTab && v.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
            <Text style={styles.headerTitle}>Visitors</Text>
            <Text style={styles.headerSubtitle}>Security Log</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddVisitor')}
            activeOpacity={0.7}>
            <Plus color="#FFFFFF" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search color={colors.textSecondary} size={18} strokeWidth={2.5} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search visitor or student..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Inside' && styles.tabActive]}
            onPress={() => setActiveTab('Inside')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'Inside' && styles.tabTextActive]}>
              Currently Inside ({visitors.filter(v => v.status === 'Inside').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Checked Out' && styles.tabActive]}
            onPress={() => setActiveTab('Checked Out')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === 'Checked Out' && styles.tabTextActive]}>
              Checked Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            {activeTab === 'Inside' ? (
              <UserCheck color={colors.success} size={64} strokeWidth={1.5} />
            ) : (
              <UserMinus color={colors.textTertiary} size={64} strokeWidth={1.5} />
            )}
            <Text style={styles.emptyTitle}>No Visitors {activeTab}</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'Inside' 
                ? 'There are no guests currently inside the hostel premises.' 
                : 'No past visitor records found matching your search.'}
            </Text>
          </View>
        ) : (
          filtered.map((visitor) => (
            <View key={visitor.id} style={styles.visitorCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.visitorName}>{visitor.name}</Text>
                  <Text style={styles.relationText}>{visitor.relation}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: activeTab === 'Inside' ? colors.warningBg : colors.successBg }]}>
                  <Text style={[styles.statusBadgeText, { color: activeTab === 'Inside' ? colors.warning : colors.success }]}>
                    {visitor.status}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Visiting:</Text>
                <Text style={styles.infoValue}>{visitor.visiting}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{visitor.phone}</Text>
              </View>

              <View style={styles.timeBox}>
                <View style={styles.timeColumn}>
                  <View style={styles.timeLabelRow}>
                    <Clock color={colors.textTertiary} size={14} strokeWidth={2.5} />
                    <Text style={styles.timeLabel}>Check In</Text>
                  </View>
                  <Text style={styles.timeText}>{visitor.checkIn}</Text>
                </View>
                
                {activeTab === 'Checked Out' && (
                  <View style={styles.timeColumn}>
                    <View style={styles.timeLabelRow}>
                      <LogOut color={colors.textTertiary} size={14} strokeWidth={2.5} />
                      <Text style={styles.timeLabel}>Check Out</Text>
                    </View>
                    <Text style={styles.timeText}>{visitor.checkOut}</Text>
                  </View>
                )}
              </View>

              {activeTab === 'Inside' && (
                <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8}>
                  <LogOut color={colors.danger} size={18} strokeWidth={2.5} />
                  <Text style={styles.checkoutButtonText}>Mark Checkout</Text>
                </TouchableOpacity>
              )}
            </View>
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
    paddingTop: spacing.m,
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: spacing.m,
    marginHorizontal: spacing.l,
    marginTop: spacing.l,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    color: colors.text,
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
  visitorCard: {
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
    marginBottom: 8,
  },
  infoLabel: {
    width: 70,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
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
    marginTop: spacing.s,
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
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerBg,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: spacing.m,
    gap: spacing.s,
  },
  checkoutButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});
