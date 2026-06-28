import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  IndianRupee,
  CreditCard,
  FileText,
  CheckCircle2,
  Edit2,
  User,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudentDetailsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // We normally get student details from route.params.id, 
  // but for the demo we'll use a placeholder object.
  const member = {
    name: 'David Wilson',
    id: 'M-1045',
    status: 'Active',
    room: '103',
    bed: 'B',
    phone: '+91 98765 43210',
    joinDate: '10 Mar 2026',
    balance: 4500,
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Member Profile</Text>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Edit2 color={colors.text} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          {/* Profile Header Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
                <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberId}>ID: {member.id}</Text>
                <View style={styles.badgeContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
                    <CheckCircle2 color={colors.success} size={14} strokeWidth={3} />
                    <Text style={[styles.statusText, { color: colors.success }]}>
                      {member.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
                <Phone color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.actionBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} activeOpacity={0.8}>
                <MessageSquare color={colors.primary} size={18} strokeWidth={2.5} />
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Accommodation Details */}
          <Text style={styles.sectionTitle}>Accommodation</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <MapPin color={colors.primary} size={20} strokeWidth={2.5} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Room & Bed</Text>
                <Text style={styles.infoValue}>Room {member.room} • Bed {member.bed}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Calendar color={colors.primary} size={20} strokeWidth={2.5} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Joining Date</Text>
                <Text style={styles.infoValue}>{member.joinDate}</Text>
              </View>
            </View>
          </View>

          {/* Financial Overview */}
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          <View style={styles.card}>
            <View style={styles.financeHeader}>
              <View>
                <Text style={styles.infoLabel}>Current Balance</Text>
                <Text style={styles.balanceValue}>₹{member.balance}</Text>
              </View>
              <TouchableOpacity style={styles.collectBtn} activeOpacity={0.8}>
                <Text style={styles.collectBtnText}>Collect</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.historyRow} 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MemberTransactions')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.m }}>
                <View style={[styles.infoIconBox, { backgroundColor: colors.successBg }]}>
                  <CreditCard color={colors.success} size={20} strokeWidth={2.5} />
                </View>
                <View>
                  <Text style={styles.historyTitle}>Recent Payment</Text>
                  <Text style={styles.historySubtitle}>₹5,000 • 12 Jun 2026</Text>
                </View>
              </View>
              <ArrowLeft color={colors.textTertiary} size={20} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>

          {/* Documents */}
          <Text style={styles.sectionTitle}>Documents</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.documentRow} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.m }}>
                <View style={[styles.infoIconBox, { backgroundColor: '#F1F5F9' }]}>
                  <User color={colors.textSecondary} size={20} strokeWidth={2.5} />
                </View>
                <View>
                  <Text style={styles.documentTitle}>Aadhar Card</Text>
                  <Text style={styles.documentSubtitle}>Verified • ID Proof</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
                <Text style={[styles.statusText, { color: colors.success }]}>View</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.documentRow} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.m }}>
                <View style={[styles.infoIconBox, { backgroundColor: '#F1F5F9' }]}>
                  <FileText color={colors.textSecondary} size={20} strokeWidth={2.5} />
                </View>
                <View>
                  <Text style={styles.documentTitle}>Rental Agreement</Text>
                  <Text style={styles.documentSubtitle}>Signed • 10 Mar 2026</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
                <Text style={[styles.statusText, { color: colors.success }]}>View</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
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
  iconButton: {
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
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.l,
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  memberId: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  actionBtnOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.l,
  },
  financeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.danger,
  },
  collectBtn: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  collectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  documentSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
