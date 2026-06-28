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
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Users,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createVisitorRequest } from '../../service/visitorRequestService';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export default function ApplyVisitorRequestScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const getTodayDateStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const relations = ['Parent', 'Sibling', 'Relative', 'Friend', 'Other'];
  
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [relation, setRelation] = useState('Parent');
  const [customRelation, setCustomRelation] = useState('');
  const [visitDate, setVisitDate] = useState(getTodayDateStr());
  const [visitTime, setVisitTime] = useState('04:00 PM');
  const [purpose, setPurpose] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!visitorName.trim()) {
      Alert.alert('Error', 'Please enter visitor name.');
      return;
    }
    if (!visitorPhone.trim() || visitorPhone.length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
      return;
    }

    const finalRelation = relation === 'Other' ? customRelation : relation;
    if (relation === 'Other' && !customRelation.trim()) {
      Alert.alert('Error', 'Please specify the relation.');
      return;
    }

    // Basic date parsing validation
    const dateParts = visitDate.split('-');
    if (dateParts.length !== 3 || isNaN(new Date(visitDate).getTime())) {
      Alert.alert('Error', 'Please enter date in YYYY-MM-DD format.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createVisitorRequest({
        visitorName: visitorName.trim(),
        visitorPhone: visitorPhone.trim(),
        relation: finalRelation.trim(),
        visitDate,
        visitTime: visitTime.trim(),
        purpose: purpose.trim() || undefined,
      });

      if (response.status === 201 && response.data?.success) {
        ReactNativeHapticFeedback.trigger('notificationSuccess', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
        Alert.alert('Success', 'Visitor Request submitted successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to submit visitor request');
      }
    } catch (error: any) {
      console.error('Error submitting visitor request:', error);
      Alert.alert('Error', error.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            disabled={submitting}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Visitor Request</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Visitor Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Visitor Full Name</Text>
              <View style={styles.iconInputContainer}>
                <User color={colors.textSecondary} size={18} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="e.g. Ramesh Kumar"
                  placeholderTextColor={colors.textTertiary}
                  value={visitorName}
                  onChangeText={setVisitorName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numeric"
                  maxLength={10}
                  value={visitorPhone}
                  onChangeText={setVisitorPhone}
                />
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Relation to Student</Text>
            <View style={styles.categoryGrid}>
              {relations.map((rel) => {
                const isSelected = relation === rel;
                return (
                  <TouchableOpacity
                    key={rel}
                    style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                    activeOpacity={0.8}
                    onPress={() => setRelation(rel)}>
                    <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                      {rel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {relation === 'Other' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Specify Relation</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Uncle, Local Guardian"
                  placeholderTextColor={colors.textTertiary}
                  value={customRelation}
                  onChangeText={setCustomRelation}
                />
              </View>
            )}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Schedule & Purpose</Text>

            <View style={styles.dateTimeRow}>
              <View style={[styles.inputGroup, { flex: 1.2 }]}>
                <Text style={styles.inputLabel}>Visit Date</Text>
                <View style={styles.iconInputContainer}>
                  <Calendar color={colors.textSecondary} size={18} />
                  <TextInput
                    style={styles.iconInput}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textTertiary}
                    value={visitDate}
                    onChangeText={setVisitDate}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Expected Time</Text>
                <View style={styles.iconInputContainer}>
                  <Clock color={colors.textSecondary} size={18} />
                  <TextInput
                    style={styles.iconInput}
                    placeholder="04:00 PM"
                    placeholderTextColor={colors.textTertiary}
                    value={visitTime}
                    onChangeText={setVisitTime}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.inputGroup, { marginTop: spacing.l }]}>
              <Text style={styles.inputLabel}>Purpose of Visit (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bringing books / luggage"
                placeholderTextColor={colors.textTertiary}
                value={purpose}
                onChangeText={setPurpose}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, submitting && { opacity: 0.8 }]} 
            activeOpacity={0.85} 
            onPress={handleSubmit}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Users color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </>
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.l,
  },
  inputGroup: {
    marginBottom: spacing.m,
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
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    color: colors.text,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  categoryCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryCardActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
  },
  iconInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingLeft: spacing.s,
    fontSize: 14,
    color: colors.text,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  countryCodeBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.m,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    color: colors.text,
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
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
