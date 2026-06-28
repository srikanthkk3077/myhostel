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
  RefreshControl,
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
import LinearGradient from 'react-native-linear-gradient';
import { getUserDashboard } from '../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function UserDashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getUserDashboard();
      if (response.status === 200 && response.data?.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user dashboard', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData(true);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(false);
  };

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

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userRole');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
          Loading dashboard…
        </Text>
      </View>
    );
  }

  if (data && !data.hasAdmission) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: spacing.xl }]}>
        <AlertCircle color={colors.warning} size={56} strokeWidth={2} />
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 16, textAlign: 'center' }}>
          No Active Admission
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
          Your phone number ({data.mobile}) is registered in the app, but no active hostel admission has been created for it yet.
        </Text>
        <Text style={{ fontSize: 13, color: colors.textTertiary, textAlign: 'center', marginTop: 12, fontStyle: 'italic' }}>
          Please ask your hostel manager or warden to register your details under this phone number.
        </Text>
        
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
          <TouchableOpacity 
            style={[styles.payButton, { backgroundColor: colors.border }]} 
            onPress={onRefresh}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.payButton, { backgroundColor: colors.danger }]} 
            onPress={handleLogout}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const rentInfo = data?.rent || { amount: 0, dueAmount: 0, isPaid: false, period: '-', status: 'No Dues' };
  const accommodation = data?.accommodation || { roomNumber: '-', roomType: '-', bed: '-', floor: '-' };
  const roommates = data?.roommates || [];
  const notices = data?.notices || [];

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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{data?.name || 'User'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileAvatar} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProfileTab')}>
              <Text style={styles.avatarText}>{getInitials(data?.name)}</Text>
            </TouchableOpacity>
          </View>

          {/* Rent Status Card */}
          <View style={styles.rentCard}>
            <View style={styles.rentHeader}>
              <View>
                <Text style={styles.rentLabel}>Current Month Rent</Text>
                <Text style={styles.rentAmount}>₹{rentInfo.amount}</Text>
              </View>
              <View style={rentInfo.isPaid ? {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.successBg,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 12,
                gap: 4,
              } : styles.statusBadgePending}>
                {rentInfo.isPaid ? (
                  <CheckCircle2 color={colors.success} size={14} strokeWidth={2.5} />
                ) : (
                  <AlertCircle color={colors.warning} size={14} strokeWidth={2.5} />
                )}
                <Text style={rentInfo.isPaid ? {
                  fontSize: 12,
                  fontWeight: '700',
                  color: colors.success,
                } : styles.statusTextPending}>{rentInfo.status}</Text>
              </View>
            </View>
            
            <View style={styles.rentFooter}>
              <Text style={styles.rentPeriod}>For: {rentInfo.period}</Text>
              {!rentInfo.isPaid && (
                <TouchableOpacity 
                  style={styles.payButton} 
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('PaymentsTab')}>
                  <Text style={styles.payButtonText}>Pay Now</Text>
                  <ChevronRight color="#FFFFFF" size={16} />
                </TouchableOpacity>
              )}
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
                  <Text style={styles.roomNumber}>Room {accommodation.roomNumber}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{accommodation.roomType}</Text>
                  </View>
                </View>
                <Text style={styles.bedNumber}>Bed {accommodation.bed} • Floor {accommodation.floor}</Text>
              </View>
            </View>

            {roommates.length > 0 && (
              <>
                <View style={styles.divider} />

                <View style={styles.roommatesSection}>
                  <View style={styles.roommatesHeader}>
                    <Users color={colors.textSecondary} size={16} />
                    <Text style={styles.roommatesLabel}>Your Roommate{roommates.length > 1 ? 's' : ''}</Text>
                  </View>
                  {roommates.map((roommate: any) => (
                    <View key={roommate.id} style={[styles.roommateRow, { marginBottom: 12 }]}>
                      <View style={styles.roommateAvatar}>
                        <Text style={styles.roommateAvatarText}>{getInitials(roommate.name)}</Text>
                      </View>
                      <View>
                        <Text style={styles.roommateName}>{roommate.name}</Text>
                        <Text style={styles.roommateCourse}>{roommate.course}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
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
              onPress={() => navigation.navigate('VisitorRequests')}>
              <View style={[styles.actionIconBox, { backgroundColor: colors.warning + '15' }]}>
                <User color={colors.warning} size={24} />
              </View>
              <Text style={styles.actionTitle}>Visitor{'\n'}Request</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Notices */}
          {notices.length > 0 && (
            <>
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
                {notices.map((notice: any) => (
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
            </>
          )}

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
    height: 260,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
  },
  blob1: {
    width: 240,
    height: 240,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: -100,
    right: -60,
  },
  blob2: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.4)',
    top: 80,
    left: -40,
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
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  profileAvatar: {
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
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
