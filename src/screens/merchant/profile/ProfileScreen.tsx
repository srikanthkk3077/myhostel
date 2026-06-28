import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Building,
  CreditCard,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMe } from '../../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await getMe();
      if (response.status === 200 && response.data?.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  const menuSections = [
    {
      title: 'Account Settings',
      items: [
        { id: 'edit_profile', icon: User, title: 'Edit Profile', color: colors.primary },
        { id: 'notifications', icon: Bell, title: 'Notifications', color: colors.warning },
        { id: 'privacy', icon: Shield, title: 'Privacy & Security', color: colors.success },
      ],
    },
    {
      title: 'Hostel Management',
      items: [
        { id: 'subscription', icon: CreditCard, title: 'My Subscription', color: colors.primary, screen: 'SubscriptionUpgrade' },
        { id: 'hostel_details', icon: Building, title: 'Hostel Details', color: colors.info, screen: 'Dashboard' },
        { id: 'preferences', icon: Settings, title: 'App Preferences', color: '#8B5CF6', screen: 'Dashboard' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', icon: HelpCircle, title: 'Help & Support', color: colors.textSecondary },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userRole');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {loading ? (
             <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.xl }} />
          ) : (
            <>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(profile?.name || 'Admin')}</Text>
                </View>
                <TouchableOpacity style={styles.editAvatarBtn}>
                  <Settings color="#FFFFFF" size={12} strokeWidth={3} />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{profile?.name || 'Admin'}</Text>
              <Text style={styles.userRole}>
                {profile?.role === 'merchant' ? 'Hostel Owner' : profile?.role || 'User'} • ID: {profile?._id?.substring(profile._id.length - 6).toUpperCase() || 'HM-2024'}
              </Text>
              <Text style={[styles.userRole, { marginTop: 4, color: colors.textTertiary, fontSize: 12 }]}>
                {profile?.email}
              </Text>
            </>
          )}
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => (item as any).screen ? navigation.navigate((item as any).screen) : null}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: item.color + '15' }]}>
                      <item.icon color={item.color} size={20} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                  </View>
                  <ChevronRight color={colors.textTertiary} size={20} strokeWidth={2.5} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <LogOut color={colors.danger} size={20} strokeWidth={2.5} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>App Version 1.0.0</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.l,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.m,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  sectionContainer: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.m,
    marginLeft: spacing.s,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.m,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    backgroundColor: colors.dangerBg,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: spacing.m,
    marginBottom: spacing.xl,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.danger,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});
