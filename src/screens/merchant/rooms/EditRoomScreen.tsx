import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Save,
  BedDouble,
  IndianRupee,
  Layers,
  Snowflake,
  Wind,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateRoom, deleteRoom } from '../../../service/merchant';

export default function EditRoomScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { room } = route.params || { room: { id: '101', type: 'Double', capacity: 2, floor: 1, price: 10000, isAC: false } };

  // Parse base room type from stored value like "Double (AC)" or "Single (Non-AC)"
  const parseRoomType = (rawType: string): string => {
    return rawType.replace(/\s*\((?:Non-)?AC\)\s*/gi, '').trim() || 'Double';
  };

  const [roomNumber, setRoomNumber] = useState(room.id || '');
  const [roomType, setRoomType] = useState<'Single' | 'Double' | 'Triple' | 'Dorm'>(
    parseRoomType(room.type || 'Double') as any
  );
  const [capacity, setCapacity] = useState(String(room.capacity || 2));
  const [floor, setFloor] = useState(String(room.floor || 1));
  const [price, setPrice] = useState(String(room.price || 10000));
  const [isAC, setIsAC] = useState(room.isAC || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (!roomNumber || !price || !floor || !capacity) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!room._id) {
      Alert.alert('Error', 'Room ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        roomNumber,
        floor: parseInt(floor, 10),
        pricePerMonth: parseInt(price, 10),
        roomType: isAC ? `${roomType} (AC)` : `${roomType} (Non-AC)`,
        roomCapacity: parseInt(capacity, 10),
      };
      
      const response = await updateRoom(room._id, payload as any);
      
      if (response.status === 200 && response.data?.success) {
        Alert.alert('Success', 'Room updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Failed', response.data?.message || 'Update failed');
      }
    } catch (error: any) {
      const responseData = error?.response?.data;

      // Handle over-capacity block from backend
      if (responseData?.code === 'OVER_CAPACITY') {
        const memberNames = (responseData.members || [])
          .slice(responseData.newCapacity) // Only show the extra members
          .map((m: any) => `• ${m.name}`)
          .join('\n');

        Alert.alert(
          '⚠️ Over Capacity',
          `${responseData.message}\n\nMembers to transfer:\n${memberNames}`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Go Transfer Members',
              onPress: () => navigation.goBack(), // Goes back to RoomDetails where Transfer buttons will be shown
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
      'Are you sure you want to delete this room? This cannot be undone.',
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
                  { text: 'OK', onPress: () => navigation.navigate('RoomsList') } // navigate back to rooms tab
                ]);
              } else {
                Alert.alert('Failed', response.data?.message || 'Could not delete room');
              }
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Something went wrong');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const renderInput = (
    label: string,
    icon: any,
    placeholder: string,
    value: string,
    setValue: (t: string) => void,
    extraProps?: any,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.inputIcon}>
          {React.createElement(icon, { color: colors.primary, size: 20 })}
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={setValue}
          {...extraProps}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Room</Text>
          <TouchableOpacity
            style={styles.saveIconButton}
            onPress={handleSave}
            activeOpacity={0.8}>
            <Save color="#FFFFFF" size={18} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Room Information</Text>

            {renderInput('Room Number', BedDouble, 'e.g. 101', roomNumber, setRoomNumber)}
            {renderInput('Monthly Rent (₹)', IndianRupee, 'e.g. 10000', price, setPrice, { keyboardType: 'numeric' })}
            {renderInput('Floor', Layers, 'e.g. 1', floor, setFloor, { keyboardType: 'numeric' })}
            {renderInput('Capacity (Beds)', BedDouble, 'e.g. 2', capacity, setCapacity, { keyboardType: 'numeric' })}

            {/* Room Type Selector */}
            <Text style={styles.inputLabel}>Room Type</Text>
            <View style={styles.typeGrid}>
              {(['Single', 'Double', 'Triple', 'Dorm'] as const).map((type) => {
                const isSelected = roomType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeCard, isSelected && styles.typeCardActive]}
                    activeOpacity={0.8}
                    onPress={() => setRoomType(type)}>
                    <Text style={[styles.typeText, isSelected && styles.typeTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* AC Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                {isAC ? (
                  <Snowflake color={colors.primary} size={22} strokeWidth={2.5} />
                ) : (
                  <Wind color={colors.textSecondary} size={22} strokeWidth={2.5} />
                )}
                <View>
                  <Text style={styles.toggleLabel}>Air Conditioning</Text>
                  <Text style={styles.toggleSubLabel}>{isAC ? 'AC Room' : 'Non-AC Room'}</Text>
                </View>
              </View>
              <Switch
                value={isAC}
                onValueChange={setIsAC}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={handleSave} disabled={isLoading || isDeleting}>
            {isLoading ? <ActivityIndicator color="#FFFFFF" /> : (
              <>
                <Save color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} activeOpacity={0.85} onPress={handleDelete} disabled={isLoading || isDeleting}>
             {isDeleting ? <ActivityIndicator color="#EF4444" /> : (
               <Text style={styles.deleteButtonText}>Delete Room</Text>
             )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  saveIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacing.l,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.l,
  },
  inputGroup: {
    marginBottom: spacing.l,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.s,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.m,
  },
  inputIcon: {
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  typeCard: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeCardActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.m,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  toggleSubLabel: {
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
    borderRadius: 20,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    marginTop: spacing.m,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});
