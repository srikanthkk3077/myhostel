import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import { ArrowLeft, Wallet, CheckCircle2, ChevronRight, Search, Filter, X } from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFeeStats } from '../../../service/merchant';

export default function DuesListScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const [duesList, setDuesList] = useState<any[]>(route.params?.dues || []);
  const [loading, setLoading] = useState(!route.params?.dues);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Paid'>('All');

  const fetchDues = async () => {
    try {
      const response = await getFeeStats();
      if (response.status === 200 && response.data?.success) {
        setDuesList(response.data.data.recentDues || []);
      }
    } catch (error) {
      console.error('Error fetching dues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!route.params?.dues) {
      fetchDues();
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDues();
  };

  const filteredDues = duesList.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === 'All' || 
      (activeTab === 'Pending' && item.status === 'Pending') || 
      (activeTab === 'Paid' && item.status === 'Paid');
    return matchesSearch && matchesTab;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Monthly Dues</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Search and Tabs */}
      <View style={styles.filterSection}>
        <View style={styles.searchWrapper}>
          <Search color={colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search member..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color={colors.textSecondary} size={18} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabsContainer}>
          {(['All', 'Pending', 'Paid'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredDues}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        renderItem={({ item, index }) => {
          const isPaid = item.status === 'Paid';
          const dueVal = item.dueAmount ?? item.amount ?? 4500;
          const formattedAmount = typeof dueVal === 'number' ? dueVal.toLocaleString('en-IN') : dueVal;
          const itemId = item.id || item._id || `due-item-${index}`;
          return (
            <TouchableOpacity 
              style={styles.studentCard}
              activeOpacity={0.7}
              onPress={() => {
                if (isPaid && item.transactionId) {
                  navigation.navigate('TransactionDetails', { id: item.transactionId });
                } else if (!isPaid) {
                  navigation.navigate('CollectFee', { memberId: itemId, name: item.name, amount: dueVal });
                }
              }}
            >
              <View style={styles.studentLeft}>
                <View style={[
                  styles.avatarContainer, 
                  { backgroundColor: isPaid ? colors.successBg : colors.warningBg }
                ]}>
                  <Wallet color={isPaid ? colors.success : colors.warning} size={22} strokeWidth={2.5} />
                </View>
                <View>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.feeType}>{item.type || 'Room Rent'}</Text>
                </View>
              </View>

              <View style={styles.studentRight}>
                <Text style={styles.amountText}>₹{formattedAmount}</Text>
                {isPaid ? (
                  <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
                    <CheckCircle2 color={colors.success} size={14} strokeWidth={2.5} />
                    <Text style={[styles.statusText, { color: colors.success, marginLeft: 4 }]}>Paid</Text>
                  </View>
                ) : (
                  <View 
                    style={styles.collectButton} 
                  >
                    <Text style={styles.collectButtonText}>Collect</Text>
                    <ChevronRight color="#FFFFFF" size={14} strokeWidth={3} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No members found</Text>
          </View>
        }
      />
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
  filterSection: {
    backgroundColor: '#FFFFFF',
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginLeft: spacing.s,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: spacing.l,
    paddingBottom: 40,
    gap: spacing.m,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.m,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  feeType: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  studentRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  collectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  collectButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});
