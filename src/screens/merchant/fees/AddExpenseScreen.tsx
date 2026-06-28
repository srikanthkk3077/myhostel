import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  ArrowLeft,
  IndianRupee,
  FileText,
  Zap,
  Wrench,
  ShoppingCart,
  AlignLeft,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addExpense } from '../../../service/merchant';

export default function AddExpenseScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Utility');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'Utility', icon: Zap, color: colors.warning },
    { id: 'Maintenance', icon: Wrench, color: colors.info },
    { id: 'Supplies', icon: ShoppingCart, color: colors.primary },
  ];

  const handleSave = async () => {
    if (!title.trim() || !amount.trim()) {
      // Basic validation
      return;
    }

    setLoading(true);
    try {
      const response = await addExpense({
        title: title.trim(),
        amount: Number(amount),
        category: selectedCategory,
        description: description.trim(),
      });

      if (response.status === 201) {
        ReactNativeHapticFeedback.trigger('notificationSuccess', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    Icon: any,
    placeholder: string,
    value: string,
    onChange: (text: string) => void,
    options: any = {}
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconBox}>
          <Icon color={colors.primary} size={18} strokeWidth={2.5} />
        </View>
        <TextInput
          style={[styles.input, options.multiline && { height: 100, textAlignVertical: 'top' }]}
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            disabled={loading}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Record Expense</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.formCard}>
            
            {renderInput('Expense Title', FileText, 'e.g. Electricity Bill', title, setTitle, {
              editable: !loading,
            })}
            
            {renderInput('Amount', IndianRupee, 'e.g. 1500', amount, setAmount, {
              keyboardType: 'numeric',
              editable: !loading,
            })}

            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryOption, isActive && { backgroundColor: cat.color + '20', borderColor: cat.color }]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedCategory(cat.id)}
                      disabled={loading}>
                      <cat.icon color={isActive ? cat.color : colors.textSecondary} size={20} strokeWidth={2.5} />
                      <Text style={[styles.categoryText, isActive && { color: cat.color, fontWeight: '700' }]}>
                        {cat.id}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {renderInput('Description', AlignLeft, 'Optional details about this expense...', description, setDescription, {
              multiline: true,
              numberOfLines: 4,
              editable: !loading,
            })}

          </View>

          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!title.trim() || !amount.trim() || loading) && styles.saveButtonDisabled
            ]} 
            activeOpacity={0.8} 
            onPress={handleSave}
            disabled={!title.trim() || !amount.trim() || loading}>
            <View style={styles.saveButtonShine} />
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Add Expense</Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.l,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
  },
  fieldWrapper: {
    marginBottom: spacing.l,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.s,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  categoryOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: spacing.m,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.s,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.5,
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
