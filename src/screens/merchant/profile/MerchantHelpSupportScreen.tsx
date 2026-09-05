import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  MessageCircle,
  PhoneCall,
  Mail,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Send,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
  Headphones,
  LifeBuoy,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function MerchantHelpSupportScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Ticket Modal state
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('Billing & Settlement');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // Live Chat Modal state
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hello! Welcome to MyHostel Merchant Priority Support. How can we help your hostel operations today?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs = [
    {
      question: 'How do I collect fee payments digitally from tenants?',
      answer: 'Navigate to the Fees tab and tap "Collect Fee". You can enter tenant details, select payment mode (UPI, Cash, Bank Transfer), and send digital payment links or QR codes directly to tenants.',
    },
    {
      question: 'What are the settlement timelines for online payments?',
      answer: 'Online payments processed via UPI or cards are settled directly into your registered bank account on a T+1 business day schedule (or same-day instant settlement for Premium tier merchants).',
    },
    {
      question: 'How to add a new room or modify bed capacity?',
      answer: 'Go to Rooms tab > tap "+ Add Room". Specify the room number, floor, room type (Single, Double, Triple), monthly rent, and total bed capacity. You can edit room details at any time.',
    },
    {
      question: 'How do I transfer a resident to another room?',
      answer: 'Go to Members tab > select the resident > tap "Transfer Room". Pick the new vacant room/bed and confirm. Ledger balances will automatically sync to the new room.',
    },
    {
      question: 'How do I download monthly tax & revenue reports?',
      answer: 'Under Dashboard > Revenue Stats, tap the "Export Report" button at the top right. Reports are generated in PDF and CSV formats for easy tax filing.',
    },
  ];

  const handleCallSupport = () => {
    Alert.alert(
      'Call Priority Support',
      'Call MyHostel Merchant Desk at 1800-MYHOSTEL (Toll Free)?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL('tel:180069467835').catch(() => {
              Alert.alert('Error', 'Direct calling is not supported on this device.');
            });
          },
        },
      ]
    );
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:merchant-support@myhostel.app?subject=Merchant%20Support%20Request').catch(() => {
      Alert.alert('Email Support', 'Send an email to merchant-support@myhostel.app');
    });
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim()) {
      return Alert.alert('Validation Error', 'Please enter a subject for your support ticket.');
    }
    if (!ticketDescription.trim()) {
      return Alert.alert('Validation Error', 'Please describe your issue in detail.');
    }

    setSubmittingTicket(true);
    setTimeout(() => {
      setSubmittingTicket(false);
      setTicketModalVisible(false);
      const ticketId = `TICKET-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketSubject('');
      setTicketDescription('');

      Alert.alert(
        'Ticket Created Successfully! 🎉',
        `Your ticket ${ticketId} has been registered. Our Merchant Desk representative will contact you within 2 hours.`,
        [{ text: 'OK', style: 'default' }]
      );
    }, 1200);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: chatInput.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulate Agent Auto Response
    setTimeout(() => {
      const agentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: 'Thank you for reaching out! A specialist is reviewing your query. Is there any specific hostel ID or transaction ID associated with this issue?',
      };
      setChatMessages(prev => [...prev, agentMsg]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header Banner */}
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBanner, { paddingTop: insets.top + spacing.s }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Merchant Support</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>24/7 Active</Text>
          </View>
        </View>

        <View style={styles.heroBox}>
          <View style={styles.heroIconCircle}>
            <Headphones color={colors.primary} size={32} strokeWidth={2.5} />
          </View>
          <Text style={styles.heroTitle}>How can we assist your hostel today?</Text>
          <Text style={styles.heroSub}>
            Dedicated assistance for property managers, billings, and technical operations.
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Action Cards */}
        <Text style={styles.sectionTitle}>Get Instant Support</Text>
        <View style={styles.actionGrid}>
          {/* Live Chat */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: '#3B82F6' + '40' }]}
            activeOpacity={0.8}
            onPress={() => setChatModalVisible(true)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#3B82F615' }]}>
              <MessageCircle color="#3B82F6" size={24} strokeWidth={2.5} />
            </View>
            <Text style={styles.actionCardTitle}>Live Chat</Text>
            <Text style={styles.actionCardSub}>Instant messaging</Text>
            <View style={[styles.badgePill, { backgroundColor: '#DBEAFE' }]}>
              <Text style={[styles.badgePillText, { color: '#1E40AF' }]}>Wait: ~1 min</Text>
            </View>
          </TouchableOpacity>

          {/* Call Priority Line */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: '#16A34A' + '40' }]}
            activeOpacity={0.8}
            onPress={handleCallSupport}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#16A34A15' }]}>
              <PhoneCall color="#16A34A" size={24} strokeWidth={2.5} />
            </View>
            <Text style={styles.actionCardTitle}>Call Toll-Free</Text>
            <Text style={styles.actionCardSub}>1800-MYHOSTEL</Text>
            <View style={[styles.badgePill, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.badgePillText, { color: '#15803D' }]}>Priority Call</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          {/* Raise Support Ticket */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: '#8B5CF6' + '40' }]}
            activeOpacity={0.8}
            onPress={() => setTicketModalVisible(true)}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#8B5CF615' }]}>
              <LifeBuoy color="#8B5CF6" size={24} strokeWidth={2.5} />
            </View>
            <Text style={styles.actionCardTitle}>Create Ticket</Text>
            <Text style={styles.actionCardSub}>Detailed issue track</Text>
            <View style={[styles.badgePill, { backgroundColor: '#F3E8FF' }]}>
              <Text style={[styles.badgePillText, { color: '#6B21A8' }]}>Track Status</Text>
            </View>
          </TouchableOpacity>

          {/* Email Support */}
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: '#F59E0B' + '40' }]}
            activeOpacity={0.8}
            onPress={handleEmailSupport}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#F59E0B15' }]}>
              <Mail color="#F59E0B" size={24} strokeWidth={2.5} />
            </View>
            <Text style={styles.actionCardTitle}>Email Support</Text>
            <Text style={styles.actionCardSub}>Response in 2 hrs</Text>
            <View style={[styles.badgePill, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.badgePillText, { color: '#92400E' }]}>Official Desk</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* FAQs Accordion */}
        <View style={{ marginTop: spacing.l }}>
          <View style={styles.sectionHeaderRow}>
            <HelpCircle color={colors.primary} size={20} strokeWidth={2.5} />
            <Text style={styles.sectionTitleText}>Frequently Asked Questions</Text>
          </View>

          <View style={styles.faqList}>
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}
                  activeOpacity={0.85}
                  onPress={() => setExpandedFaq(isExpanded ? null : idx)}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    {isExpanded ? (
                      <ChevronUp color={colors.primary} size={20} />
                    ) : (
                      <ChevronDown color={colors.textTertiary} size={20} />
                    )}
                  </View>
                  {isExpanded && (
                    <View style={styles.faqBody}>
                      <View style={styles.faqDivider} />
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Account Manager Box */}
        <View style={styles.managerCard}>
          <LinearGradient
            colors={['#EFF6FF', '#DBEAFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.managerGradient}
          >
            <View style={styles.managerHeaderRow}>
              <View style={styles.managerAvatarCircle}>
                <ShieldCheck color="#2563EB" size={24} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.managerTitle}>Dedicated Account Manager</Text>
                <Text style={styles.managerName}>Rajesh Sharma • Senior Account Specialist</Text>
              </View>
            </View>
            <Text style={styles.managerDesc}>
              Available Mon - Sat (9:00 AM - 7:00 PM) for custom hostel onboarding, multi-property management, and custom feature requests.
            </Text>
            <TouchableOpacity style={styles.managerBtn} onPress={handleCallSupport} activeOpacity={0.8}>
              <PhoneCall color="#FFFFFF" size={16} strokeWidth={2.5} />
              <Text style={styles.managerBtnText}>Contact Manager</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* CREATE TICKET MODAL */}
      <Modal
        visible={ticketModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <LifeBuoy color={colors.primary} size={22} />
                <Text style={styles.modalTitle}>Raise Support Ticket</Text>
              </View>
              <TouchableOpacity onPress={() => setTicketModalVisible(false)} style={styles.modalCloseBtn}>
                <X color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryRow}>
                {['Billing & Settlement', 'App Bug', 'Resident Issue', 'Hardware/QR'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      ticketCategory === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => setTicketCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        ticketCategory === cat && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Settlement issue for Room 204 fee"
                placeholderTextColor="#94A3B8"
                value={ticketSubject}
                onChangeText={setTicketSubject}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Provide detailed information regarding your issue..."
                placeholderTextColor="#94A3B8"
                multiline={true}
                numberOfLines={4}
                value={ticketDescription}
                onChangeText={setTicketDescription}
              />

              <TouchableOpacity
                style={[styles.submitBtn, submittingTicket && { opacity: 0.6 }]}
                onPress={handleSubmitTicket}
                disabled={submittingTicket}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>
                  {submittingTicket ? 'Submitting Ticket...' : 'Submit Support Ticket'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* LIVE CHAT MODAL */}
      <Modal
        visible={chatModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setChatModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatContainer}
        >
          <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

          {/* Chat Header */}
          <View style={[styles.chatHeader, { paddingTop: insets.top + spacing.xs }]}>
            <TouchableOpacity onPress={() => setChatModalVisible(false)} style={styles.backBtn}>
              <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.chatHeaderTitle}>MyHostel Live Support</Text>
              <Text style={styles.chatHeaderSub}>Support Agent • Online</Text>
            </View>
            <TouchableOpacity onPress={() => setChatModalVisible(false)} style={styles.backBtn}>
              <X color="#FFFFFF" size={22} />
            </TouchableOpacity>
          </View>

          {/* Chat Messages List */}
          <ScrollView
            style={styles.chatBody}
            contentContainerStyle={{ padding: spacing.m, gap: 12 }}
          >
            {chatMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.msgBubble,
                  msg.sender === 'user' ? styles.msgUser : styles.msgAgent,
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    msg.sender === 'user' ? styles.msgTextUser : styles.msgTextAgent,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Quick Action Chips */}
          <View style={styles.quickChipScroll}>
            {['Settlement Time', 'Add Room', 'Payment Failure'].map((chip) => (
              <TouchableOpacity
                key={chip}
                style={styles.quickChip}
                onPress={() => {
                  setChatInput(`I need help regarding: ${chip}`);
                }}
              >
                <Text style={styles.quickChipText}>+ {chip}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chat Input Bar */}
          <View style={[styles.chatInputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Type your message..."
              placeholderTextColor="#94A3B8"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Send color="#FFFFFF" size={18} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBanner: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.l,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4ADE80',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  statusText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '700',
  },
  heroBox: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  heroIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
  scrollContent: {
    padding: spacing.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: spacing.m,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.m,
    marginBottom: spacing.m,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.m,
    borderWidth: 1.5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  actionCardSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: spacing.s,
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.m,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  faqList: {
    gap: spacing.s,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqCardExpanded: {
    borderColor: colors.primary,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    paddingRight: spacing.s,
  },
  faqBody: {
    marginTop: spacing.s,
  },
  faqDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: spacing.s,
  },
  faqAnswer: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  managerCard: {
    marginTop: spacing.l,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  managerGradient: {
    padding: spacing.m,
  },
  managerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  managerAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  managerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  managerName: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  managerDesc: {
    fontSize: 11,
    color: '#3B82F6',
    lineHeight: 16,
    marginBottom: spacing.m,
  },
  managerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
  },
  managerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.l,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: spacing.s,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.s,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: spacing.m,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: spacing.s,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.m,
    marginBottom: spacing.l,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Chat Modal */
  chatContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
  },
  chatHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  chatHeaderSub: {
    color: '#4ADE80',
    fontSize: 11,
  },
  chatBody: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  msgBubble: {
    maxWidth: '80%',
    padding: spacing.m,
    borderRadius: 16,
  },
  msgUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  msgAgent: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  msgTextUser: {
    color: '#FFFFFF',
  },
  msgTextAgent: {
    color: '#E2E8F0',
  },
  quickChipScroll: {
    flexDirection: 'row',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    backgroundColor: '#1E293B',
    gap: 8,
  },
  quickChip: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quickChipText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.s,
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
