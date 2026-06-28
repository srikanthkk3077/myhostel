import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Save,
  Coffee,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateMessMenu } from '../../../service/menuService';

export default function EditMenuScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { day, menu = {} } = route.params || { day: 'Mon', menu: {} };

  // State for editing
  const [breakfast, setBreakfast] = useState(menu.breakfast || '');
  const [lunch, setLunch] = useState(menu.lunch || '');
  const [snacks, setSnacks] = useState(menu.snacks || '');
  const [dinner, setDinner] = useState(menu.dinner || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const response = await updateMessMenu(day, {
        breakfast,
        lunch,
        snacks,
        dinner,
      });

      if (response.status === 200 && response.data?.success) {
        Alert.alert('Success', `${day}'s menu updated successfully!`);
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to update menu');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderInput = (
    title: string,
    time: string,
    icon: any,
    color: string,
    value: string,
    setValue: (t: string) => void,
  ) => (
    <View style={styles.inputSection}>
      <View style={styles.inputHeader}>
        <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
          {React.createElement(icon, { color, size: 20, strokeWidth: 2.5 })}
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.inputTitle}>{title}</Text>
          <Text style={styles.inputTime}>{time}</Text>
        </View>
      </View>
      <TextInput
        style={styles.textArea}
        multiline
        textAlignVertical="top"
        placeholder={`Enter ${title} items...`}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={setValue}
      />
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
          <Text style={styles.headerTitle}>Edit {day}'s Menu</Text>
          <TouchableOpacity
            style={[styles.saveIconButton, submitting && { backgroundColor: colors.textSecondary }]}
            onPress={handleSave}
            disabled={submitting}
            activeOpacity={0.8}>
            <Save color="#FFFFFF" size={18} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {renderInput('Breakfast', '07:30 AM - 09:30 AM', Coffee, colors.warning, breakfast, setBreakfast)}
          {renderInput('Lunch', '12:30 PM - 02:30 PM', Sun, colors.primary, lunch, setLunch)}
          {renderInput('Snacks', '05:00 PM - 06:00 PM', Sunset, colors.info, snacks, setSnacks)}
          {renderInput('Dinner', '08:00 PM - 10:00 PM', Moon, colors.success, dinner, setDinner)}

          <TouchableOpacity 
            style={[styles.saveButton, submitting && { backgroundColor: colors.textSecondary }]} 
            activeOpacity={0.85} 
            onPress={handleSave}
            disabled={submitting}
          >
            <Save color="#FFFFFF" size={18} strokeWidth={2.5} />
            <Text style={styles.saveButtonText}>
              {submitting ? 'Updating...' : 'Update Menu'}
            </Text>
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
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    gap: spacing.m,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBox: {
    flex: 1,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  inputTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.m,
    minHeight: 100,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
    marginTop: spacing.s,
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
});
