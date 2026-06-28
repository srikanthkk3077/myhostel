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
  ActivityIndicator,
  Alert,
  Modal,
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
  X,
  Home,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateMember, getRooms } from '../../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function EditStudentScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { member } = route.params || {};
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: member?.name || '',
    mobile: member?.phone || '',
    parentName: member?.parentName || '',
    parentPhone: member?.parentPhone || '',
    aadhar: member?.aadhar || '',
    joiningDate: member?.joinDate || '',
    room: member?.room || '',
    bed: member?.bed || '',
    deposit: member?.deposit?.toString() || '',
    monthlyFee: member?.rent?.toString() || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  
  const selectedRoomObj = availableRooms.find(r => String(r.roomNumber) === formData.room);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      if (res.status === 200 && res.data?.success) {
        setAvailableRooms(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRooms();
    }, [])
  );

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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await updateMember(member.id, formData);
      if (response.status === 200 && response.data?.success) {
        Alert.alert('Success', 'Member updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to update member');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
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
    key: keyof typeof formData,
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
          value={formData[key]}
          onChangeText={(v) => setFormData({ ...formData, [key]: v })}
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
          <Text style={styles.headerTitle}>Edit Member</Text>
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

                  {renderInput('Full Name', User, 'e.g. John Doe', 'name', {
                    autoCapitalize: 'words',
                  })}
                  {renderInput('Mobile Number', Phone, '+91 98765 43210', 'mobile', {
                    keyboardType: 'phone-pad',
                  })}
                  {renderInput('Parent/Guardian Name', User, 'e.g. Richard Doe', 'parentName', {
                    autoCapitalize: 'words',
                  })}
                  {renderInput('Parent Phone', Phone, '+91 98765 43210', 'parentPhone', {
                    keyboardType: 'phone-pad',
                  })}
                  {renderInput('Aadhar / ID Number', CreditCard, 'e.g. 1234 5678 9012', 'aadhar', {
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

                  {renderInput('Joining Date', Calendar, 'DD/MM/YYYY', 'joiningDate')}
                  
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Select Room</Text>
                    <TouchableOpacity
                      style={styles.inputContainer}
                      activeOpacity={0.7}
                      onPress={() => setShowRoomModal(true)}>
                      <Building2 color={colors.textTertiary} size={20} />
                      <Text style={[styles.input, { color: formData.room ? colors.text : colors.textTertiary, marginTop: Platform.OS === 'ios' ? 0 : 4, }]}>
                        {formData.room ? `Room ${formData.room}` : 'Tap to select room'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Assign Bed</Text>
                    <TouchableOpacity
                      style={[styles.inputContainer, !formData.room && { opacity: 0.5 }]}
                      activeOpacity={0.7}
                      disabled={!formData.room}
                      onPress={() => setShowBedModal(true)}>
                      <BedDouble color={colors.textTertiary} size={20} />
                      <Text style={[styles.input, { color: formData.bed ? colors.text : colors.textTertiary, marginTop: Platform.OS === 'ios' ? 0 : 4, }]}>
                        {formData.bed ? formData.bed : 'Tap to assign bed'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {step === 3 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Payment Details</Text>
                  <Text style={styles.stepSubtitle}>
                    Set up the security deposit and monthly rent
                  </Text>

                  {renderInput('Security Deposit', Wallet, 'e.g. 5000', 'deposit', {
                    keyboardType: 'numeric',
                  })}
                  {renderInput('Monthly Rent', Wallet, 'e.g. 12000', 'monthlyFee', {
                    keyboardType: 'numeric',
                  })}
                </View>
              )}

              {/* Next Button inside ScrollView */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.nextButton}
                  activeOpacity={0.85}
                  onPress={nextStep}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.nextButtonText}>
                        {step === 3 ? 'Save Changes' : 'Continue'}
                      </Text>
                      {step === 3 ? (
                        <Check color="#FFFFFF" size={18} strokeWidth={2.5} />
                      ) : (
                        <ArrowRight color="#FFFFFF" size={18} strokeWidth={2.5} />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Room Selection Modal */}
      <Modal
        visible={showRoomModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRoomModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Available Room</Text>
              <TouchableOpacity onPress={() => setShowRoomModal(false)}>
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              {availableRooms.filter(r => r.roomCapacity - r.occupants > 0 || String(r.roomNumber) === formData.room).map((r) => (
                <TouchableOpacity
                  key={r._id}
                  style={[styles.modalItem, formData.room === String(r.roomNumber) && styles.modalItemActive]}
                  onPress={() => {
                    setFormData({ ...formData, room: String(r.roomNumber), bed: '', monthlyFee: String(r.pricePerMonth) });
                    setShowRoomModal(false);
                  }}>
                  <Home color={formData.room === String(r.roomNumber) ? colors.primary : colors.textSecondary} size={20} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalItemTitle, formData.room === String(r.roomNumber) && { color: colors.primary }]}>
                      Room {r.roomNumber}
                    </Text>
                    <Text style={styles.modalItemSubtitle}>{r.roomType}</Text>
                  </View>
                  <Text style={styles.modalItemRightText}>{r.roomCapacity - r.occupants} beds left</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bed Selection Modal */}
      <Modal
        visible={showBedModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBedModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Vacant Bed</Text>
              <TouchableOpacity onPress={() => setShowBedModal(false)}>
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {selectedRoomObj && Array.from({ length: selectedRoomObj.roomCapacity }).map((_, i) => {
                const bedName = `Bed ${i + 1}`;
                const isOccupied = selectedRoomObj.members?.some((m: any) => m.bed === bedName && m._id !== member.id);
                if (isOccupied) return null;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.modalItem, formData.bed === bedName && styles.modalItemActive]}
                    onPress={() => {
                      setFormData({ ...formData, bed: bedName });
                      setShowBedModal(false);
                    }}>
                    <BedDouble color={formData.bed === bedName ? colors.primary : colors.textSecondary} size={20} />
                    <Text style={[styles.modalItemTitle, formData.bed === bedName && { color: colors.primary }]}>
                      {bedName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.l,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.l,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
    gap: spacing.m,
  },
  modalItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalItemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalItemRightText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.success,
  },
});
