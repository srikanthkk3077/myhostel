import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import {
  User,
  Phone,
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Camera,
  Calendar,
  Wallet,
  Building2,
  BedDouble,
  Sparkles,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function RegisterStudentScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [aadhar, setAadhar] = useState('');

  const [joiningDate, setJoiningDate] = useState('');
  const [room, setRoom] = useState('');
  const [bed, setBed] = useState('');

  const [deposit, setDeposit] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else navigation.goBack(); // Complete registration
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {[1, 2, 3].map((s) => {
        const isActive = step >= s;
        const isCurrent = step === s;
        return (
          <React.Fragment key={s}>
            <View
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCurrent && styles.stepCircleCurrent,
              ]}>
              {isActive && s < step ? (
                <Check color="#FFFFFF" size={14} strokeWidth={3} />
              ) : (
                <Text
                  style={[
                    styles.stepText,
                    isActive && styles.stepTextActive,
                  ]}>
                  {s}
                </Text>
              )}
            </View>
            {s < 3 && (
              <View
                style={[
                  styles.stepLine,
                  step > s && styles.stepLineActive,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderInput = (
    label: string,
    icon: any,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    options: any = {},
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconBox}>
          {React.createElement(icon, {
            color: colors.primary,
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
          {...options}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} translucent={false} />

      {/* Sticky White Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (step > 1 ? setStep(step - 1) : navigation.goBack())}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Admission</Text>
          <View style={{ width: 40 }} />
        </View>
        {renderStepIndicator()}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>

              {step === 1 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Personal Details</Text>

                  <View style={styles.photoUploadContainer}>
                    <TouchableOpacity style={styles.photoPlaceholder} activeOpacity={0.8}>
                      <View style={styles.photoIconCircle}>
                        <Camera color={colors.primary} size={20} strokeWidth={2.5} />
                      </View>
                      <Text style={styles.photoText}>Upload Photo</Text>
                    </TouchableOpacity>
                  </View>

                  {renderInput('Full Name', User, 'e.g. John Doe', name, setName, {
                    autoCapitalize: 'words',
                  })}
                  {renderInput('Mobile Number', Phone, '+91 98765 43210', mobile, setMobile, {
                    keyboardType: 'phone-pad',
                  })}
                  {renderInput('Parent/Guardian Name', User, 'e.g. Richard Doe', parentName, setParentName, {
                    autoCapitalize: 'words',
                  })}
                  {renderInput('Parent Phone', Phone, '+91 98765 43210', parentPhone, setParentPhone, {
                    keyboardType: 'phone-pad',
                  })}
                  {renderInput('Aadhar / ID Number', CreditCard, 'e.g. 1234 5678 9012', aadhar, setAadhar, {
                    keyboardType: 'numeric',
                  })}
                </View>
              )}

              {step === 2 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Room Assignment</Text>
                  <Text style={styles.stepSubtitle}>
                    Assign a room and bed to the member
                  </Text>

                  {renderInput('Joining Date', Calendar, 'DD/MM/YYYY', joiningDate, setJoiningDate)}
                  {renderInput('Select Room', Building2, 'e.g. 101', room, setRoom, {
                    keyboardType: 'numeric',
                  })}
                  {renderInput('Assign Bed', BedDouble, 'e.g. Bed A', bed, setBed)}
                </View>
              )}

              {step === 3 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Payment Details</Text>
                  <Text style={styles.stepSubtitle}>
                    Set up the security deposit and monthly rent
                  </Text>

                  {renderInput('Security Deposit', Wallet, 'e.g. 5000', deposit, setDeposit, {
                    keyboardType: 'numeric',
                  })}
                  {renderInput('Monthly Rent', Wallet, 'e.g. 12000', monthlyFee, setMonthlyFee, {
                    keyboardType: 'numeric',
                  })}
                </View>
              )}

              {/* Next Button inside ScrollView */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.nextButton}
                  activeOpacity={0.85}
                  onPress={nextStep}>
                  <Text style={styles.nextButtonText}>
                    {step === 3 ? 'Complete Admission' : 'Continue'}
                  </Text>
                  {step === 3 ? (
                    <Check color="#FFFFFF" size={18} strokeWidth={2.5} />
                  ) : (
                    <ArrowRight color="#FFFFFF" size={18} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
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
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: 120, // Enough space for sticky bottom bar + tab bar
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.m,
    paddingHorizontal: spacing.xl,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepCircleCurrent: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.1 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  stepText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
    borderRadius: 1,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  stepContent: {
    marginBottom: spacing.m,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  photoUploadContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  photoText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  fieldWrapper: {
    marginBottom: spacing.l,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.l,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
