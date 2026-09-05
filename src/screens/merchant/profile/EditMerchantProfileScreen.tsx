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
} from 'react-native';
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { getMe, updateProfile, changePassword } from '../../../service/merchant';

export default function EditMerchantProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Merchant Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hostelName, setHostelName] = useState('');
  const [hostelAddress, setHostelAddress] = useState('');

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

    const loadProfile = async () => {
      try {
        const response = await getMe();
        if (response.status === 200 && response.data?.success) {
          const merchant = response.data.data;
          setName(merchant.name || '');
          setEmail(merchant.email || '');
          setPhone(merchant.phoneNumber || merchant.phone || '');
          setHostelName(merchant.hostelName || 'Green Valley Hostel');
          setHostelAddress(merchant.hostelAddress || '42, MG Road, Bangalore');
        }
      } catch (error) {
        console.error('Failed to load merchant profile', error);
        Alert.alert('Error', 'Failed to load profile details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      return Alert.alert('Validation Error', 'Please enter your name.');
    }
    if (!email.trim()) {
      return Alert.alert('Validation Error', 'Please enter your email address.');
    }
    if (!phone.trim()) {
      return Alert.alert('Validation Error', 'Please enter your phone number.');
    }
    if (!hostelName.trim()) {
      return Alert.alert('Validation Error', 'Please enter your hostel name.');
    }
    if (!hostelAddress.trim()) {
      return Alert.alert('Validation Error', 'Please enter your hostel address.');
    }
    if (password.trim() && password.length < 6) {
      return Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
    }

    setSaving(true);
    try {
      // 1. Update basic profile info + hostel details
      const profileRes = await updateProfile({
        name,
        email,
        phoneNumber: phone,
        phone,
        hostelName,
        hostelAddress,
      });

      // 2. If password is set, update password
      if (password.trim()) {
        await changePassword({ newPassword: password });
      }

      if (profileRes.status === 200 && profileRes.data?.success) {
        Alert.alert('Success', 'Merchant profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', profileRes.data?.message || 'Failed to update profile.');
      }
    } catch (error: any) {
      console.error('Failed to save merchant profile changes', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong while saving profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'M';
    return nameStr
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header Background */}
      <LinearGradient
        colors={['#16A34A', '#15803D', '#166534']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 220 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>

      {/* Header Bar */}
      <View style={[styles.headerTop, { paddingTop: insets.top + spacing.s }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}>
          <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
            Loading merchant details...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>

            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <LinearGradient
                  colors={['#22C55E', '#15803D']}
                  style={styles.avatarGradient}>
                  <Text style={styles.avatarText}>{getInitials(name)}</Text>
                </LinearGradient>
                <TouchableOpacity style={styles.cameraButton} activeOpacity={0.9}>
                  <Camera color="#FFFFFF" size={16} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              <Text style={styles.avatarSubtext}>Hostel Owner Account</Text>
            </View>

            {/* Account Details Card */}
            <View style={styles.formCard}>
              <Text style={styles.cardHeaderTitle}>Personal Information</Text>

              {/* Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWithIcon}>
                  <User color={colors.textSecondary} size={20} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWithIcon}>
                  <Mail color={colors.textSecondary} size={20} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter email address"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWithIcon}>
                  <Phone color={colors.textSecondary} size={20} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder="Enter phone number"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.cardHeaderTitle}>Hostel Details</Text>

              {/* Hostel Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Hostel Name</Text>
                <View style={styles.inputWithIcon}>
                  <Building2 color={colors.primary} size={20} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.input}
                    value={hostelName}
                    onChangeText={setHostelName}
                    placeholder="Enter hostel name"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              {/* Hostel Address */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Hostel Address</Text>
                <View style={[styles.inputWithIcon, { alignItems: 'flex-start' }]}>
                  <MapPin color={colors.primary} size={20} style={[styles.fieldIcon, { marginTop: 16 }]} />
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={hostelAddress}
                    onChangeText={setHostelAddress}
                    multiline
                    numberOfLines={3}
                    placeholder="Enter complete hostel address"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>
            </View>

            <View style={{ height: 30 }} />
          </Animated.View>
        </ScrollView>
      )}

      {/* Footer Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.m }]}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleSave} disabled={saving}>
          <LinearGradient
            colors={['#16A34A', '#15803D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.saveButton, saving && { opacity: 0.7 }]}>
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    paddingTop: spacing.s,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    padding: 5,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#15803D',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarSubtext: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
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
  inputWithIcon: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 2,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingLeft: 46,
    paddingRight: spacing.l,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  multilineInput: {
    paddingVertical: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  eyeBtn: {
    position: 'absolute',
    right: spacing.m,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.l,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
