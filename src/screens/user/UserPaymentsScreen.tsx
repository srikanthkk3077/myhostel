import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import {
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Receipt,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function UserPaymentsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  const transactions = [
    { id: '1', title: 'June Rent', date: '01 Jun 2026', amount: 12500, status: 'unpaid' },
    { id: '2', title: 'May Rent', date: '01 May 2026', amount: 12500, status: 'paid' },
    { id: '3', title: 'Mess Fee - May', date: '01 May 2026', amount: 3000, status: 'paid' },
    { id: '4', title: 'Security Deposit', date: '15 Apr 2026', amount: 15000, status: 'paid' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Premium Gradient Background for Top Section */}
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 320 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.l }]} 
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>My Payments</Text>
            <TouchableOpacity style={styles.helpBtn}>
              <Text style={styles.helpBtnText}>Need Help?</Text>
            </TouchableOpacity>
          </View>

          {/* Elevated Dues Card */}
          <View style={styles.duesCard}>
            <View style={styles.duesTop}>
              <View style={styles.duesHeaderRow}>
                <View style={styles.iconCircle}>
                  <Receipt color={colors.primary} size={20} strokeWidth={2.5} />
                </View>
                <View style={styles.warningBadge}>
                  <AlertCircle color="#FFFFFF" size={14} strokeWidth={2.5} />
                  <Text style={styles.warningText}>Due in 3 days</Text>
                </View>
              </View>
              
              <Text style={styles.duesLabel}>TOTAL OUTSTANDING</Text>
              <View style={styles.amountRow}>
                <Text style={styles.currencySymbol}>₹</Text>
                <Text style={styles.duesAmount}>12,500</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => navigation.navigate('Checkout')}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.payNowButton}
              >
                <CreditCard color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.payNowText}>Pay Securely</Text>
                <ChevronRight color="#FFFFFF" size={20} style={{ position: 'absolute', right: 16 }} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {transactions.map((tx) => (
              <View key={tx.id} style={styles.txCard}>
                <View style={[
                  styles.txStatusStrip,
                  { backgroundColor: tx.status === 'paid' ? colors.success : colors.warning }
                ]} />
                <View style={styles.txContent}>
                  <View style={styles.txLeft}>
                    <View style={[
                      styles.txIconBox,
                      { backgroundColor: tx.status === 'paid' ? colors.successBg : colors.warningBg }
                    ]}>
                      {tx.status === 'paid' ? (
                        <CheckCircle2 color={colors.success} size={22} strokeWidth={2.5} />
                      ) : (
                        <AlertCircle color={colors.warning} size={22} strokeWidth={2.5} />
                      )}
                    </View>
                    <View>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <Text style={styles.txDate}>{tx.date}</Text>
                    </View>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[
                      styles.txAmount,
                      { color: tx.status === 'paid' ? colors.text : colors.warning }
                    ]}>₹{tx.amount}</Text>
                    {tx.status === 'paid' ? (
                      <TouchableOpacity 
                        style={styles.receiptBtn}
                        onPress={() => navigation.navigate('Receipt')}
                        activeOpacity={0.7}
                      >
                        <Download color={colors.primary} size={14} strokeWidth={2.5} />
                        <Text style={styles.receiptText}>Receipt</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.pendingText}>Awaiting Payment</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

        </Animated.View>
      </ScrollView>
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 150,
    left: -50,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.s,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  helpBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  helpBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  duesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: spacing.l,
    marginBottom: spacing.xxl,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  duesTop: {
    paddingHorizontal: spacing.s,
    paddingTop: spacing.s,
    marginBottom: spacing.l,
  },
  duesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duesLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 6,
    marginRight: 4,
  },
  duesAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -2,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  payNowButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
  },
  payNowText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    paddingHorizontal: spacing.s,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  transactionsList: {
    gap: spacing.m,
  },
  txCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  txStatusStrip: {
    width: 6,
    height: '100%',
  },
  txContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.l,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  txIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  txDate: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  txAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  receiptText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
  },
});
