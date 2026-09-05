import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Building2,
  BedDouble,
  Hash,
  Layers,
  IndianRupee,
  Snowflake,
  Wind,
  Home,
  Sparkles,
  Save,
  Trash2,
  Plus,
  Minus,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { updateRoom, deleteRoom } from '../../../service/merchant';

const { width } = Dimensions.get('window');

export default function EditRoomScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { room } = route.params || {
    room: { id: '101', type: 'Double', capacity: 2, floor: 1, price: 10000, isAC: false },
  };

  // Helper to parse base room type
  const parseRoomType = (rawType: string): string => {
    return rawType.replace(/\s*\((?:Non-)?AC\)\s*/gi, '').trim() || 'Double';
  };

  const [roomNumber, setRoomNumber] = useState(room.id || '');
  const [capacity, setCapacity] = useState<number>(Number(room.capacity) || 2);
  const [floor, setFloor] = useState(String(room.floor || 1));
  const [price, setPrice] = useState(String(room.price || 10000));
  const [isAC, setIsAC] = useState(room.isAC || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(blobAnim, { toValue: 0, duration: 5000, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const blobY = blobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const presets = [
    { count: 1, label: 'Single' },
    { count: 2, label: 'Double' },
    { count: 3, label: 'Triple' },
    { count: 4, label: 'Quad' },
  ];

  const handleStepperChange = (delta: number) => {
    setCapacity(prev => Math.max(1, prev + delta));
  };

  const getRoomTypeLabel = () => {
    const preset = presets.find(p => p.count === capacity);
    if (preset) return preset.label;
    return `${capacity}-Sharing`;
  };

  const handleSave = async () => {
    if (!roomNumber || !price || !floor) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!room._id) {
      Alert.alert('Error', 'Room ID is missing');
      return;
    }

    if (capacity <= 0) {
      Alert.alert('Error', 'Please enter a valid room capacity');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        roomNumber,
        floor: parseInt(floor, 10),
        pricePerMonth: parseInt(price, 10),
        roomType: isAC ? `${getRoomTypeLabel()} (AC)` : `${getRoomTypeLabel()} (Non-AC)`,
        roomCapacity: capacity,
      };

      const response = await updateRoom(room._id, payload as any);

      if (response.status === 200 && response.data?.success) {
        Alert.alert('Success', 'Room updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Failed', response.data?.message || 'Update failed');
      }
    } catch (error: any) {
      const responseData = error?.response?.data;

      if (responseData?.code === 'OVER_CAPACITY') {
        const memberNames = (responseData.members || [])
          .slice(responseData.newCapacity)
          .map((m: any) => `• ${m.name}`)
          .join('\n');

        Alert.alert(
          '⚠️ Over Capacity',
          `${responseData.message}\n\nMembers to transfer:\n${memberNames}`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Go Transfer Members',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', responseData?.message || error?.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!room._id) {
      Alert.alert('Error', 'Room ID is missing');
      return;
    }

    Alert.alert(
      'Delete Room',
      'Are you sure you want to delete this room? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const response = await deleteRoom(room._id);
              if (response.status === 200 && response.data?.success) {
                Alert.alert('Success', 'Room deleted', [
                  { text: 'OK', onPress: () => navigation.navigate('RoomsList') },
                ]);
              } else {
                Alert.alert('Failed', response.data?.message || 'Could not delete room');
              }
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Something went wrong');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Animated Header */}
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      >
        <Animated.View
          style={[styles.blob, styles.blob1, { transform: [{ translateY: blobY }] }]}
        />
        <Animated.View
          style={[styles.blob, styles.blob2, { transform: [{ translateY: blobY }] }]}
        />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={{ flex: 1, marginTop: insets.top }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.goBack()}
              >
                <ArrowLeft color="#16A34A" size={20} strokeWidth={2.5} />
              </TouchableOpacity>
              <Text style={styles.topBarTitle}>Edit Room</Text>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: '#FEE2E2' }]}
                onPress={handleDelete}
              >
                <Trash2 color={colors.danger} size={18} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroIconBox}>
                <Home color="#16A34A" size={36} strokeWidth={2.5} />
                <View style={styles.sparkleBadge}>
                  <Sparkles color={colors.warning} size={12} strokeWidth={2.5} />
                </View>
              </View>
              <Text style={styles.heroTitle}>Edit Room {roomNumber || 'Details'} 🏠</Text>
              <Text style={styles.heroSubtitle}>Update room settings & capacity</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Room Information</Text>

              {renderInput('Room Number', Hash, 'e.g. 101', roomNumber, setRoomNumber, {
                keyboardType: 'numeric',
              })}

              {renderInput('Floor', Layers, 'e.g. 1', floor, setFloor, {
                keyboardType: 'numeric',
              })}

              {renderInput('Price per Month', IndianRupee, 'e.g. 10000', price, setPrice, {
                keyboardType: 'numeric',
              })}

              {/* AC Toggle */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Room Type</Text>
                <View style={styles.acToggleRow}>
                  <TouchableOpacity
                    style={[styles.acOption, isAC && styles.acOptionActive]}
                    onPress={() => setIsAC(true)}
                    activeOpacity={0.8}
                  >
                    <Snowflake
                      color={isAC ? '#FFFFFF' : colors.primary}
                      size={20}
                      strokeWidth={2.5}
                    />
                    <Text style={[styles.acOptionText, isAC && styles.acOptionTextActive]}>
                      AC
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.acOption, !isAC && styles.acOptionActiveWarning]}
                    onPress={() => setIsAC(false)}
                    activeOpacity={0.8}
                  >
                    <Wind
                      color={!isAC ? '#FFFFFF' : colors.warning}
                      size={20}
                      strokeWidth={2.5}
                    />
                    <Text style={[styles.acOptionText, !isAC && styles.acOptionTextActive]}>
                      Non-AC
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Room Capacity Section */}
              <View style={styles.fieldWrapper}>
                <View style={styles.capacityHeaderRow}>
                  <Text style={styles.label}>Room Capacity</Text>
                  <View style={styles.badgeTag}>
                    <Text style={styles.badgeTagText}>
                      {capacity} Bed{capacity > 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                {/* Interactive Stepper Box */}
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleStepperChange(-1)}
                    activeOpacity={0.7}
                  >
                    <Minus color={colors.primary} size={20} strokeWidth={2.5} />
                  </TouchableOpacity>

                  <View style={styles.stepperCenter}>
                    <Text style={styles.stepperCountText}>{capacity}</Text>
                    <Text style={styles.stepperSubText}>{getRoomTypeLabel()} Room</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleStepperChange(1)}
                    activeOpacity={0.7}
                  >
                    <Plus color={colors.primary} size={20} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Preview Card */}
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Preview</Text>
              <View style={styles.previewContent}>
                <View
                  style={[
                    styles.previewIconBox,
                    { backgroundColor: isAC ? colors.primary : colors.warning },
                  ]}
                >
                  {isAC ? (
                    <Snowflake color="#FFFFFF" size={24} strokeWidth={2.5} />
                  ) : (
                    <Wind color="#FFFFFF" size={24} strokeWidth={2.5} />
                  )}
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>
                    Room {roomNumber || 'XXX'} {floor && `· Floor ${floor}`}
                  </Text>
                  <Text style={styles.previewSubtitle}>
                    {isAC ? 'AC ' : 'Non-AC '}{getRoomTypeLabel()} ({capacity} Bed{capacity > 1 ? 's' : ''}) · ₹{price || '0'}/mo
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.85}
              disabled={isLoading || isDeleting}
              onPress={handleSave}
            >
              <View style={styles.saveButtonShine} />
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Save color="#FFFFFF" size={18} strokeWidth={2.5} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Delete Room Action */}
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.8}
              disabled={isLoading || isDeleting}
              onPress={handleDelete}
            >
              {isDeleting ? (
                <ActivityIndicator color={colors.danger} />
              ) : (
                <>
                  <Trash2 color={colors.danger} size={18} strokeWidth={2.5} />
                  <Text style={styles.deleteButtonText}>Delete Room</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
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
    height: 340,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
  },
  blob1: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    top: -60,
    right: -40,
  },
  blob2: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: 80,
    left: -50,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.s,
    marginBottom: spacing.xs,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.l,
    marginTop: spacing.xs,
  },
  heroIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  sparkleBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.warningBg,
    borderRadius: 10,
    padding: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
    letterSpacing: -0.3,
  },
  fieldWrapper: {
    marginBottom: spacing.m,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
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
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  acToggleRow: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  acOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  acOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  acOptionActiveWarning: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  acOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  acOptionTextActive: {
    color: '#FFFFFF',
  },
  capacityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeTag: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeTagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.s,
    borderWidth: 2,
    borderColor: colors.primary + '30',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginVertical: spacing.xs,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperCenter: {
    alignItems: 'center',
  },
  stepperCountText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  stepperSubText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.s,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  previewIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  previewSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: spacing.s,
  },
  saveButtonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});
