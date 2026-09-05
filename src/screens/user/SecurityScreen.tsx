import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Smartphone,
  KeyRound,
  UserCheck,
  Globe,
  Database,
  Trash2,
  Fingerprint,
  HardDrive,
  Shield,
  Download,
  LogOut,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { changePassword } from '../../service/merchant';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SecurityScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Active section tab: 'all' | 'password' | 'privacy' | 'devices'
  const [activeCategory, setActiveCategory] = useState<'all' | 'password' | 'privacy' | 'devices'>('all');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Security Toggles
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoLockTime, setAutoLockTime] = useState<'1m' | '5m' | '15m' | 'never'>('5m');

  // Privacy Toggles
  const [sharePhoneWithRoommates, setSharePhoneWithRoommates] = useState(true);
  const [showInDirectory, setShowInDirectory] = useState(true);
  const [maskVisitorLogs, setMaskVisitorLogs] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  // Device management mock state
  const [otherSessions, setOtherSessions] = useState([
    { id: '1', device: 'Chrome Browser (Windows 11)', location: 'Bengaluru, IN', lastActive: '2 hours ago', icon: Globe },
    { id: '2', device: 'iPad Air (iOS 17)', location: 'Mumbai, IN', lastActive: '3 days ago', icon: Smartphone },
  ]);

  const [cacheSize, setCacheSize] = useState('14.8 MB');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Load persisted settings
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const bio = await AsyncStorage.getItem('@security_biometric');
      const twoFa = await AsyncStorage.getItem('@security_2fa');
      const lock = await AsyncStorage.getItem('@security_autolock');
      const phoneVis = await AsyncStorage.getItem('@privacy_share_phone');
      const dirVis = await AsyncStorage.getItem('@privacy_show_directory');
      const maskVis = await AsyncStorage.getItem('@privacy_mask_visitors');

      if (bio !== null) setBiometricEnabled(bio === 'true');
      if (twoFa !== null) setTwoFactorEnabled(twoFa === 'true');
      if (lock) setAutoLockTime(lock as any);
      if (phoneVis !== null) setSharePhoneWithRoommates(phoneVis === 'true');
      if (dirVis !== null) setShowInDirectory(dirVis === 'true');
      if (maskVis !== null) setMaskVisitorLogs(maskVis === 'true');
    } catch (e) {
      console.log('Error loading security settings:', e);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log('Error saving setting:', e);
    }
  };

  // Password validation strength calculation
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: '', color: colors.border };
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#EF4444' };
    if (score <= 4) return { score: 2, label: 'Medium', color: '#F59E0B' };
    return { score: 3, label: 'Strong', color: '#10B981' };
  };

  const strength = getPasswordStrength();

  const handlePasswordChange = async () => {
    if (!currentPassword.trim()) {
      return Alert.alert('Validation Error', 'Please enter your current password.');
    }
    if (!newPassword.trim()) {
      return Alert.alert('Validation Error', 'Please enter your new password.');
    }
    if (newPassword.length < 6) {
      return Alert.alert('Validation Error', 'New password must be at least 6 characters long.');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Validation Error', 'New password and confirm password do not match.');
    }

    setUpdating(true);
    try {
      const response = await changePassword({ currentPassword, newPassword });
      if (response.status === 200 && response.data?.success) {
        Alert.alert('Success', 'Password updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to update password.');
      }
    } catch (error: any) {
      console.error('Failed to change password', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong while updating password.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleRevokeSessions = () => {
    Alert.alert(
      'Log Out Other Sessions',
      'Are you sure you want to log out from all other devices?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out All',
          style: 'destructive',
          onPress: () => {
            setOtherSessions([]);
            Alert.alert('Sessions Terminated', 'All other active sessions have been logged out.');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear local temporary files and image cache. Your login credentials will remain intact.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Now',
          onPress: () => {
            setCacheSize('0 KB');
            Alert.alert('Success', 'App cache cleared successfully!');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Personal Data',
      'A zip file containing your personal profile, payment history, and hostel records will be prepared and sent to your email.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Export',
          onPress: () => {
            Alert.alert('Request Submitted', 'Export file will be sent to your registered email address within 24 hours.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Account Deletion Request',
      'Are you sure you want to request permanent account deletion? This action cannot be undone and will delete all user records.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Deletion',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Deletion Request Received',
              'Your request has been registered. An administrator will review and contact you within 2 business days.'
            );
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header Background */}
      <LinearGradient
        colors={['#0F766E', '#0D9488', '#14B8A6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 220 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>

      {/* Header Top Bar */}
      <View style={[styles.headerTop, { paddingTop: insets.top + spacing.s }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}>
          <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>

          {/* Security Score Banner */}
          <View style={styles.securityScoreCard}>
            <View style={styles.scoreIconBox}>
              <ShieldCheck color="#16A34A" size={32} strokeWidth={2.5} />
            </View>
            <View style={styles.scoreInfo}>
              <View style={styles.scoreHeaderRow}>
                <Text style={styles.scoreTitle}>Security Health</Text>
                <View style={styles.badgeGood}>
                  <Text style={styles.badgeText}>95% Excellent</Text>
                </View>
              </View>
              <Text style={styles.scoreSubtitle}>
                Your account privacy settings are well configured.
              </Text>
            </View>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsContainer}>
            {[
              { id: 'all', label: 'All Settings' },
              { id: 'password', label: 'Password' },
              { id: 'privacy', label: 'Privacy' },
              { id: 'devices', label: 'Devices' },
            ].map((pill) => {
              const isSelected = activeCategory === pill.id;
              return (
                <TouchableOpacity
                  key={pill.id}
                  style={[styles.pill, isSelected && styles.pillActive]}
                  onPress={() => setActiveCategory(pill.id as any)}
                  activeOpacity={0.8}>
                  <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                    {pill.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* SECTION 1: Password & Authentication */}
          {(activeCategory === 'all' || activeCategory === 'password') && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <KeyRound color={colors.primary} size={22} strokeWidth={2.5} />
                <Text style={styles.cardTitle}>Password Management</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrent}
                    placeholder="Enter current password"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <EyeOff color={colors.textSecondary} size={20} /> : <Eye color={colors.textSecondary} size={20} />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNew}
                    placeholder="Enter new password"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff color={colors.textSecondary} size={20} /> : <Eye color={colors.textSecondary} size={20} />}
                  </TouchableOpacity>
                </View>

                {/* Password Strength Meter */}
                {newPassword.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBarBg}>
                      <View
                        style={[
                          styles.strengthBarFill,
                          {
                            width: `${(strength.score / 3) * 100}%`,
                            backgroundColor: strength.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.strengthText, { color: strength.color }]}>
                      Strength: {strength.label}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirm}
                    placeholder="Re-enter new password"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff color={colors.textSecondary} size={20} /> : <Eye color={colors.textSecondary} size={20} />}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePasswordChange}
                disabled={updating}
                style={{ marginTop: spacing.s }}>
                <LinearGradient
                  colors={['#0D9488', '#0F766E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.saveButton, updating && { opacity: 0.7 }]}>
                  {updating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Update Password</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* SECTION 2: App & Biometric Security */}
          {(activeCategory === 'all' || activeCategory === 'password') && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <Lock color="#2563EB" size={22} strokeWidth={2.5} />
                <Text style={styles.cardTitle}>App Security</Text>
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleIconBox}>
                  <Fingerprint color="#2563EB" size={22} />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Biometric Authentication</Text>
                  <Text style={styles.toggleSubtitle}>Use Face ID / Fingerprint to unlock app</Text>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={(val) => {
                    setBiometricEnabled(val);
                    saveSetting('@security_biometric', String(val));
                  }}
                  trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                  thumbColor={biometricEnabled ? '#2563EB' : '#94A3B8'}
                />
              </View>


            </View>
          )}

          {/* SECTION 3: Privacy & Visibility Settings */}
          {/* {(activeCategory === 'all' || activeCategory === 'privacy') && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <UserCheck color="#9333EA" size={22} strokeWidth={2.5} />
                <Text style={styles.cardTitle}>Privacy Preferences</Text>
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Share Phone with Roommates</Text>
                  <Text style={styles.toggleSubtitle}>Allow assigned roommates to see phone number</Text>
                </View>
                <Switch
                  value={sharePhoneWithRoommates}
                  onValueChange={(val) => {
                    setSharePhoneWithRoommates(val);
                    saveSetting('@privacy_share_phone', String(val));
                  }}
                  trackColor={{ false: '#E2E8F0', true: '#E9D5FF' }}
                  thumbColor={sharePhoneWithRoommates ? '#9333EA' : '#94A3B8'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Hostel Directory Profile</Text>
                  <Text style={styles.toggleSubtitle}>Show name & room in resident listing</Text>
                </View>
                <Switch
                  value={showInDirectory}
                  onValueChange={(val) => {
                    setShowInDirectory(val);
                    saveSetting('@privacy_show_directory', String(val));
                  }}
                  trackColor={{ false: '#E2E8F0', true: '#E9D5FF' }}
                  thumbColor={showInDirectory ? '#9333EA' : '#94A3B8'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Mask Visitor Phone Logs</Text>
                  <Text style={styles.toggleSubtitle}>Hide phone digits in visitor request history</Text>
                </View>
                <Switch
                  value={maskVisitorLogs}
                  onValueChange={(val) => {
                    setMaskVisitorLogs(val);
                    saveSetting('@privacy_mask_visitors', String(val));
                  }}
                  trackColor={{ false: '#E2E8F0', true: '#E9D5FF' }}
                  thumbColor={maskVisitorLogs ? '#9333EA' : '#94A3B8'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Usage Diagnostics</Text>
                  <Text style={styles.toggleSubtitle}>Share crash logs to improve stability</Text>
                </View>
                <Switch
                  value={analyticsConsent}
                  onValueChange={setAnalyticsConsent}
                  trackColor={{ false: '#E2E8F0', true: '#E9D5FF' }}
                  thumbColor={analyticsConsent ? '#9333EA' : '#94A3B8'}
                />
              </View>
            </View>
          )} */}

          {/* SECTION 4: Active Logged-in Devices */}
          {(activeCategory === 'all' || activeCategory === 'devices') && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <Smartphone color="#D97706" size={22} strokeWidth={2.5} />
                <Text style={styles.cardTitle}>Active Sessions & Devices</Text>
              </View>

              <View style={styles.deviceItemCurrent}>
                <View style={styles.deviceIconCurrent}>
                  <Smartphone color="#0D9488" size={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.deviceName}>Current Device</Text>
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>Active Now</Text>
                    </View>
                  </View>
                  <Text style={styles.deviceSub}>Mobile App • Last updated just now</Text>
                </View>
              </View>

              {otherSessions.map((session) => (
                <View key={session.id} style={styles.deviceItem}>
                  <View style={styles.deviceIcon}>
                    <session.icon color={colors.textSecondary} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deviceName}>{session.device}</Text>
                    <Text style={styles.deviceSub}>{session.location} • {session.lastActive}</Text>
                  </View>
                </View>
              ))}

              {otherSessions.length > 0 && (
                <TouchableOpacity
                  style={styles.revokeButton}
                  onPress={handleRevokeSessions}
                  activeOpacity={0.8}>
                  <LogOut color={colors.danger} size={18} />
                  <Text style={styles.revokeButtonText}>Log Out Other Devices</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* SECTION 5: Data & Privacy Management */}
          {(activeCategory === 'all' || activeCategory === 'privacy') && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <Database color="#6366F1" size={22} strokeWidth={2.5} />
                <Text style={styles.cardTitle}>Data & Storage Management</Text>
              </View>

              {/* <View style={styles.divider} /> */}

              <TouchableOpacity style={styles.actionRow} onPress={handleExportData} activeOpacity={0.7}>
                <View style={[styles.actionIconBox, { backgroundColor: '#F0FDF4' }]}>
                  <Download color="#16A34A" size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionTitle}>Export My Data</Text>
                  <Text style={styles.actionSubtitle}>Receive an archive of payments and records</Text>
                </View>
                <Text style={[styles.actionBadge, { color: '#16A34A' }]}>Download</Text>
              </TouchableOpacity>

              <View style={styles.divider} />
            </View>
          )}

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -60,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20,
    left: -30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 40,
    paddingTop: spacing.m,
  },
  securityScoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  scoreIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scoreTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  badgeGood: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  scoreSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterPillsContainer: {
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginBottom: spacing.m,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    marginLeft: 2,
  },
  passwordWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.l,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  eyeBtn: {
    position: 'absolute',
    right: spacing.m,
    top: 14,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginTop: 8,
    marginLeft: 4,
  },
  strengthBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '700',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  toggleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: spacing.s,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.m,
  },
  sublabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  lockTimeContainer: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  lockTimeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  lockTimeChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  lockTimeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  lockTimeChipTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  deviceItemCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: spacing.m,
  },
  deviceIconCurrent: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  deviceSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeTag: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.s,
    marginBottom: spacing.s,
  },
  deviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  revokeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: spacing.s,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  revokeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});
