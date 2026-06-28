import React, { useRef, useEffect } from 'react';
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

export default function PendingFeesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

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

  const pendingStudents = [
    { id: '1', name: 'Srikanth', type: 'Monthly Fee', amount: 5000, status: 'Pending' },
    { id: '2', name: 'Rahul Kumar', type: 'Monthly Fee', amount: 5000, status: 'Paid' },
    { id: '3', name: 'Amit Singh', type: 'Deposit', amount: 2000, status: 'Pending' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent={false} />

      {/* Header Background */}
      <View style={styles.headerBackground}>
        <Animated.View
          style={[styles.blob, styles.blob1, { transform: [{ translateY: blobY }] }]}
        />
        <Animated.View
          style={[styles.blob, styles.blob2, { transform: [{ translateY: blobY }] }]}
        />
      </View>

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
              <TrendingUp color="#FFFFFF" size={20} strokeWidth={2.2} />
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
            <Text style={styles.revenueAmount}>₹4,20,000</Text>
            
            <View style={styles.revenueDivider} />
            
            <View style={styles.subRevenueRow}>
              <View style={styles.subRevenueBox}>
                <View style={styles.subRevenueHeader}>
                  <View style={[styles.dot, { backgroundColor: colors.success }]} />
                  <Text style={styles.subRevenueLabel}>Received</Text>
                </View>
                <Text style={[styles.subRevenueValue, { color: colors.success }]}>₹3,75,000</Text>
              </View>
              
              <View style={styles.subRevenueDivider} />
              
              <View style={styles.subRevenueBox}>
                <View style={styles.subRevenueHeader}>
                  <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                  <Text style={styles.subRevenueLabel}>Pending</Text>
                </View>
                <Text style={[styles.subRevenueValue, { color: colors.warning }]}>₹45,000</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalActions}>
              
              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('CollectFee')}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.primaryBg }]}>
                  <Plus color={colors.primary} size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionCardText}>Collect</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('PaymentHistory')}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.successBg }]}>
                  <History color={colors.success} size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionCardText}>History</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ExpenseTracking')}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.warningBg }]}>
                  <PieChart color={colors.warning} size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionCardText}>Expenses</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>

          {/* Pending Members List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Recent Dues</Text>
                <Text style={styles.sectionSubtitle}>Members with pending or recent payments</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
              {pendingStudents.map((student) => {
                const isPaid = student.status === 'Paid';
                return (
                  <View key={student.id} style={styles.studentCard}>
                    <View style={styles.studentLeft}>
                      <View style={[
                        styles.avatarContainer, 
                        { backgroundColor: isPaid ? colors.successBg : colors.warningBg }
                      ]}>
                        <Wallet color={isPaid ? colors.success : colors.warning} size={22} strokeWidth={2.5} />
                      </View>
                      <View>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.feeType}>{student.type}</Text>
                      </View>
                    </View>

                    <View style={styles.studentRight}>
                      <Text style={styles.amountText}>₹{student.amount}</Text>
                      {isPaid ? (
                        <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
                          <CheckCircle2 color={colors.success} size={14} strokeWidth={2.5} />
                          <Text style={[styles.statusText, { color: colors.success, marginLeft: 4 }]}>Paid</Text>
                        </View>
                      ) : (
                        <TouchableOpacity 
                          style={styles.collectButton} 
                          activeOpacity={0.85}
                          onPress={() => navigation.navigate('CollectFee')}>
                          <Text style={styles.collectButtonText}>Collect</Text>
                          <ChevronRight color="#FFFFFF" size={14} strokeWidth={3} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
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
    height: 300,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.2,
  },
  blob1: {
    width: 280,
    height: 280,
    backgroundColor: colors.primaryLight,
    top: -120,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: colors.secondary,
    top: 100,
    left: -60,
    opacity: 0.15,
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
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
  horizontalActions: {
    gap: spacing.m,
    paddingRight: spacing.l,
  },
  actionCard: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 20,
    alignItems: 'center',
    width: 100,
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
});
