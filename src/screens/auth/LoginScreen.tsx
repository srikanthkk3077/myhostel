import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  Shield,
  Sparkles,
  User,
  X,
  KeyRound,
  CheckCircle2,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, forgotPassword, resetPassword } from '../../service/hostelServices';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<'User' | 'merchant'>('User');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      
      if (response.status === 200 && response.data?.success) {
        const role = response.data.user?.role || accountType;
        if (response.data.token) {
           await AsyncStorage.setItem('authToken', response.data.token);
           await AsyncStorage.setItem('userRole', role);
        }
        if (role === 'merchant') {
          navigation.replace('Dashboard');
        } else {
          navigation.replace('UserDashboard');
        }
      } else {
        Alert.alert('Login Failed', response.data?.message || 'Invalid email or password');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Modal States
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1 = Request code, 2 = Verify & reset
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [devOtpHelper, setDevOtpHelper] = useState('');

  const handleRequestOtp = async () => {
    if (!forgotEmail.trim()) {
      Alert.alert('Error', 'Please enter your email or phone number.');
      return;
    }
    setForgotLoading(true);
    try {
      const response = await forgotPassword({ email: forgotEmail.trim() });
      if (response.status === 200 && response.data?.success) {
        if (response.data.otp) {
          setDevOtpHelper(response.data.otp);
        }
        Alert.alert('Success', `Reset code generated!`);
        setResetStep(2);
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to request reset code.');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetOtp.trim()) {
      Alert.alert('Error', 'Please enter the 6-digit OTP code.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setForgotLoading(true);
    try {
      const response = await resetPassword({
        email: forgotEmail.trim(),
        otp: resetOtp.trim(),
        newPassword: newPassword,
      });

      if (response.status === 200 && response.data?.success) {
        Alert.alert('Success', 'Password has been reset successfully! You can now log in.');
        setForgotModalVisible(false);
        setForgotEmail('');
        setResetStep(1);
        setResetOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setDevOtpHelper('');
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;

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
        Animated.timing(blob1Anim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(blob1Anim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blob2Anim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(blob2Anim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const blob1Y = blob1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });
  const blob2Y = blob2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Gradient Header Background */}
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      >
        <Animated.View
          style={[
            styles.blob,
            styles.blob1,
            { transform: [{ translateY: blob1Y }] },
          ]}
        />
        <Animated.View
          style={[
            styles.blob,
            styles.blob2,
            { transform: [{ translateY: blob2Y }] },
          ]}
        />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          style={{ flex: 1, marginTop: insets.top }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
          {/* Top Brand Section */}
          <View style={styles.brandSection}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoInner}>
                <Building2 color="#16A34A" size={28} strokeWidth={2.5} />
              </View>
              <View style={styles.sparkleBadge}>
                <Sparkles color={colors.warning} size={14} strokeWidth={2.5} />
              </View>
            </View>
            <Text style={styles.brandTitle}>MyHostel</Text>
            <Text style={styles.brandSubtitle}>Smart Hostel Management</Text>
          </View>

          {/* Floating Form Card */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Welcome Back 👋</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            {/* Role Toggle */}
            {/* <View style={styles.roleToggleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, accountType === 'User' && styles.roleButtonActive]}
                activeOpacity={0.8}
                onPress={() => setAccountType('User')}>
                <User color={accountType === 'User' ? '#FFFFFF' : colors.textSecondary} size={18} strokeWidth={2.5} />
                <Text style={[styles.roleText, accountType === 'User' && styles.roleTextActive]}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, accountType === 'merchant' && styles.roleButtonActive]}
                activeOpacity={0.8}
                onPress={() => setAccountType('merchant')}>
                <Building2 color={accountType === 'merchant' ? '#FFFFFF' : colors.textSecondary} size={18} strokeWidth={2.5} />
                <Text style={[styles.roleText, accountType === 'merchant' && styles.roleTextActive]}>Hostel Owner</Text>
              </TouchableOpacity>
            </View> */}

            {/* Email Input */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Email or Phone Number</Text>
              <Pressable
                onPress={() => setFocusedField('email')}
                style={[
                  styles.inputContainer,
                  focusedField === 'email' && styles.inputContainerFocused,
                ]}>
                <View
                  style={[
                    styles.iconBox,
                    focusedField === 'email' && styles.iconBoxFocused,
                  ]}>
                  <Mail
                    color={focusedField === 'email' ? colors.primary : colors.textSecondary}
                    size={18}
                    strokeWidth={2.2}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email or phone number"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="default"
                  autoCapitalize="none"
                />
              </Pressable>
            </View>

            {/* Password Input */}
            <View style={styles.fieldWrapper}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setForgotModalVisible(true)}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <Pressable
                onPress={() => setFocusedField('password')}
                style={[
                  styles.inputContainer,
                  focusedField === 'password' && styles.inputContainerFocused,
                ]}>
                <View
                  style={[
                    styles.iconBox,
                    focusedField === 'password' && styles.iconBoxFocused,
                  ]}>
                  <Lock
                    color={focusedField === 'password' ? colors.primary : colors.textSecondary}
                    size={18}
                    strokeWidth={2.2}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  activeOpacity={0.7}>
                  {showPassword ? (
                    <EyeOff color={colors.textSecondary} size={18} />
                  ) : (
                    <Eye color={colors.textSecondary} size={18} />
                  )}
                </TouchableOpacity>
              </Pressable>
            </View>

            {/* Remember Me */}
            <TouchableOpacity style={styles.rememberRow} activeOpacity={0.7}>
              <View style={styles.checkbox}>
                <View style={styles.checkboxInner} />
              </View>
              <Text style={styles.rememberText}>Remember me for 30 days</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleLogin}>
              <View style={styles.buttonShine} />
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <View style={styles.buttonIconBox}>
                    <ArrowRight color={colors.primary} size={18} strokeWidth={2.5} />
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Badge */}
          <View style={styles.trustBadge}>
            <Shield color={colors.success} size={14} strokeWidth={2.2} />
            <Text style={styles.trustText}>Secured with 256-bit encryption</Text>
          </View>
        </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={forgotModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalKeyboardAvoiding}
          >
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <TouchableOpacity
                  onPress={() => setForgotModalVisible(false)}
                  style={styles.closeButton}
                >
                  <X color={colors.text} size={20} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>

              {resetStep === 1 ? (
                /* Step 1: Request OTP code */
                <View style={styles.modalBody}>
                  <Text style={styles.modalInstructions}>
                    Enter the email address or phone number associated with your account to request a password reset code.
                  </Text>
                  
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Email / Phone Number</Text>
                    <View style={styles.modalInputContainer}>
                      <View style={styles.iconBox}>
                        <Mail color={colors.textSecondary} size={18} strokeWidth={2.2} />
                      </View>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Enter email or phone number"
                        placeholderTextColor={colors.textTertiary}
                        value={forgotEmail}
                        onChangeText={setForgotEmail}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.modalButton, forgotLoading && { backgroundColor: colors.textSecondary }]}
                    onPress={handleRequestOtp}
                    disabled={forgotLoading}
                    activeOpacity={0.85}
                  >
                    {forgotLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.modalButtonText}>Get Reset Code</Text>
                        <ArrowRight color="#FFFFFF" size={18} strokeWidth={2.5} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                /* Step 2: Verify & reset */
                <View style={styles.modalBody}>
                  <Text style={styles.modalInstructions}>
                    A password reset code has been generated. Enter the code and choose your new password.
                  </Text>

                  {devOtpHelper ? (
                    <View style={styles.devOtpContainer}>
                      <Text style={styles.devOtpLabel}>Development OTP Code Helper:</Text>
                      <Text style={styles.devOtpCode}>{devOtpHelper}</Text>
                    </View>
                  ) : null}

                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>6-Digit OTP Code</Text>
                    <View style={styles.modalInputContainer}>
                      <View style={styles.iconBox}>
                        <KeyRound color={colors.textSecondary} size={18} strokeWidth={2.2} />
                      </View>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor={colors.textTertiary}
                        value={resetOtp}
                        onChangeText={setResetOtp}
                        keyboardType="numeric"
                        maxLength={6}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.modalInputContainer}>
                      <View style={styles.iconBox}>
                        <Lock color={colors.textSecondary} size={18} strokeWidth={2.2} />
                      </View>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Enter new password"
                        placeholderTextColor={colors.textTertiary}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={true}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <View style={styles.modalInputContainer}>
                      <View style={styles.iconBox}>
                        <Lock color={colors.textSecondary} size={18} strokeWidth={2.2} />
                      </View>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Confirm new password"
                        placeholderTextColor={colors.textTertiary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.modalButton, forgotLoading && { backgroundColor: colors.textSecondary }]}
                    onPress={handleResetPassword}
                    disabled={forgotLoading}
                    activeOpacity={0.85}
                  >
                    {forgotLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.modalButtonText}>Reset Password</Text>
                        <CheckCircle2 color="#FFFFFF" size={18} strokeWidth={2.5} />
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalBackLink}
                    onPress={() => setResetStep(1)}
                    disabled={forgotLoading}
                  >
                    <Text style={styles.modalBackLinkText}>Back to request code</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    height: height * 0.44,
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
    top: -100,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.4)',
    bottom: -60,
    left: -60,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.m,
    paddingTop: Platform.OS === 'ios' ? spacing.m : spacing.xl,
    paddingBottom: spacing.xl,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: spacing.m,
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sparkleBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.xl,
    marginTop: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  cardHeader: {
    marginBottom: spacing.l,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 4,
    marginBottom: spacing.xl,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: spacing.s,
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  roleTextActive: {
    color: '#FFFFFF',
  },
  fieldWrapper: {
    marginBottom: spacing.m,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.s,
    letterSpacing: 0.2,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  iconBoxFocused: {
    backgroundColor: colors.primaryBg,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  eyeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  rememberText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: spacing.l,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.s,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginHorizontal: spacing.m,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.m,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialGoogle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#EA4335',
  },
  socialApple: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
  },
  socialFb: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1877F2',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.m,
    paddingVertical: spacing.s,
    gap: 6,
  },
  trustText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalKeyboardAvoiding: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    paddingBottom: spacing.xxl + 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalBody: {
    gap: spacing.m,
  },
  modalInstructions: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.m,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.m,
  },
  modalInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    color: colors.text,
    marginLeft: spacing.s,
  },
  modalButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackLink: {
    alignItems: 'center',
    marginTop: spacing.m,
    paddingVertical: spacing.s,
  },
  modalBackLinkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  devOtpContainer: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
    alignItems: 'center',
  },
  devOtpLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 4,
  },
  devOtpCode: {
    fontSize: 24,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 4,
  },
});
