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
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { changePassword } from '../../service/merchant';

export default function SecurityScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
  }, []);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSave = async () => {
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
          { text: 'OK', onPress: () => navigation.goBack() }
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

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#0F766E', '#0D9488', '#14B8A6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 240 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
      </LinearGradient>

      <View style={[styles.headerTop, { paddingTop: insets.top + spacing.m }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security & Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Change Password</Text>
            
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
            
            <View style={styles.divider} />
            
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
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showNew}
                  placeholder="Re-enter new password"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>

        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.m }]}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleSave} disabled={updating}>
          <LinearGradient
            colors={['#0D9488', '#0F766E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.saveButton, updating && { opacity: 0.7 }]}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Update Password</Text>
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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -80,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s,
    marginBottom: spacing.l,
    zIndex: 10,
  },
  backButton: {
    padding: spacing.s,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 40,
    paddingTop: spacing.l,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xl,
    letterSpacing: -0.5,
  },
  inputContainer: {
    marginBottom: spacing.l,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
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
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  eyeBtn: {
    position: 'absolute',
    right: spacing.l,
    top: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.s,
    marginBottom: spacing.xl,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
