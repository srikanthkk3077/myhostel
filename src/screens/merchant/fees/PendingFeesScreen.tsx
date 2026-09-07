import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import {
  IndianRupee,
  History,
  AlertCircle,
  Plus,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  PieChart,
  Wallet,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { getFeeStats } from '../../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';

export default function PendingFeesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

  const [stats, setStats] = useState({ expectedRevenue: 0, received: 0, pending: 0 });
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await getFeeStats();
      if (response.status === 200 && response.data?.success) {
        setStats({
          expectedRevenue: response.data.data.expectedRevenue || 0,
          received: response.data.data.received || 0,
          pending: response.data.data.pending || 0,
        });
        setPendingStudents(response.data.data.recentDues || []);
      }
    } catch (error) {
      console.error('Error fetching fee stats', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(blobAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const blobY = blobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Header Background */}
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      >
        <Animated.View
          style={[styles.blob, styles.blob1, { transform: [{ translateY: blobY }] }]}
        />
        <Animated.View
          style={[styles.blob, styles.blob2, { transform: [{ translateY: blobY }] }]}
        />
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, marginTop: insets.top }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.titleLabel}>Hostel Finances</Text>
              <Text style={styles.title}>Revenue 💰</Text>
            </View>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
              <TrendingUp color="#16A34A" size={20} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Massive Fintech Revenue Card */}
          <View style={styles.revenueCard}>
            <View style={styles.revenueHeader}>
              <Text style={styles.revenueLabel}>Total Expected Revenue</Text>
              <View style={styles.revenueBadge}>
                <Sparkles color={colors.warning} size={12} strokeWidth={2.5} />
                <Text style={styles.revenueBadgeText}>This Month</Text>
              </View>
            </View>
            <Text style={styles.revenueAmount}>₹{stats.expectedRevenue.toLocaleString('en-IN')}</Text>
            
            <View style={styles.revenueDivider} />
            
            <View style={styles.subRevenueRow}>
              <View style={styles.subRevenueBox}>
                <View style={styles.subRevenueHeader}>
                  <View style={[styles.dot, { backgroundColor: colors.success }]} />
                  <Text style={styles.subRevenueLabel}>Received</Text>
                </View>
                <Text style={[styles.subRevenueValue, { color: colors.success }]}>₹{stats.received.toLocaleString('en-IN')}</Text>
              </View>
              
              <View style={styles.subRevenueDivider} />
              
              <View style={styles.subRevenueBox}>
                <View style={styles.subRevenueHeader}>
                  <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                  <Text style={styles.subRevenueLabel}>Pending</Text>
                </View>
                <Text style={[styles.subRevenueValue, { color: colors.warning }]}>₹{stats.pending.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              
              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('CollectFee')}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.primaryBg }]}>
                  <Plus color={colors.primary} size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionCardText} numberOfLines={1}>Collect Fee</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('PaymentHistory')}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.successBg }]}>
                  <History color={colors.success} size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionCardText} numberOfLines={1}>History</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ExpenseTracking')}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.warningBg }]}>
                  <PieChart color={colors.warning} size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionCardText} numberOfLines={1}>Expenses</Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* Pending Members List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Recent Dues</Text>
                <Text style={styles.sectionSubtitle}>Members with pending or recent payments</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('DuesList', { dues: pendingStudents })}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
              {pendingStudents.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyIconCircle}>
                    <Wallet color={colors.textTertiary} size={32} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.emptyTitle}>No Recent Dues</Text>
                  <Text style={styles.emptySubtitle}>All fee collections & transactions will appear here.</Text>
                </View>
              ) : (
                pendingStudents.slice(0, 3).map((student, idx) => {
                const isPaid = student.status === 'Paid';
                const dueVal = student.dueAmount ?? student.amount ?? 4500;
                const formattedAmount = typeof dueVal === 'number' ? dueVal.toLocaleString('en-IN') : dueVal;
                const studentId = student.id || student._id || `due-${idx}`;
                return (
                  <TouchableOpacity 
                    key={studentId} 
                    style={styles.studentCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (isPaid && student.transactionId) {
                        navigation.navigate('TransactionDetails', { id: student.transactionId });
                      } else if (!isPaid) {
                        navigation.navigate('CollectFee', { memberId: studentId, name: student.name, amount: dueVal });
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
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.feeType}>{student.type || 'Room Rent'}</Text>
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
              })
              )}
            </View>
          </View>
          
          {/* Spacer for bottom tabs */}
          <View style={{ height: 100 }} />

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
  },
  blob1: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: -120,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.4)',
    top: 100,
    left: -60,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    paddingTop: spacing.s,
  },
  titleLabel: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  revenueCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    marginBottom: spacing.xl,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  revenueLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  revenueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  revenueBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
  revenueAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1.5,
    marginBottom: spacing.l,
  },
  revenueDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.l,
  },
  subRevenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s,
  },
  subRevenueBox: {
    flex: 1,
  },
  subRevenueDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.m,
  },
  subRevenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subRevenueLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  subRevenueValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  seeAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.m,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  actionCardText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  listContainer: {
    gap: spacing.m,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
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
    letterSpacing: -0.3,
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
    letterSpacing: -0.5,
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.m,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
