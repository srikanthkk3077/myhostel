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
  Bell,
  BedDouble,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  User,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function UserDashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

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

  const notices = [
    { id: '1', title: 'Water Supply Issue', date: 'Today, 10:00 AM', priority: 'high' },
    { id: '2', title: 'Mess Menu Updated', date: 'Yesterday, 6:00 PM', priority: 'normal' },
    { id: '3', title: 'WiFi Maintenance', date: '12 Jun, 2:00 PM', priority: 'normal' },
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
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>Rahul Sharma</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileAvatar} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProfileTab')}>
              <Text style={styles.avatarText}>RS</Text>
            </TouchableOpacity>
          </View>

          {/* Rent Status Card */}
          <View style={styles.rentCard}>
            <View style={styles.rentHeader}>
              <View>
                <Text style={styles.rentLabel}>Current Month Rent</Text>
                <Text style={styles.rentAmount}>₹12,500</Text>
              </View>
              <View style={styles.statusBadgePending}>
                <AlertCircle color={colors.warning} size={14} strokeWidth={2.5} />
                <Text style={styles.statusTextPending}>Due in 3 days</Text>
              </View>
            </View>
            
            <View style={styles.rentFooter}>
              <Text style={styles.rentPeriod}>For: June 2026</Text>
              <TouchableOpacity 
                style={styles.payButton} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('PaymentsTab')}>
                <Text style={styles.payButtonText}>Pay Now</Text>
                <ChevronRight color="#FFFFFF" size={16} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Room Details Card */}
          <Text style={styles.sectionTitle}>Your Accommodation</Text>
          <View style={styles.roomCard}>
            <View style={styles.roomHeader}>
              <View style={styles.roomIconBox}>
                <BedDouble color={colors.primary} size={24} strokeWidth={2.5} />
              </View>
              <View style={styles.roomInfo}>
                <View style={styles.roomNumberRow}>
                  <Text style={styles.roomNumber}>Room 101</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>AC Double</Text>
                  </View>
                </View>
                <Text style={styles.bedNumber}>Bed A • 1st Floor</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.roommatesSection}>
              <View style={styles.roommatesHeader}>
                <Users color={colors.textSecondary} size={16} />
                <Text style={styles.roommatesLabel}>Your Roommate</Text>
              </View>
              <View style={styles.roommateRow}>
                <View style={styles.roommateAvatar}>
                  <Text style={styles.roommateAvatarText}>A</Text>
                </View>
                <View>
                  <Text style={styles.roommateName}>Amit Patel</Text>
                  <Text style={styles.roommateCourse}>B.Tech • 2nd Year</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ComplaintsTab')}>
              <View style={[styles.actionIconBox, { backgroundColor: colors.danger + '15' }]}>
                <AlertCircle color={colors.danger} size={24} />
              </View>
              <Text style={styles.actionTitle}>Raise{'\n'}Complaint</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MessRebate')}>
              <View style={[styles.actionIconBox, { backgroundColor: colors.info + '15' }]}>
                <CreditCard color={colors.info} size={24} />
              </View>
              <Text style={styles.actionTitle}>Mess{'\n'}Rebate</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('GatePass')}>
              <View style={[styles.actionIconBox, { backgroundColor: colors.warning + '15' }]}>
                <User color={colors.warning} size={24} />
              </View>
              <Text style={styles.actionTitle}>Gate{'\n'}Pass</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Notices */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Notices</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('NoticeBoard')}>
              <Text style={styles.seeAllText}>View Board</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.noticesList}>
            {notices.map((notice) => (
              <TouchableOpacity key={notice.id} style={styles.noticeCard} activeOpacity={0.8}>
                <View style={styles.noticeHeader}>
                  <View style={[
                    styles.noticeIconBox,
                    notice.priority === 'high' ? { backgroundColor: colors.dangerBg } : { backgroundColor: colors.primaryBg }
                  ]}>
                    <Bell 
                      color={notice.priority === 'high' ? colors.danger : colors.primary} 
                      size={18} 
                      strokeWidth={2.5} 
                    />
                  </View>
                  <Text style={styles.noticeDate}>{notice.date}</Text>
                </View>
                <Text style={styles.noticeTitle} numberOfLines={2}>{notice.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
    height: 240,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.2,
  },
  blob1: {
    width: 240,
    height: 240,
    backgroundColor: colors.primaryLight,
    top: -100,
    right: -60,
  },
  blob2: {
    width: 180,
    height: 180,
    backgroundColor: colors.secondary,
    top: 80,
    left: -40,
    opacity: 0.15,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  rentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.l,
  },
  rentLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rentAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  statusBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusTextPending: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
  },
  rentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
  },
  rentPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
    letterSpacing: -0.3,
  },
  roomCard: {
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
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  roomIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomInfo: {
    flex: 1,
  },
  roomNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginBottom: 4,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  bedNumber: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  roommatesSection: {},
  roommatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.m,
  },
  roommatesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  roommateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  roommateAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roommateAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.info,
  },
  roommateName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  roommateCourse: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actionCard: {
    width: (width - spacing.l * 2 - spacing.m * 2) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.m,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  noticesList: {
    paddingRight: spacing.l,
    gap: spacing.m,
  },
  noticeCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  noticeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
});
