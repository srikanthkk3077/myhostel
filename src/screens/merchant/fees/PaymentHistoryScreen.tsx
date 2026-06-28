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
  Platform,
} from 'react-native';
import { ArrowLeft, CheckCircle2, AlertCircle, Download, FileText } from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFeeHistory } from '../../../service/merchant';

export default function PaymentHistoryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await getFeeHistory();
      if (response.status === 200 && response.data?.success) {
        setHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching fee history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
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
          <Text style={styles.headerTitle}>Transaction History</Text>
          <TouchableOpacity style={styles.downloadButton}>
            <Download color={colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          <View style={styles.listContainer}>
            {history.map((tx) => {
              const isSuccess = tx.status === 'Paid';
              return (
                <TouchableOpacity 
                  key={tx._id} 
                  style={styles.txCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('TransactionDetails', { id: tx._id })}
                >
                  <View style={styles.txLeft}>
                    <View style={[
                      styles.iconBox,
                      { backgroundColor: isSuccess ? colors.successBg : colors.dangerBg }
                    ]}>
                      <FileText color={isSuccess ? colors.success : colors.danger} size={20} />
                    </View>
                    <View>
                      <Text style={styles.txName}>{tx.member?.name || 'Unknown Member'}</Text>
                      <Text style={styles.txDate}>
                        {formatDate(tx.paymentDate)} • {tx.paymentMethod}
                      </Text>
                      {tx.remarks ? <Text style={styles.txRemarks}>{tx.remarks}</Text> : null}
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
                        {isSuccess ? 'Success' : 'Failed'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
    flex: 1,
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
  txRemarks: {
    fontSize: 11,
    color: colors.textTertiary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 6,
    marginLeft: spacing.s,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
