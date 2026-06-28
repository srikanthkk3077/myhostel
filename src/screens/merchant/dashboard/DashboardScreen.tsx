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
  Pressable,
} from 'react-native';
import {
  Users,
  BedDouble,
  IndianRupee,
  UserCheck,
  AlertCircle,
  CreditCard,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Home,
  Wallet,
  MoreHorizontal,
  Coffee,
  Wrench,
  Bell,
  Shield,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import StatCard from '../../../components/StatCard';
import RevenueChart from '../../../components/RevenueChart';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent={false} />

      {/* Animated Header Background */}
      <View style={styles.headerBackground}>
        <Animated.View
          style={[
            styles.blob,
            styles.blob1,
            { transform: [{ translateY: blobY }] },
          ]}
        />
        <Animated.View
          style={[styles.blob, styles.blob2, { transform: [{ translateY: blobY }] }]}
        />
        <View style={styles.glowEffect} />
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: insets.top }}
        contentContainerStyle={[styles.scrollContent, { paddingTop: spacing.m }]}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          {/* Top Header Section */}
          <View style={styles.topBar}>
            <View style={styles.profileSection}>
              <TouchableOpacity 
                style={styles.avatarWrapper}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>A</Text>
                </View>
                <View style={styles.onlineDot} />
              </TouchableOpacity>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingLabel}>{getGreeting()} 👋</Text>
                <Text style={styles.greetingName}>Admin</Text>
              </View>
            </View>
            <View style={styles.topActions}>
              <TouchableOpacity 
                style={styles.iconButton} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('GlobalSearch')}>
                <Search color={colors.text} size={20} strokeWidth={2.2} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Notifications')}>
                <Bell color={colors.text} size={20} strokeWidth={2.2} />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Welcome Card with Date */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeLeft}>
              <Text style={styles.welcomeTitle}>Today's Overview</Text>
              <View style={styles.dateRow}>
                <Calendar color="rgba(255,255,255,0.85)" size={14} strokeWidth={2.2} />
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.welcomeBadge}>
              <Sparkles color={colors.warning} size={18} strokeWidth={2.5} />
            </View>
          </View>

          {/* Stats Grid - Featured Revenue Card + smaller stats */}
          <View style={styles.featuredCard}>
            <View style={styles.featuredHeader}>
              <View>
                <Text style={styles.featuredLabel}>Total Revenue</Text>
                <Text style={styles.featuredValue}>₹4,20,000</Text>
              </View>
              <View style={styles.featuredTrend}>
                <ArrowUpRight color={colors.success} size={14} strokeWidth={2.5} />
                <Text style={styles.trendPositive}>+12.5%</Text>
              </View>
            </View>
            <View style={styles.featuredDivider} />
            <View style={styles.featuredFooter}>
              <View style={styles.featuredItem}>
                <Text style={styles.featuredItemLabel}>This Month</Text>
                <Text style={styles.featuredItemValue}>₹2.8L</Text>
              </View>
              <View style={styles.featuredItemDivider} />
              <View style={styles.featuredItem}>
                <Text style={styles.featuredItemLabel}>Expenses</Text>
                <Text style={styles.featuredItemValue}>₹85K</Text>
              </View>
              <View style={styles.featuredItemDivider} />
              <View style={styles.featuredItem}>
                <Text style={styles.featuredItemLabel}>Profit</Text>
                <Text style={[styles.featuredItemValue, { color: colors.success }]}>₹1.95L</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={[styles.miniStat, { backgroundColor: '#EEF2FF' }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('StudentsTab')}>
                <View style={styles.miniStatHeader}>
                  <View style={[styles.miniIcon, { backgroundColor: colors.primary }]}>
                    <Users color="#FFFFFF" size={18} strokeWidth={2.5} />
                  </View>
                  <View style={styles.miniTrendUp}>
                    <ArrowUpRight color={colors.success} size={12} strokeWidth={2.5} />
                    <Text style={styles.miniTrendTextUp}>12%</Text>
                  </View>
                </View>
                <Text style={styles.miniStatValue}>156</Text>
                <Text style={styles.miniStatLabel}>Members</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.miniStat, { backgroundColor: '#ECFDF5' }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('RoomsTab')}>
                <View style={styles.miniStatHeader}>
                  <View style={[styles.miniIcon, { backgroundColor: colors.success }]}>
                    <BedDouble color="#FFFFFF" size={18} strokeWidth={2.5} />
                  </View>
                  <View style={styles.miniTrendNeutral}>
                    <Text style={styles.miniTrendTextNeutral}>—</Text>
                  </View>
                </View>
                <Text style={styles.miniStatValue}>24</Text>
                <Text style={styles.miniStatLabel}>Available Beds</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <TouchableOpacity
                style={[styles.miniStat, { backgroundColor: '#FEF2F2' }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('FeesTab')}>
                <View style={styles.miniStatHeader}>
                  <View style={[styles.miniIcon, { backgroundColor: colors.danger }]}>
                    <AlertCircle color="#FFFFFF" size={18} strokeWidth={2.5} />
                  </View>
                  <View style={styles.miniTrendDown}>
                    <ArrowDownRight color={colors.danger} size={12} strokeWidth={2.5} />
                    <Text style={styles.miniTrendTextDown}>5%</Text>
                  </View>
                </View>
                <Text style={styles.miniStatValue}>₹45K</Text>
                <Text style={styles.miniStatLabel}>Pending Fees</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.miniStat, { backgroundColor: '#FFFBEB' }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('RoomsTab')}>
                <View style={styles.miniStatHeader}>
                  <View style={[styles.miniIcon, { backgroundColor: colors.warning }]}>
                    <Activity color="#FFFFFF" size={18} strokeWidth={2.5} />
                  </View>
                  <View style={styles.miniTrendUp}>
                    <ArrowUpRight color={colors.success} size={12} strokeWidth={2.5} />
                    <Text style={styles.miniTrendTextUp}>8%</Text>
                  </View>
                </View>
                <Text style={styles.miniStatValue}>92%</Text>
                <Text style={styles.miniStatLabel}>Occupancy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllServices')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('StudentsTab', { screen: 'RegisterStudent' })}>
                <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                  <UserCheck color="#FFFFFF" size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionText}>New{'\n'}Admission</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('FeesTab', { screen: 'CollectFee' })}>
                <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
                  <CreditCard color="#FFFFFF" size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionText}>Collect{'\n'}Fees</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('DashboardTab', { screen: 'MessMenu' })}>
                <View style={[styles.actionIcon, { backgroundColor: colors.warning }]}>
                  <Coffee color="#FFFFFF" size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionText}>Mess{'\n'}Menu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('DashboardTab', { screen: 'ComplaintsList' })}>
                <View style={[styles.actionIcon, { backgroundColor: colors.danger }]}>
                  <Wrench color="#FFFFFF" size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionText}>Maintenance{'\n'}Issues</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('DashboardTab', { screen: 'NoticeBoard' })}>
                <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
                  <Bell color="#FFFFFF" size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionText}>Notice{'\n'}Board</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('DashboardTab', { screen: 'VisitorsList' })}>
                <View style={[styles.actionIcon, { backgroundColor: '#14B8A6' }]}>
                  <Shield color="#FFFFFF" size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionText}>Visitor{'\n'}Log</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('RoomsTab', { screen: 'AddRoom' })}>
                <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
                  <Home color="#FFFFFF" size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionText}>Add{'\n'}Room</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('FeesTab', { screen: 'ExpenseTracking' })}>
                <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Wallet color="#FFFFFF" size={22} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionText}>Expense{'\n'}Track</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Revenue Chart */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Revenue Analytics</Text>
                <Text style={styles.chartSubtitle}>Last 6 months performance</Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>
            <RevenueChart />
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: colors.primaryBg }]}>
                  <UserCheck color={colors.primary} size={18} strokeWidth={2.5} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>New member registered</Text>
                  <Text style={styles.activityTime}>Rahul Sharma · 2 min ago</Text>
                </View>
                <View style={[styles.activityBadge, { backgroundColor: colors.successBg }]}>
                  <Text style={[styles.activityBadgeText, { color: colors.success }]}>+1</Text>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: colors.successBg }]}>
                  <CreditCard color={colors.success} size={18} strokeWidth={2.5} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Fee payment received</Text>
                  <Text style={styles.activityTime}>Priya Patel · ₹12,500 · 15 min ago</Text>
                </View>
                <View style={[styles.activityBadge, { backgroundColor: colors.successBg }]}>
                  <IndianRupee color={colors.success} size={12} strokeWidth={2.5} />
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: colors.warningBg }]}>
                  <BedDouble color={colors.warning} size={18} strokeWidth={2.5} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Room 204 maintenance</Text>
                  <Text style={styles.activityTime}>Scheduled · 1 hour ago</Text>
                </View>
                <View style={[styles.activityBadge, { backgroundColor: colors.warningBg }]}>
                  <Text style={[styles.activityBadgeText, { color: colors.warning }]}>!</Text>
                </View>
              </View>
            </View>
          </View>
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
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.2,
  },
  blob1: {
    width: 260,
    height: 260,
    backgroundColor: colors.primaryLight,
    top: -120,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: colors.secondary,
    top: 80,
    left: -60,
    opacity: 0.15,
  },
  glowEffect: {
    position: 'absolute',
    width: width,
    height: 120,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.5,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    paddingTop: spacing.s,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  welcomeLeft: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  welcomeBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featuredLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  featuredValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  featuredTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 2,
  },
  trendPositive: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  featuredDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  featuredItemLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '500',
    marginBottom: 4,
  },
  featuredItemValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  featuredItemDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: spacing.s,
  },
  statsGrid: {
    gap: spacing.m,
    marginTop: spacing.m,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  miniStat: {
    flex: 1,
    borderRadius: 20,
    padding: spacing.m,
    minHeight: 110,
  },
  miniStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  miniIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniTrendUp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  miniTrendTextUp: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  miniTrendDown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  miniTrendTextDown: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.danger,
  },
  miniTrendNeutral: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  miniTrendTextNeutral: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  miniStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  miniStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginTop: spacing.xl,
    gap: spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.s,
    paddingHorizontal: 2,
  },
  actionButton: {
    width: 82,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.m,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginTop: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  chartSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityList: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
    gap: spacing.m,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  activityBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerBg,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: spacing.xl,
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
});
