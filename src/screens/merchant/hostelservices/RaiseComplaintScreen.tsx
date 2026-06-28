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
} from 'react-native';
import {
  ArrowLeft,
  Send,
  Wrench,
  Zap,
  Wifi,
  Droplets,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RaiseComplaintScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState('Electrical');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');

  const categories = [
    { name: 'Electrical', icon: Zap },
    { name: 'Plumbing', icon: Droplets },
    { name: 'Internet', icon: Wifi },
    { name: 'Other', icon: Wrench },
  ];

  const handleSubmit = () => {
    // Submit logic here
    navigation.goBack();
  };

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
          <Text style={styles.headerTitle}>Raise Complaint</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Complaint Details</Text>

            {/* Room Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Room Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 101"
                placeholderTextColor={colors.textTertiary}
                value={roomNumber}
                onChangeText={setRoomNumber}
              />
            </View>

            {/* Category Selection */}
            <Text style={styles.inputLabel}>Issue Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.name}
                    style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                    activeOpacity={0.8}
                    onPress={() => setCategory(cat.name)}>
                    <cat.icon color={isSelected ? colors.primary : colors.textSecondary} size={20} strokeWidth={2.5} />
                    <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Priority Selection */}
            <Text style={styles.inputLabel}>Priority Level</Text>
            <View style={styles.priorityRow}>
              {['Low', 'Medium', 'High'].map((level) => {
                const isSelected = priority === level;
                return (
                  <TouchableOpacity
                    key={level}
                    style={[styles.priorityCard, isSelected && styles.priorityCardActive]}
                    activeOpacity={0.8}
                    onPress={() => setPriority(level)}>
                    <Text style={[styles.priorityText, isSelected && styles.priorityTextActive]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.textArea}
                multiline
                textAlignVertical="top"
                placeholder="Describe the issue in detail..."
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleSubmit}>
            <Send color="#FFFFFF" size={18} strokeWidth={2.5} />
            <Text style={styles.submitButtonText}>Submit Complaint</Text>
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
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.m,
    minHeight: 120,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  categoryCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.m,
    gap: spacing.s,
  },
  categoryCardActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.primary,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  priorityCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
  },
  priorityCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  priorityTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
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
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
