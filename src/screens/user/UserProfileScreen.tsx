import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import {
  User,
  Phone,
  Mail,
  Shield,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function UserProfileScreen({ navigation }: any) {
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

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Premium Gradient Background */}
      <LinearGradient
        colors={['#0F766E', '#0D9488', '#14B8A6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 280 + insets.top }]}
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
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>

          {/* Floating Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={['#14B8A6', '#0D9488']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>RS</Text>
              </LinearGradient>
            </View>
            <Text style={styles.userName}>Rahul Sharma</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.userRole}>B.Tech • 3rd Year</Text>
            </View>
            
            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <View style={styles.contactIconBox}>
                  <Phone color={colors.textSecondary} size={16} strokeWidth={2.5} />
                </View>
                <Text style={styles.contactText}>+91 98765 43210</Text>
              </View>
              <View style={styles.contactDivider} />
              <View style={styles.contactItem}>
                <View style={styles.contactIconBox}>
                  <Mail color={colors.textSecondary} size={16} strokeWidth={2.5} />
                </View>
                <Text style={styles.contactText}>rahul@example.com</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('EditProfile')}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
                <User color="#16A34A" size={22} strokeWidth={2.5} />
              </View>
              <Text style={styles.menuLabel}>Edit Profile</Text>
              <ChevronRight color={colors.border} size={24} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('Security')}>
              <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Shield color="#2563EB" size={22} strokeWidth={2.5} />
              </View>
              <Text style={styles.menuLabel}>Security & Password</Text>
              <ChevronRight color={colors.border} size={24} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            {/* <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('Preferences')}>
              <View style={[styles.menuIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Settings color="#D97706" size={22} strokeWidth={2.5} />
              </View>
              <Text style={styles.menuLabel}>App Preferences</Text>
              <ChevronRight color={colors.border} size={24} />
            </TouchableOpacity> */}
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('HelpSupport')}>
              <View style={[styles.menuIconBox, { backgroundColor: '#FAF5FF' }]}>
                <HelpCircle color="#9333EA" size={22} strokeWidth={2.5} />
              </View>
              <Text style={styles.menuLabel}>Help & Support</Text>
              <ChevronRight color={colors.border} size={24} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.8}
            onPress={handleLogout}>
            <LogOut color={colors.danger} size={20} strokeWidth={2.5} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

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
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.s,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    paddingTop: 60,
    marginBottom: spacing.xl,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
  },
  avatarWrapper: {
    position: 'absolute',
    top: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  roleBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: spacing.xl,
  },
  userRole: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  contactContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.l,
    gap: spacing.m,
  },
  contactDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.l,
  },
  contactIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  contactText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.s,
    letterSpacing: -0.5,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  menuLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64, // Align with text
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 20,
    borderRadius: 24,
    gap: spacing.s,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.danger,
  },
});
