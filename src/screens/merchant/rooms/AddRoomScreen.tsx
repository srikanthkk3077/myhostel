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
  Pressable,
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
  Check,
  Home,
  Sparkles,
  Save,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { createRoom } from '../../../service/merchant';

const { width, height } = Dimensions.get('window');

export default function AddRoomScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState<'single' | 'double' | 'triple' | 'quad'>('double');
  const [beds, setBeds] = useState('');
  const [floor, setFloor] = useState('');
  const [price, setPrice] = useState('');
  const [isAC, setIsAC] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const roomTypes = [
    { id: 'single', label: 'Single', desc: '1 Person', icon: '1' },
    { id: 'double', label: 'Double', desc: '2 Persons', icon: '2' },
    { id: 'triple', label: 'Triple', desc: '3 Persons', icon: '3' },
    { id: 'quad', label: 'Quad', desc: '4 Persons', icon: '4' },
  ];

  const getBedCount = () => {
    const map: any = { single: 1, double: 2, triple: 3, quad: 4 };
    return map[roomType] || 2;
  };

  const handleSave = async () => {
    if (!roomNumber || !floor || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        roomNumber,
        floor: parseInt(floor, 10) || floor,
        pricePerMonth: parseInt(price, 10) || 0,
        roomType: isAC ? `${roomType} (AC)` : `${roomType} (Non-AC)`,
        roomCapacity: getBedCount(),
      };
      
      const response = await createRoom(payload as any);
      
      if (response.status === 201 && response.data?.success) {
        Alert.alert('Success', 'Room created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Failed', response.data?.message || 'Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
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
        style={styles.keyboardView}>
        <ScrollView
          style={{ flex: 1, marginTop: insets.top }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.goBack()}>
                <ArrowLeft color="#16A34A" size={20} strokeWidth={2.5} />
              </TouchableOpacity>
              <Text style={styles.topBarTitle}>Add Room</Text>
              <View style={{ width: 42 }} />
            </View>

            {/* Hero Icon */}
            <View style={styles.heroSection}>
              <View style={styles.heroIconBox}>
                <Home color="#16A34A" size={36} strokeWidth={2.5} />
                <View style={styles.sparkleBadge}>
                  <Sparkles color={colors.warning} size={12} strokeWidth={2.5} />
                </View>
              </View>
              <Text style={styles.heroTitle}>Create New Room 🏠</Text>
              <Text style={styles.heroSubtitle}>Add a new room to your hostel</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Room Information</Text>

              {renderInput('Room Number', Hash, 'e.g. 105', roomNumber, setRoomNumber, {
                keyboardType: 'numeric',
              })}

              {renderInput('Floor', Layers, 'e.g. 2', floor, setFloor, {
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
                    style={[
                      styles.acOption,
                      isAC && styles.acOptionActive,
                    ]}
                    onPress={() => setIsAC(true)}
                    activeOpacity={0.8}>
                    <Snowflake
                      color={isAC ? '#FFFFFF' : colors.primary}
                      size={20}
                      strokeWidth={2.5}
                    />
                    <Text style={[
                      styles.acOptionText,
                      isAC && styles.acOptionTextActive,
                    ]}>
                      AC
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.acOption,
                      !isAC && styles.acOptionActiveWarning,
                    ]}
                    onPress={() => setIsAC(false)}
                    activeOpacity={0.8}>
                    <Wind
                      color={!isAC ? '#FFFFFF' : colors.warning}
                      size={20}
                      strokeWidth={2.5}
                    />
                    <Text style={[
                      styles.acOptionText,
                      !isAC && styles.acOptionTextActive,
                    ]}>
                      Non-AC
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Room Capacity Selector */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Room Capacity</Text>
                <View style={styles.capacityGrid}>
                  {roomTypes.map((type) => {
                    const active = roomType === type.id;
                    return (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.capacityOption,
                          active && styles.capacityOptionActive,
                        ]}
                        onPress={() => setRoomType(type.id as any)}
                        activeOpacity={0.8}>
                        <Text style={[
                          styles.capacityIcon,
                          active && styles.capacityIconActive,
                        ]}>
                          {type.icon}
                        </Text>
                        <Text style={[
                          styles.capacityLabel,
                          active && styles.capacityLabelActive,
                        ]}>
                          {type.label}
                        </Text>
                        <Text style={[
                          styles.capacityDesc,
                          active && styles.capacityDescActive,
                        ]}>
                          {type.desc}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Preview Card */}
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Preview</Text>
              <View style={styles.previewContent}>
                <View style={[
                  styles.previewIconBox,
                  { backgroundColor: isAC ? colors.primary : colors.warning }
                ]}>
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
                    {isAC ? 'AC ' : 'Non-AC '}{roomTypes.find(t => t.id === roomType)?.label} · ₹{price || '0'}/mo
                  </Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleSave}>
              <View style={styles.saveButtonShine} />
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Save color="#FFFFFF" size={18} strokeWidth={2.5} />
                  <Text style={styles.saveButtonText}>Save Room</Text>
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
    width: 260,
    height: 260,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: -120,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.4)',
    top: 100,
    left: -60,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: 100, // Space for the floating Tab bar
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: spacing.l,
    marginBottom: spacing.l,
  },
  heroIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.m,
    position: 'relative',
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
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  formTitle: {
    fontSize: 18,
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
  capacityGrid: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  capacityOption: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  capacityOptionActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  capacityIcon: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  capacityIconActive: {
    color: colors.primary,
  },
  capacityLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  capacityLabelActive: {
    color: colors.primary,
  },
  capacityDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  capacityDescActive: {
    color: colors.primary,
    fontWeight: '600',
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
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  saveButtonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
