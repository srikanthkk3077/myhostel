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
} from 'react-native';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  Building2,
  Shield,
  Check,
  Sparkles,
  CheckCircle2,
  MapPin,
  FileUp,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function RegistrationScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<'User' | 'merchant'>('User');
  const [hostelName, setHostelName] = useState('');
  const [hostelAddress, setHostelAddress] = useState('');
  const [addressProof, setAddressProof] = useState<string | null>(null);

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

  // Password strength rules
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const strengthScore = [hasMinLength, hasNumber, hasLetter].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (strengthScore === 0) return '';
    if (strengthScore === 1) return 'Weak';
    if (strengthScore === 2) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strengthScore === 1) return colors.danger;
    if (strengthScore === 2) return colors.warning;
    if (strengthScore === 3) return colors.success;
    return colors.border;
  };

  const renderInput = (
    fieldName: string,
    label: string,
    icon: any,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    options: any = {},
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setFocusedField(fieldName)}
        style={[
          styles.inputContainer,
          focusedField === fieldName && styles.inputContainerFocused,
        ]}>
        <View
          style={[
            styles.iconBox,
            focusedField === fieldName && styles.iconBoxFocused,
          ]}>
          {React.createElement(icon, {
            color: focusedField === fieldName ? colors.primary : colors.textSecondary,
            size: 18,
            strokeWidth: 2.2,
          })}
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocusedField(fieldName)}
          onBlur={() => setFocusedField(null)}
          {...options}
        />
        {options.secureTextEntry !== undefined && (
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
        )}
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent={false} />

      {/* Gradient Header Background */}
      <View style={styles.headerBackground}>
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
        <View style={styles.glow} />
      </View>

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
                  <Building2 color="#FFFFFF" size={28} strokeWidth={2.5} />
                </View>
                <View style={styles.sparkleBadge}>
                  <Sparkles color={colors.warning} size={14} strokeWidth={2.5} />
                </View>
              </View>
              <Text style={styles.brandTitle}>Join MyHostel</Text>
              <Text style={styles.brandSubtitle}>Create your account to get started</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>Create Account ✨</Text>
                <Text style={styles.subtitle}>
                  Join as a User or register your hostel
                </Text>
              </View>

              {/* Role Toggle */}
              <View style={styles.roleToggleContainer}>
                <TouchableOpacity
                  style={[styles.roleButton, accountType === 'User' && styles.roleButtonActive]}
                  activeOpacity={0.8}
                  onPress={() => setAccountType('User')}>
                  <User color={accountType === 'User' ? '#FFFFFF' : colors.textSecondary} size={18} strokeWidth={2.5} />
                  <Text style={[styles.roleText, accountType === 'User' && styles.roleTextActive]}>User</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleButton, accountType === 'merchant' && styles.roleButtonActive]}
                  activeOpacity={0.8}
                  onPress={() => setAccountType('merchant')}>
                  <Building2 color={accountType === 'merchant' ? '#FFFFFF' : colors.textSecondary} size={18} strokeWidth={2.5} />
                  <Text style={[styles.roleText, accountType === 'merchant' && styles.roleTextActive]}>Hostel Owner</Text>
                </TouchableOpacity>
              </View>

              {renderInput('name', 'Full Name', User, 'John Doe', name, setName, {
                autoCapitalize: 'words',
              })}

              {renderInput('email', 'Email Address', Mail, 'you@example.com', email, setEmail, {
                keyboardType: 'email-address',
                autoCapitalize: 'none',
              })}

              {renderInput('phone', 'Phone Number', Phone, '+1 234 567 8900', phone, setPhone, {
                keyboardType: 'phone-pad',
              })}

              {renderInput('password', 'Password', Lock, 'Create a strong password', password, setPassword, {
                secureTextEntry: !showPassword,
              })}

              {accountType === 'merchant' && (
                <>
                  {renderInput('hostelName', 'Hostel Name', Building2, 'e.g. Sunrise Boys Hostel', hostelName, setHostelName)}
                  {renderInput('hostelAddress', 'Hostel Address', MapPin, 'e.g. 123 Main St, City', hostelAddress, setHostelAddress)}
                  
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Address Proof (Optional)</Text>
                    <TouchableOpacity 
                      style={styles.uploadButton} 
                      activeOpacity={0.7}
                      onPress={() => setAddressProof('document_uploaded.pdf')}>
                      <View style={styles.uploadIconBox}>
                        {addressProof ? (
                          <CheckCircle2 color={colors.success} size={20} strokeWidth={2.5} />
                        ) : (
                          <FileUp color={colors.primary} size={20} strokeWidth={2.5} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.uploadTitle}>
                          {addressProof ? 'Document Uploaded' : 'Upload Document'}
                        </Text>
                        <Text style={styles.uploadSubtitle}>
                          {addressProof ? 'address_proof.pdf' : 'PDF, JPG or PNG (max. 5MB)'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Password Strength */}
              {password.length > 0 && (
                <View style={styles.strengthWrapper}>
                  <View style={styles.strengthHeader}>
                    <Text style={styles.strengthLabel}>Password strength</Text>
                    <Text style={[styles.strengthValue, { color: getStrengthColor() }]}>
                      {getStrengthLabel()}
                    </Text>
                  </View>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthFill,
                        {
                          width: `${(strengthScore / 3) * 100}%`,
                          backgroundColor: getStrengthColor(),
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.rulesRow}>
                    <View style={styles.ruleItem}>
                      <Check
                        color={hasMinLength ? colors.success : colors.textTertiary}
                        size={12}
                        strokeWidth={3}
                      />
                      <Text
                        style={[
                          styles.ruleText,
                          hasMinLength && styles.ruleTextActive,
                        ]}>
                        8+ chars
                      </Text>
                    </View>
                    <View style={styles.ruleItem}>
                      <Check
                        color={hasLetter ? colors.success : colors.textTertiary}
                        size={12}
                        strokeWidth={3}
                      />
                      <Text
                        style={[
                          styles.ruleText,
                          hasLetter && styles.ruleTextActive,
                        ]}>
                        Letter
                      </Text>
                    </View>
                    <View style={styles.ruleItem}>
                      <Check
                        color={hasNumber ? colors.success : colors.textTertiary}
                        size={12}
                        strokeWidth={3}
                      />
                      <Text
                        style={[
                          styles.ruleText,
                          hasNumber && styles.ruleTextActive,
                        ]}>
                        Number
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Terms and Conditions */}
              <TouchableOpacity
                style={styles.termsRow}
                activeOpacity={0.7}
                onPress={() => setAcceptTerms(!acceptTerms)}>
                <View
                  style={[
                    styles.checkbox,
                    acceptTerms && styles.checkboxChecked,
                  ]}>
                  {acceptTerms && (
                    <CheckCircle2 color="#FFFFFF" size={14} strokeWidth={3} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  !acceptTerms && styles.registerButtonDisabled,
                ]}
                activeOpacity={0.85}
                disabled={!acceptTerms}
                onPress={() => navigation.replace('Dashboard')}>
                <View style={styles.buttonShine} />
                <Text style={styles.registerButtonText}>Create Account</Text>
                <View style={styles.buttonIconBox}>
                  <ArrowRight color={colors.primary} size={18} strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
              
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Badge */}
            <View style={styles.trustBadge}>
              <Shield color={colors.success} size={14} strokeWidth={2.2} />
              <Text style={styles.trustText}>
                Your data is secured with 256-bit encryption
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    height: height * 0.38,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.25,
  },
  blob1: {
    width: 280,
    height: 280,
    backgroundColor: colors.primaryLight,
    top: -100,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: colors.secondary,
    bottom: -60,
    left: -60,
    opacity: 0.2,
  },
  glow: {
    position: 'absolute',
    width: width,
    height: 200,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.5,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
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
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.s,
    letterSpacing: 0.2,
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: spacing.m,
    gap: spacing.m,
  },
  uploadIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  strengthWrapper: {
    marginBottom: spacing.m,
    padding: spacing.m,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  strengthLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  strengthBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.s,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  rulesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.s,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ruleText: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  ruleTextActive: {
    color: colors.success,
    fontWeight: '600',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
    gap: spacing.s,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '700',
  },
  registerButton: {
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
  registerButtonDisabled: {
    backgroundColor: colors.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
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
});
