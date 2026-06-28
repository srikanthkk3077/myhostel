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
} from 'react-native';
import { ArrowLeft, Check, Calendar, IndianRupee, CreditCard, Banknote, User } from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CollectFeeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [member, setMember] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Bank'>('UPI');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [remarks, setRemarks] = useState('');

  const handleCollect = () => {
    // Collect fee logic here
    navigation.goBack();
  };

  const renderInput = (label: string, icon: any, placeholder: string, value: string, setValue: (t: string) => void, extraProps?: any) => (
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
          <Text style={styles.headerTitle}>Collect Fee</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            
            {renderInput('Member Name', User, 'Search member...', member, setMember)}
            {renderInput('Amount (₹)', IndianRupee, 'e.g. 5000', amount, setAmount, { keyboardType: 'numeric' })}
            {renderInput('Date', Calendar, 'DD/MM/YYYY', date, setDate)}

            <Text style={styles.inputLabel}>Payment Method</Text>
            <View style={styles.methodsRow}>
              {[
                { id: 'UPI', icon: CreditCard, label: 'UPI' },
                { id: 'Cash', icon: Banknote, label: 'Cash' },
                { id: 'Bank', icon: Banknote, label: 'Bank' },
              ].map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[styles.methodCard, isSelected && styles.methodCardActive]}
                    activeOpacity={0.8}
                    onPress={() => setPaymentMethod(method.id as any)}>
                    <method.icon 
                      color={isSelected ? colors.primary : colors.textSecondary} 
                      size={20} 
                      strokeWidth={isSelected ? 2.5 : 2} 
                    />
                    <Text style={[styles.methodText, isSelected && styles.methodTextActive]}>
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {renderInput('Remarks (Optional)', Banknote, 'Any notes about this payment', remarks, setRemarks)}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.collectButton}
              activeOpacity={0.85}
              onPress={handleCollect}>
              <Text style={styles.collectButtonText}>Record Payment</Text>
              <Check color="#FFFFFF" size={18} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

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
  methodsRow: {
    flexDirection: 'row',
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  methodCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  methodCardActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  methodTextActive: {
    color: colors.primary,
  },
  buttonContainer: {
    marginBottom: spacing.l,
  },
  collectButton: {
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
  collectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
