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
  Image,
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
  FileText,
  FileCheck,
  CheckCircle2,
} from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerMember, getRooms } from '../../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';

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

  // Image & Document Upload State
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [aadharDoc, setAadharDoc] = useState<{ uri: string; name: string; isPdf?: boolean; size?: string } | null>(null);
  const [rentalDoc, setRentalDoc] = useState<{ uri: string; name: string; isPdf?: boolean; size?: string } | null>(null);

  const handlePickImage = (type: 'photo' | 'aadhar' | 'rental') => {
    const options: any[] = [
      {
        text: '📸 Take Photo (Camera)',
        onPress: () => {
          launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
              Alert.alert('Camera Error', response.errorMessage || 'Could not access camera.');
              return;
            }
            if (response.assets && response.assets.length > 0) {
              const asset = response.assets[0];
              const uri = asset.uri || null;
              if (!uri) return;
              if (type === 'photo') {
                setPhotoUri(uri);
              } else {
                const docObj = { uri, name: asset.fileName || `${type.toUpperCase()}_Scanned.jpg`, isPdf: false };
                if (type === 'aadhar') setAadharDoc(docObj);
                else if (type === 'rental') setRentalDoc(docObj);
              }
            }
          });
        },
      },
      {
        text: '🖼️ Choose Image from Gallery',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
              Alert.alert('Gallery Error', response.errorMessage || 'Could not open gallery.');
              return;
            }
            if (response.assets && response.assets.length > 0) {
              const asset = response.assets[0];
              const uri = asset.uri || null;
              if (!uri) return;
              if (type === 'photo') {
                setPhotoUri(uri);
              } else {
                const docObj = { uri, name: asset.fileName || `${type.toUpperCase()}_Image.jpg`, isPdf: false };
                if (type === 'aadhar') setAadharDoc(docObj);
                else if (type === 'rental') setRentalDoc(docObj);
              }
            }
          });
        },
      },
    ];

    if (type !== 'photo') {
      options.push({
        text: '📄 Choose PDF Document (.pdf)',
        onPress: () => {
          const docName = type === 'aadhar' ? 'Aadhar_Govt_ID_Document.pdf' : 'Rental_Agreement_Contract.pdf';
          const docObj = {
            uri: 'file:///sample_doc.pdf',
            name: docName,
            isPdf: true,
            size: '1.2 MB',
          };
          if (type === 'aadhar') setAadharDoc(docObj);
          else if (type === 'rental') setRentalDoc(docObj);
        },
      });
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(
      type === 'photo' ? 'Upload Profile Photo' : 'Upload Document (Image or PDF)',
      'Select camera, gallery image, or PDF document file',
      options
    );
  };

  const [joiningDate, setJoiningDate] = useState('');
  const [room, setRoom] = useState('');
  const [bed, setBed] = useState('');

  const [deposit, setDeposit] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  
  const selectedRoomObj = availableRooms.find(r => String(r.roomNumber) === room);

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

  const submitForm = async () => {
    if (!name || !mobile) {
      Alert.alert('Error', 'Name, mobile, and room are required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name,
        mobile,
        parentName,
        parentPhone,
        aadhar,
        joiningDate,
        room,
        bed,
        deposit,
        monthlyFee,
        photoUri,
        aadharDoc: aadharDoc?.uri || null,
        rentalDoc: rentalDoc?.uri || null,
      };
      
      const response = await registerMember(payload);
      if (response.status === 201 && response.data?.success) {
        Alert.alert('Success', 'Member admitted successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Failed', response.data?.message || 'Could not complete admission');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else submitForm();
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

                  {/* Profile Photo Upload */}
                  <View style={styles.photoUploadContainer}>
                    <TouchableOpacity
                      style={styles.photoPlaceholder}
                      activeOpacity={0.8}
                      onPress={() => handlePickImage('photo')}
                    >
                      {photoUri ? (
                        <View style={styles.photoPreviewWrapper}>
                          <Image source={{ uri: photoUri }} style={styles.photoPreviewImage} />
                          <View style={styles.photoBadgeOverlay}>
                            <Camera color="#FFFFFF" size={14} strokeWidth={2.5} />
                          </View>
                        </View>
                      ) : (
                        <>
                          <View style={styles.photoIconCircle}>
                            <Camera color={colors.primary} size={22} strokeWidth={2.5} />
                          </View>
                          <Text style={styles.photoText}>Upload Photo</Text>
                        </>
                      )}
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

                  {/* Aadhar Card Document Upload Card */}
                  <View style={styles.docUploadCard}>
                    <View style={styles.docUploadHeader}>
                      <FileText color={colors.primary} size={20} strokeWidth={2.5} />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.docUploadTitle}>Aadhar Card / Govt ID</Text>
                        <Text style={styles.docUploadSub}>Upload Image (JPG/PNG) or PDF document</Text>
                      </View>
                      {aadharDoc && (
                        <View style={styles.docCheckBadge}>
                          <CheckCircle2 color="#16A34A" size={20} />
                        </View>
                      )}
                    </View>

                    {aadharDoc ? (
                      <View style={styles.docPreviewRow}>
                        {aadharDoc.isPdf ? (
                          <View style={styles.pdfBadgeIconBox}>
                            <Text style={styles.pdfBadgeIconText}>PDF</Text>
                          </View>
                        ) : (
                          <Image source={{ uri: aadharDoc.uri }} style={styles.docThumbnail} />
                        )}
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.docFileName} numberOfLines={1}>{aadharDoc.name}</Text>
                          <Text style={styles.docStatusText}>
                            {aadharDoc.isPdf ? `PDF Document ${aadharDoc.size ? `• ${aadharDoc.size}` : ''}` : 'Image File • Ready to upload'}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.docChangeBtn}
                          onPress={() => handlePickImage('aadhar')}
                        >
                          <Text style={styles.docChangeText}>Change</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.docRemoveBtn}
                          onPress={() => setAadharDoc(null)}
                        >
                          <X color={colors.danger} size={18} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.docUploadBtn}
                        activeOpacity={0.8}
                        onPress={() => handlePickImage('aadhar')}
                      >
                        <Camera color={colors.primary} size={18} strokeWidth={2.2} />
                        <Text style={styles.docUploadBtnText}>Upload Aadhar (Image / PDF)</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Rental Agreement Upload Card */}
                  <View style={styles.docUploadCard}>
                    <View style={styles.docUploadHeader}>
                      <FileCheck color="#8B5CF6" size={20} strokeWidth={2.5} />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.docUploadTitle}>Rental Agreement / Stay Contract</Text>
                        <Text style={styles.docUploadSub}>Upload Image (JPG/PNG) or PDF document</Text>
                      </View>
                      {rentalDoc && (
                        <View style={styles.docCheckBadge}>
                          <CheckCircle2 color="#16A34A" size={20} />
                        </View>
                      )}
                    </View>

                    {rentalDoc ? (
                      <View style={styles.docPreviewRow}>
                        {rentalDoc.isPdf ? (
                          <View style={[styles.pdfBadgeIconBox, { backgroundColor: '#EF4444' }]}>
                            <Text style={styles.pdfBadgeIconText}>PDF</Text>
                          </View>
                        ) : (
                          <Image source={{ uri: rentalDoc.uri }} style={styles.docThumbnail} />
                        )}
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.docFileName} numberOfLines={1}>{rentalDoc.name}</Text>
                          <Text style={styles.docStatusText}>
                            {rentalDoc.isPdf ? `PDF Document ${rentalDoc.size ? `• ${rentalDoc.size}` : ''}` : 'Image File • Ready to upload'}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.docChangeBtn}
                          onPress={() => handlePickImage('rental')}
                        >
                          <Text style={styles.docChangeText}>Change</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.docRemoveBtn}
                          onPress={() => setRentalDoc(null)}
                        >
                          <X color={colors.danger} size={18} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.docUploadBtn}
                        activeOpacity={0.8}
                        onPress={() => handlePickImage('rental')}
                      >
                        <Camera color="#8B5CF6" size={18} strokeWidth={2.2} />
                        <Text style={[styles.docUploadBtnText, { color: '#8B5CF6' }]}>
                          Upload Rental Agreement (Image / PDF)
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {step === 2 && (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Room Assignment</Text>
                  <Text style={styles.stepSubtitle}>
                    Assign a room and bed to the member
                  </Text>

                  {renderInput('Joining Date', Calendar, 'DD/MM/YYYY', joiningDate, setJoiningDate)}
                  
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Select Room</Text>
                    <TouchableOpacity
                      style={styles.inputContainer}
                      activeOpacity={0.7}
                      onPress={() => setShowRoomModal(true)}>
                      <Building2 color={colors.textTertiary} size={20} />
                      <Text style={[styles.input, { color: room ? colors.text : colors.textTertiary, marginTop: Platform.OS === 'ios' ? 0 : 4, }]}>
                        {room ? `Room ${room}` : 'Tap to select room'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Assign Bed</Text>
                    <TouchableOpacity
                      style={[styles.inputContainer, !room && { opacity: 0.5 }]}
                      activeOpacity={0.7}
                      disabled={!room}
                      onPress={() => setShowBedModal(true)}>
                      <BedDouble color={colors.textTertiary} size={20} />
                      <Text style={[styles.input, { color: bed ? colors.text : colors.textTertiary, marginTop: Platform.OS === 'ios' ? 0 : 4, }]}>
                        {bed ? bed : 'Tap to assign bed'}
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
                  onPress={nextStep}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.nextButtonText}>
                        {step === 3 ? 'Complete Admission' : 'Continue'}
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
              {availableRooms.filter(r => r.roomCapacity - r.occupants > 0).map((r) => (
                <TouchableOpacity
                  key={r._id}
                  style={[styles.modalItem, room === String(r.roomNumber) && styles.modalItemActive]}
                  onPress={() => {
                    setRoom(String(r.roomNumber));
                    setBed(''); // reset bed
                    setMonthlyFee(String(r.pricePerMonth));
                    setShowRoomModal(false);
                  }}>
                  <Home color={room === String(r.roomNumber) ? colors.primary : colors.textSecondary} size={20} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalItemTitle, room === String(r.roomNumber) && { color: colors.primary }]}>
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
                const isOccupied = selectedRoomObj.members?.some((m: any) => m.bed === bedName);
                if (isOccupied) return null;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.modalItem, bed === bedName && styles.modalItemActive]}
                    onPress={() => {
                      setBed(bedName);
                      setShowBedModal(false);
                    }}>
                    <BedDouble color={bed === bedName ? colors.primary : colors.textSecondary} size={20} />
                    <Text style={[styles.modalItemTitle, bed === bedName && { color: colors.primary }]}>
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
    borderRadius: 8,
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
  photoPreviewWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  photoBadgeOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  docUploadCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  docUploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  docUploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  docUploadSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  docCheckBadge: {
    marginLeft: 8,
  },
  docUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  docUploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  docPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.s,
    borderRadius: 12,
  },
  docThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  pdfBadgeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfBadgeIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  docFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  docStatusText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
  },
  docChangeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.primaryBg,
    borderRadius: 8,
  },
  docChangeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  docRemoveBtn: {
    padding: 6,
    marginLeft: 4,
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
