import React from 'react';
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
  ArrowDownRight,
  ArrowUpRight,
  Download,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MemberTransactionsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  
  // In a real app, member data would be passed via route params
  const memberName = 'David Wilson';

  const transactions = [
    { id: '1', type: 'credit', category: 'Rent Payment', amount: 5000, date: '12 Jun 2026', time: '10:30 AM', ref: 'UPI/123456789' },
    { id: '2', type: 'credit', category: 'Mess Fee', amount: 3000, date: '12 Jun 2026', time: '10:32 AM', ref: 'UPI/123456790' },
    { id: '3', type: 'debit', category: 'Late Fine Added', amount: 500, date: '05 Jun 2026', time: '09:00 AM', ref: 'SYS/LATEFEE' },
    { id: '4', type: 'credit', category: 'Rent Payment', amount: 5000, date: '10 May 2026', time: '02:15 PM', ref: 'CASH' },
    { id: '5', type: 'credit', category: 'Security Deposit', amount: 10000, date: '10 Mar 2026', time: '11:00 AM', ref: 'BANK/TXN9876' },
  ];

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
            <Text style={styles.headerSubtitle}>{memberName}</Text>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <Download color={colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Paid (YTD)</Text>
          <Text style={styles.summaryAmount}>₹23,000</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: colors.success }]} />
              <Text style={styles.summaryText}>Rent & Mess</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: colors.danger }]} />
              <Text style={styles.summaryText}>Fines</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>All Transactions</Text>
        
        <View style={styles.listContainer}>
          {transactions.map((txn) => {
            const isCredit = txn.type === 'credit';
            return (
              <View key={txn.id} style={styles.txnCard}>
                <View style={styles.txnLeft}>
                  <View style={[styles.iconBox, { backgroundColor: isCredit ? colors.successBg : colors.dangerBg }]}>
                    {isCredit ? (
                      <ArrowDownRight color={colors.success} size={20} strokeWidth={2.5} />
                    ) : (
                      <ArrowUpRight color={colors.danger} size={20} strokeWidth={2.5} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.txnTitle}>{txn.category}</Text>
                    <Text style={styles.txnDate}>{txn.date} • {txn.time}</Text>
                    <Text style={styles.txnRef}>Ref: {txn.ref}</Text>
                  </View>
                </View>
                <Text style={[styles.txnAmount, { color: isCredit ? colors.success : colors.danger }]}>
                  {isCredit ? '+' : '-'}₹{txn.amount}
                </Text>
              </View>
            );
          })}
        </View>
        
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
  scrollContent: {
    padding: spacing.l,
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
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  txnDate: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  txnRef: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
});
