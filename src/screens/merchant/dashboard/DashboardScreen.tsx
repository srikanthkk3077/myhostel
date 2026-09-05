import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
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
  LogOut,
  X,
  Bell,
  Shield,
  RefreshCw,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import RevenueChart from '../../../components/RevenueChart';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getDashboardStats } from '../../../service/merchant';

const { width } = Dimensions.get('window');

// ── Helper ───────────────────────────────────────────────────────────────────
const formatCurrency = (amount: number): string => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

const formatTimeAgo = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};

// ── Types ────────────────────────────────────────────────────────────────────
interface DashboardStats {
  totalMembers: number;
  totalRooms: number;
  totalCapacity: number;
  totalOccupied: number;
  availableBeds: number;
  occupancyRate: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  pendingFees: number;
  monthlyRevenue?: { value: number; label: string }[];
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  detail: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [merchantName, setMerchantName] = useState('Admin');
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalRooms: 0,
    totalCapacity: 0,
    totalOccupied: 0,
    availableBeds: 0,
    occupancyRate: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    pendingFees: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Dummy trial days — replace with subscription model later
  const trialDaysLeft = 20;
  const isBannerVisible = showTrialBanner || trialDaysLeft <= 3;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(blobAnim, { toValue: 0, duration: 5000, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const blobY = blobAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });

  // ── Fetch dashboard data ─────────────────────────────────────────────────
  const fetchDashboard = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      const response = await getDashboardStats();

      if (response.status === 200 && response.data?.success) {
        const { merchant, stats: s, recentActivity: activity } = response.data.data;
        setMerchantName(merchant?.name || 'Admin');
        setStats(s);
        setRecentActivity(activity || []);
      }
    } catch (err) {
      console.log('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard]),
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitial = (name: string) => (name ? name[0].toUpperCase() : 'A');

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <LinearGradient
          colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
          Loading dashboard…
        </Text>
      </View>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Animated Header Background */}
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      >
        <Animated.View style={[styles.blob, styles.blob1, { transform: [{ translateY: blobY }] }]} />
        <Animated.View style={[styles.blob, styles.blob2, { transform: [{ translateY: blobY }] }]} />
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, marginTop: insets.top }}
        contentContainerStyle={[styles.scrollContent, { paddingTop: spacing.m }]}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Top Header ───────────────────────────────────────────────── */}
          <View style={styles.topBar}>
            <View style={styles.profileSection}>
              <TouchableOpacity
                style={styles.avatarWrapper}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitial(merchantName)}</Text>
                </View>
                <View style={styles.onlineDot} />
              </TouchableOpacity>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingLabel}>{getGreeting()} 👋</Text>
                <Text style={styles.greetingName}>{merchantName}</Text>
              </View>
            </View>
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.7}
                onPress={() => fetchDashboard(true)}>
                <RefreshCw
                  color={isRefreshing ? colors.primary : colors.text}
                  size={20}
                  strokeWidth={2.2}
                />
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

          {/* ── Trial Banner ─────────────────────────────────────────────── */}
          {/* {isBannerVisible && (
            <View style={styles.trialBanner}>
              <View style={styles.trialBannerLeft}>
                <View style={styles.trialIconBg}>
                  <Sparkles color="#FFFFFF" size={18} strokeWidth={2.5} />
                </View>
                <View style={styles.trialTextContent}>
                  <Text style={styles.trialTitle}>{trialDaysLeft} days left in Free Trial</Text>
                  <Text style={styles.trialSub}>Enjoying the app? Upgrade now!</Text>
                </View>
              </View>
              <View style={styles.trialBannerRight}>
                <TouchableOpacity
                  style={styles.trialUpgradeBtn}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('SubscriptionUpgrade')}>
                  <Text style={styles.trialUpgradeText}>Upgrade</Text>
                </TouchableOpacity>
                {trialDaysLeft > 3 && (
                  <TouchableOpacity
                    style={styles.trialCloseBtn}
                    onPress={() => setShowTrialBanner(false)}
                    activeOpacity={0.7}>
                    <X color="#9CA3AF" size={20} strokeWidth={2.5} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )} */}

          {/* ── Today's Overview Card ────────────────────────────────────── */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeLeft}>
              <Text style={styles.welcomeTitle}>Today's Overview</Text>
              <View style={styles.dateRow}>
                <Calendar color={colors.textSecondary} size={14} strokeWidth={2.2} />
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

          {/* ── Revenue Featured Card ────────────────────────────────────── */}
          <View style={styles.featuredCard}>
            <View style={styles.featuredHeader}>
              <View>
                <Text style={styles.featuredLabel}>Total Revenue</Text>
                <Text style={styles.featuredValue}>{formatCurrency(stats.totalRevenue)}</Text>
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
                <Text style={styles.featuredItemValue}>
                  {formatCurrency(stats.thisMonthRevenue)}
                </Text>
              </View>
              <View style={styles.featuredItemDivider} />
              <View style={styles.featuredItem}>
                <Text style={styles.featuredItemLabel}>Pending</Text>
                <Text style={[styles.featuredItemValue, { color: colors.danger }]}>
                  {formatCurrency(stats.pendingFees)}
                </Text>
              </View>
              <View style={styles.featuredItemDivider} />
              <View style={styles.featuredItem}>
                <Text style={styles.featuredItemLabel}>Rooms</Text>
                <Text style={[styles.featuredItemValue, { color: colors.primary }]}>
                  {stats.totalRooms}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Stats Grid ───────────────────────────────────────────────── */}
          <View style={styles.statsGrid}>
            {/* Row 1 */}
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
                <Text style={styles.miniStatValue}>{stats.totalMembers}</Text>
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
                <Text style={styles.miniStatValue}>{stats.availableBeds}</Text>
                <Text style={styles.miniStatLabel}>Available Beds</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
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
                <Text style={styles.miniStatValue}>{formatCurrency(stats.pendingFees)}</Text>
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
                <Text style={styles.miniStatValue}>{stats.occupancyRate}%</Text>
                <Text style={styles.miniStatLabel}>Occupancy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Quick Actions ─────────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllServices')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionsRow}>
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

          {/* ── Revenue Chart ─────────────────────────────────────────────── */}
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
            <RevenueChart
              currentRevenue={stats.totalRevenue}
              data={stats.monthlyRevenue}
            />
          </View>

          {/* ── Recent Activity ───────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => navigation.navigate('StudentsTab')}>
                <Text style={styles.seeAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              {recentActivity.length === 0 ? (
                <View style={styles.emptyActivity}>
                  <Users color={colors.textTertiary} size={32} strokeWidth={1.5} />
                  <Text style={styles.emptyActivityText}>No recent activity yet</Text>
                </View>
              ) : (
                recentActivity.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.activityItem}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('StudentsTab', { screen: 'StudentDetails', params: { memberId: item.id } })}>
                    <View style={[styles.activityIcon, { backgroundColor: colors.primaryBg }]}>
                      <UserCheck color={colors.primary} size={18} strokeWidth={2.5} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{item.title}</Text>
                      <Text style={styles.activityTime}>
                        {item.subtitle}
                        {item.detail ? ` · ${item.detail}` : ''}
                        {' · '}
                        {formatTimeAgo(item.createdAt)}
                      </Text>
                    </View>
                    <View style={[styles.activityBadge, { backgroundColor: colors.successBg }]}>
                      <Text style={[styles.activityBadgeText, { color: colors.success }]}>+1</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

          {/* Bottom padding */}
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
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
    height: 340,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
  },
  blob1: {
    width: 260,
    height: 260,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: -120,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.4)',
    top: 80,
    left: -60,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: 100,
  },
  // ── Header ────────────────────────────────────────────────────────────────
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
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16A34A',
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
    borderColor: '#FFFFFF',
  },
  greetingContainer: { justifyContent: 'center' },
  greetingLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // ── Trial Banner ──────────────────────────────────────────────────────────
  trialBanner: {
    backgroundColor: colors.text,
    borderRadius: 20,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  trialBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.m,
  },
  trialIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trialTextContent: { flex: 1 },
  trialTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  trialSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  trialBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  trialUpgradeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  trialUpgradeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  trialCloseBtn: { padding: 4, marginLeft: 2 },
  // ── Welcome Card ──────────────────────────────────────────────────────────
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.l,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  welcomeLeft: { flex: 1 },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  welcomeBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── Featured Revenue Card ─────────────────────────────────────────────────
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
  // ── Stats Grid ────────────────────────────────────────────────────────────
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  miniStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  miniIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniTrendUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  miniTrendDown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  miniTrendNeutral: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  miniTrendTextUp: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  miniTrendTextDown: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
  miniTrendTextNeutral: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  miniStatValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  miniStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  // ── Quick Actions ─────────────────────────────────────────────────────────
  section: { marginTop: spacing.l },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
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
    gap: spacing.m,
    paddingRight: spacing.l,
  },
  actionButton: {
    alignItems: 'center',
    width: 72,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  // ── Chart Card ────────────────────────────────────────────────────────────
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginTop: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
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
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── Activity ──────────────────────────────────────────────────────────────
  activityList: { gap: spacing.s },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.m,
    gap: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: { flex: 1 },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activityBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyActivityText: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});
