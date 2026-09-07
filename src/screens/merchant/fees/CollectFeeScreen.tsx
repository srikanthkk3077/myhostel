import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { ArrowLeft, Check, Calendar as CalendarIcon, IndianRupee, CreditCard, Banknote, User, ChevronDown, ChevronLeft, ChevronRight, Search, X, Phone, MessageSquare } from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMembers, collectFee } from '../../../service/merchant';
import CustomCalendarModal from '../../../components/CustomCalendarModal';

export default function CollectFeeScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(false);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Bank'>('UPI');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [remarks, setRemarks] = useState('');

  // Fetch active members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getMembers();
        if (response.status === 200 && response.data?.success) {
          const allMembers = response.data.data || [];

          // Only include members who have pending fees for the current month
          // (Exclude members who have already paid or have 0 computed balance)
          const pendingMembers = allMembers.filter((m: any) => {
            const hasPaid = m.hasPaidCurrentMonth === true || (m.computedBalance !== undefined && m.computedBalance === 0);
            return !hasPaid;
          });
          setMembersList(pendingMembers);

          // If param is passed from PendingFeesScreen or MemberDetails, pre-select
          if (route.params?.memberId) {
            const targetId = route.params.memberId;
            const found = allMembers.find((m: any) => m._id === targetId || m.id === targetId);
            if (found) {
              const isPaid = found.hasPaidCurrentMonth === true || (found.computedBalance !== undefined && found.computedBalance === 0);
              if (isPaid) {
                Alert.alert('Fee Already Paid', `${found.name} has already paid the monthly fee for this month.`);
              } else {
                setSelectedMember(found);
                const dueAmt = found.computedBalance !== undefined ? found.computedBalance : (found.monthlyRent ?? '');
                setAmount(String(route.params?.amount ?? dueAmt ?? ''));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching members', error);
      }
    };
    fetchMembers();
  }, [route.params]);

  const handleCollect = async () => {
    if (!selectedMember) {
      Alert.alert('Error', 'Please select a member');
      return;
    }
    const memberId = selectedMember._id || selectedMember.id;
    if (!memberId) {
      Alert.alert('Error', 'Selected member ID is missing');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      let paymentDate = new Date();
      let currentMonthStr = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (date && date.includes('/')) {
        const parts = date.split('/');
        if (parts.length === 3) {
          const parsed = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          if (!isNaN(parsed.getTime())) {
            paymentDate = parsed;
            currentMonthStr = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
          }
        }
      }
      
      const payload = {
        memberId,
        amount: Number(amount),
        type: 'Monthly Fee',
        paymentMonth: currentMonthStr,
        paymentDate,
        paymentMethod,
        remarks: remarks.trim() || undefined,
      };

      const response = await collectFee(payload);
      if ((response.status === 200 || response.status === 201) && response.data?.success) {
        Alert.alert('Success', 'Payment recorded successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to record payment');
      }
    } catch (error: any) {
      console.error('Fee collection error:', error);
      const errMsg = error.response?.data?.message || error?.data?.message || error?.message || 'Something went wrong while recording payment';
      Alert.alert('Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber?: string) => {
    const num = phoneNumber || selectedMember?.phone || selectedMember?.mobile || '9123456789';
    Linking.openURL(`tel:${num}`).catch(() => {
      Alert.alert('Error', 'Unable to initiate phone call');
    });
  };

  const handleMessage = (phoneNumber?: string) => {
    const num = phoneNumber || selectedMember?.phone || selectedMember?.mobile || '9123456789';
    Linking.openURL(`sms:${num}`).catch(() => {
      Alert.alert('Error', 'Unable to open SMS messaging');
    });
  };

  const filteredMembers = membersList.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            
            {/* Top Selected Member Call & Message Contact Header */}
            {selectedMember && (
              <View style={styles.memberHeaderCard}>
                <View style={styles.memberHeaderTop}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>
                      {selectedMember.name ? selectedMember.name.slice(0, 2).toUpperCase() : 'ME'}
                    </Text>
                  </View>
                  <View style={styles.memberHeaderDetails}>
                    <Text style={styles.memberHeaderName}>{selectedMember.name}</Text>
                    <Text style={styles.memberHeaderSub}>
                      {`Room ${selectedMember.room || selectedMember.roomNumber || '101'} • Rent: ₹${selectedMember.monthlyRent || amount}`}
                    </Text>
                    <Text style={styles.memberHeaderPhone}>
                      {`📱 ${selectedMember.phone || selectedMember.mobile || '9123456789'}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.memberActionRow}>
                  <TouchableOpacity 
                    style={styles.callActionButton}
                    activeOpacity={0.8}
                    onPress={() => handleCall(selectedMember.phone || selectedMember.mobile)}
                  >
                    <Phone color="#FFFFFF" size={16} strokeWidth={2.5} />
                    <Text style={styles.callActionButtonText}>Call Member</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.messageActionButton}
                    activeOpacity={0.8}
                    onPress={() => handleMessage(selectedMember.phone || selectedMember.mobile)}
                  >
                    <MessageSquare color={colors.primary} size={16} strokeWidth={2.5} />
                    <Text style={styles.messageActionButtonText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Custom dropdown styled input for Member Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Member Name</Text>
              <TouchableOpacity 
                style={styles.inputWrapper} 
                onPress={() => setShowMemberModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.inputIcon}>
                  <User color={colors.primary} size={20} />
                </View>
                <View style={{ flex: 1, paddingVertical: Platform.OS === 'ios' ? 14 : 10 }}>
                  <Text style={[styles.inputText, !selectedMember && { color: colors.textTertiary }]}>
                    {selectedMember ? `${selectedMember.name} (Room ${selectedMember.room || 'N/A'})` : 'Select member...'}
                  </Text>
                </View>
                <ChevronDown color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            {renderInput('Amount (₹)', IndianRupee, 'e.g. 5000', amount, setAmount, { keyboardType: 'numeric' })}
            
            {/* Interactive Date Field with Calendar Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.inputWrapper} 
                onPress={() => setShowCalendarModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.inputIcon}>
                  <CalendarIcon color={colors.primary} size={20} />
                </View>
                <View style={{ flex: 1, paddingVertical: Platform.OS === 'ios' ? 14 : 10 }}>
                  <Text style={styles.inputText}>
                    {date}
                  </Text>
                </View>
                <ChevronDown color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

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
              style={[styles.collectButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleCollect}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.collectButtonText}>Record Payment</Text>
                  <Check color="#FFFFFF" size={18} strokeWidth={2.5} />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Calendar Component Modal */}
      <CustomCalendarModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={date}
        onSelectDate={(newDateStr) => {
          setDate(newDateStr);
        }}
        title="Select Payment Date"
      />

      {/* Member Selection Modal */}
      <Modal
        visible={showMemberModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Member</Text>
              <TouchableOpacity onPress={() => setShowMemberModal(false)}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchWrapper}>
              <Search color={colors.textSecondary} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredMembers}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedMember?._id === item._id;
                return (
                  <View style={styles.memberItem}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setSelectedMember(item);
                        const dueAmt = item.computedBalance !== undefined ? item.computedBalance : (item.monthlyRent || '');
                        setAmount(String(dueAmt));
                        setShowMemberModal(false);
                        setSearchQuery('');
                      }}
                    >
                      <View style={styles.memberInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.memberName}>{item.name}</Text>
                          {isSelected && <Check color={colors.primary} size={18} strokeWidth={3} />}
                        </View>
                        <Text style={styles.memberSub}>
                          {`Room: ${item.room || 'Unassigned'} • Due: ₹${(item.computedBalance ?? item.monthlyRent ?? 0).toLocaleString('en-IN')}`}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.memberItemActions}>
                      <TouchableOpacity 
                        style={styles.iconCircleBtnCall} 
                        onPress={() => handleCall(item.phone || item.mobile)}
                      >
                        <Phone color="#16A34A" size={16} strokeWidth={2.5} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.iconCircleBtnMsg} 
                        onPress={() => handleMessage(item.phone || item.mobile)}
                      >
                        <MessageSquare color={colors.primary} size={16} strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>All members have paid their fees for this month 🎉</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
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
  inputText: {
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
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    padding: spacing.l,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginLeft: spacing.s,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  memberSub: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  /* Member Contact Header Styles */
  memberHeaderCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memberHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    gap: spacing.m,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  memberHeaderDetails: {
    flex: 1,
  },
  memberHeaderName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  memberHeaderSub: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  memberHeaderPhone: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  memberActionRow: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  callActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  callActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  messageActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  messageActionButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  memberItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleBtnCall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleBtnMsg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
