import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ArrowLeft, CheckCircle2, AlertCircle, Download, FileText } from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentHistoryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const history = [
    { id: '1', name: 'Rahul Kumar', amount: 5000, date: '12 Jun 2026', method: 'UPI', status: 'Success' },
    { id: '2', name: 'Srikanth', amount: 2000, date: '10 Jun 2026', method: 'Cash', status: 'Success' },
    { id: '3', name: 'Amit Singh', amount: 4500, date: '08 Jun 2026', method: 'Bank Transfer', status: 'Failed' },
    { id: '4', name: 'Vikram', amount: 5000, date: '01 Jun 2026', method: 'UPI', status: 'Success' },
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
          <Text style={styles.headerTitle}>Transaction History</Text>
          <TouchableOpacity style={styles.downloadButton}>
            <Download color={colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {history.map((tx) => {
            const isSuccess = tx.status === 'Success';
            return (
              <View key={tx.id} style={styles.txCard}>
                <View style={styles.txLeft}>
                  <View style={[
                    styles.iconBox,
                    { backgroundColor: isSuccess ? colors.successBg : colors.dangerBg }
                  ]}>
                    <FileText color={isSuccess ? colors.success : colors.danger} size={20} />
                  </View>
                  <View>
                    <Text style={styles.txName}>{tx.name}</Text>
                    <Text style={styles.txDate}>{tx.date} • {tx.method}</Text>
                  </View>
                </View>
                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, !isSuccess && { color: colors.danger }]}>
                    {isSuccess ? '+' : ''}₹{tx.amount}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: isSuccess ? colors.successBg : colors.dangerBg }]}>
                    {isSuccess ? (
                      <CheckCircle2 color={colors.success} size={12} strokeWidth={3} />
                    ) : (
                      <AlertCircle color={colors.danger} size={12} strokeWidth={3} />
                    )}
                    <Text style={[styles.statusText, { color: isSuccess ? colors.success : colors.danger }]}>
                      {tx.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
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
    paddingBottom: 40,
  },
  listContainer: {
    gap: spacing.m,
  },
  txCard: {
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
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  txDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
