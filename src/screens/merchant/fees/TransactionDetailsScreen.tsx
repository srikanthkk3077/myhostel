import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Receipt,
  User,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFeeById } from '../../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';

export default function TransactionDetailsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { id } = route.params || {};
  
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTransaction = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await getFeeById(id);
      if (response.status === 200 && response.data?.success) {
        setTransaction(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      Alert.alert('Error', 'Failed to load transaction details');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransaction();
    }, [id])
  );

  if (loading || !transaction) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isSuccess = transaction.status === 'Paid';
  const color = isSuccess ? colors.success : colors.danger;
  const dateObj = new Date(transaction.paymentDate);
  const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  const memberName = transaction.member?.name || 'Unknown Member';
  
  // Format reference: METHOD/TYPE/shortId
  let ref = '';
  if (transaction.paymentMethod === 'UPI') ref = `UPI/${String(transaction._id).slice(-9).toUpperCase()}`;
  else if (transaction.paymentMethod === 'Cash') ref = 'CASH';
  else if (transaction.paymentMethod === 'Bank') ref = `BANK/TXN${String(transaction._id).slice(-7).toUpperCase()}`;
  else if (transaction.paymentMethod === 'Other') ref = transaction.remarks || 'OTHER';

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
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Download color={colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Card */}
        <View style={styles.mainCard}>
          <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <Receipt color={color} size={32} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>{transaction.type}</Text>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color }]}>{isSuccess ? 'SUCCESS' : 'FAILED'}</Text>
          </View>
          <Text style={styles.amount}>+₹{transaction.amount.toLocaleString('en-IN')}</Text>
          <Text style={styles.date}>{dateStr} at {timeStr}</Text>
        </View>

        {/* Member Details */}
        <Text style={styles.sectionTitle}>Member Info</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{memberName}</Text>
          </View>
          {transaction.member?.room && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Room / Bed</Text>
                <Text style={styles.detailValue}>{transaction.member.room} / {transaction.member.bed}</Text>
              </View>
            </>
          )}
          {transaction.paymentMonth && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fee Month</Text>
                <Text style={styles.detailValue}>{transaction.paymentMonth}</Text>
              </View>
            </>
          )}
        </View>

        {/* Details Section */}
        <Text style={styles.sectionTitle}>Transaction Info</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{transaction.paymentMethod}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference No.</Text>
            <Text style={styles.detailValue}>{ref}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end', flex: 1, marginLeft: spacing.m }}>
              {isSuccess ? (
                <CheckCircle2 color={colors.success} size={14} strokeWidth={3} />
              ) : (
                <AlertCircle color={colors.danger} size={14} strokeWidth={3} />
              )}
              <Text style={[styles.detailValue, { color, flex: 0, marginLeft: 0 }]}>{transaction.status}</Text>
            </View>
          </View>
        </View>

        {/* Remarks Section */}
        {(transaction.remarks && transaction.remarks.trim() !== '') && (
          <>
            <Text style={styles.sectionTitle}>Remarks</Text>
            <View style={styles.descCard}>
              <Text style={styles.descText}>{transaction.remarks}</Text>
            </View>
          </>
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.l,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginBottom: spacing.m,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.m,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  descCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  descText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
