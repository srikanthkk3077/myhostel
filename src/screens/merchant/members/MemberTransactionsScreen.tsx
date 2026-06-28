import React, { useEffect, useState, useCallback } from 'react';
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
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Receipt,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMemberTransactions } from '../../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  category: string;
  amount: number;
  date: string;
  time: string;
  ref: string;
  paymentMethod: string;
  remarks: string;
  status: string;
}

interface Summary {
  totalPaidYTD: number;
  totalFines: number;
}

export default function MemberTransactionsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { memberId, memberName } = route.params || {};

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalPaidYTD: 0, totalFines: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async (isRefresh = false) => {
    if (!memberId) {
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await getMemberTransactions(memberId);
      if (response.status === 200 && response.data?.success) {
        setTransactions(response.data.data.transactions || []);
        setSummary(response.data.data.summary || { totalPaidYTD: 0, totalFines: 0 });
      }
    } catch (error) {
      console.error('Error fetching member transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [memberId])
  );

  const onRefresh = () => fetchTransactions(true);

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
            <Text style={styles.headerTitle}>Transaction History</Text>
            <Text style={styles.headerSubtitle}>{memberName || 'Member'}</Text>
          </View>
          <TouchableOpacity style={styles.downloadButton} activeOpacity={0.8}>
            <Download color={colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading transactions…</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Paid (YTD)</Text>
            <Text style={styles.summaryAmount}>
              ₹{summary.totalPaidYTD.toLocaleString('en-IN')}
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryDot, { backgroundColor: colors.success }]} />
                <Text style={styles.summaryText}>Rent & Mess</Text>
              </View>
              {summary.totalFines > 0 && (
                <View style={styles.summaryItem}>
                  <View style={[styles.summaryDot, { backgroundColor: colors.danger }]} />
                  <Text style={styles.summaryText}>
                    Fines: ₹{summary.totalFines.toLocaleString('en-IN')}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>All Transactions</Text>

          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Receipt color={colors.textTertiary} size={48} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Transactions Yet</Text>
              <Text style={styles.emptySubtitle}>
                Fee payments for this member will appear here.
              </Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {transactions.map((txn) => {
                const isCredit = txn.type === 'credit';
                return (
                  <TouchableOpacity 
                    key={String(txn.id)} 
                    style={styles.txnCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('TransactionDetails', { id: txn.id })}
                  >
                    <View style={styles.txnLeft}>
                      <View
                        style={[
                          styles.iconBox,
                          { backgroundColor: isCredit ? colors.successBg : colors.dangerBg },
                        ]}>
                        {isCredit ? (
                          <ArrowDownRight color={colors.success} size={20} strokeWidth={2.5} />
                        ) : (
                          <ArrowUpRight color={colors.danger} size={20} strokeWidth={2.5} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.txnTitle}>{txn.category}</Text>
                        <Text style={styles.txnDate}>
                          {txn.date} • {txn.time}
                        </Text>
                        <Text style={styles.txnRef}>Ref: {txn.ref}</Text>
                      </View>
                    </View>
                    <View style={styles.txnRight}>
                      <Text
                        style={[
                          styles.txnAmount,
                          { color: isCredit ? colors.success : colors.danger },
                        ]}>
                        {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </Text>
                      <View
                        style={[
                          styles.methodBadge,
                          { backgroundColor: isCredit ? colors.successBg : colors.dangerBg },
                        ]}>
                        <Text
                          style={[
                            styles.methodText,
                            { color: isCredit ? colors.success : colors.danger },
                          ]}>
                          {txn.paymentMethod || txn.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scrollContent: {
    padding: spacing.l,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
    marginBottom: spacing.l,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  listContainer: {
    gap: spacing.m,
  },
  txnCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.m,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  txnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txnTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  txnDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  txnRef: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  txnRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  methodText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
