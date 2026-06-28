import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { getFeeById } from '../../service/merchant';

export default function ReceiptScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { feeId } = route.params || {};
  
  const [loading, setLoading] = useState(true);
  const [fee, setFee] = useState<any>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const fetchReceipt = async () => {
    if (!feeId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await getFeeById(feeId);
      if (response.status === 200 && response.data?.success) {
        setFee(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch receipt', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipt();
  }, [feeId]);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
          delay: 200,
        })
      ]).start();
    }
  }, [loading]);

  const formatReceiptDate = (dateString: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}, ${timeStr}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
          Fetching receipt details…
        </Text>
      </View>
    );
  }

  const amount = fee ? fee.amount : 12500;
  const txId = fee ? `TXN-${fee._id.toString().toUpperCase()}` : 'TXN-9876543210';
  const dateTime = fee ? formatReceiptDate(fee.paymentDate) : '01 Jun 2026, 10:45 AM';
  const method = fee ? fee.paymentMethod || 'UPI' : 'UPI (GPay)';
  const status = fee ? (fee.status === 'Paid' ? 'Completed' : fee.status) : 'Completed';
  
  // Breakdown calculations
  const messAmount = Math.min(2500, amount);
  const rentAmount = amount - messAmount;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#065F46', '#047857', '#10B981']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 280 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>
 
      <View style={[styles.headerTop, { paddingTop: insets.top + spacing.m }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Receipt</Text>
        <View style={{ width: 40 }} />
      </View>
 
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          <View style={styles.receiptCard}>
            <Animated.View style={[styles.successIconWrapper, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.successIconInner}>
                <CheckCircle2 color={colors.success} size={48} strokeWidth={3} />
              </View>
            </Animated.View>
            
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successDesc}>Your payment has been processed successfully.</Text>
            
            <View style={styles.amountBox}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.amountValue}>{amount.toLocaleString('en-IN')}</Text>
            </View>
 
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction ID</Text>
                <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">{txId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{dateTime}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailValue}>{method}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{status}</Text>
                </View>
              </View>
            </View>
 
            <View style={styles.dividerContainer}>
              <View style={styles.notchLeft} />
              <View style={styles.dashedLine} />
              <View style={styles.notchRight} />
            </View>
 
            <Text style={styles.breakdownTitle}>Bill Breakdown</Text>
            {rentAmount > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billItem}>Room Rent</Text>
                <Text style={styles.billAmount}>₹{rentAmount.toLocaleString('en-IN')}</Text>
              </View>
            )}
            {messAmount > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billItem}>Mess Fee</Text>
                <Text style={styles.billAmount}>₹{messAmount.toLocaleString('en-IN')}</Text>
              </View>
            )}
            <View style={[styles.billRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalAmount}>₹{amount.toLocaleString('en-IN')}</Text>
            </View>
            
          </View>
 
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.m }]}>
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={['#047857', '#065F46']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.downloadButton}
          >
            <Download color="#FFFFFF" size={20} strokeWidth={2.5} />
            <Text style={styles.downloadButtonText}>Download Receipt PDF</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -100,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 150,
    left: -20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s,
    marginBottom: spacing.xxl,
    zIndex: 10,
  },
  backButton: {
    padding: spacing.s,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 40,
    paddingTop: 60,
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    alignItems: 'center',
  },
  successIconWrapper: {
    position: 'absolute',
    top: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 10,
  },
  successIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  successDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontWeight: '500',
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.l,
    borderRadius: 24,
    marginBottom: spacing.xl,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.success,
    marginTop: 6,
    marginRight: 4,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: -2,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: spacing.l,
    gap: spacing.m,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.m,
  },
  statusBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '800',
  },
  dividerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    position: 'relative',
  },
  notchLeft: {
    position: 'absolute',
    left: -spacing.xl - 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  notchRight: {
    position: 'absolute',
    right: -spacing.xl - 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    borderStyle: 'dashed',
    marginHorizontal: spacing.l,
  },
  breakdownTitle: {
    width: '100%',
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.l,
  },
  billRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  billItem: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  billAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  totalRow: {
    marginTop: spacing.s,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.success,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  downloadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
