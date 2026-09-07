import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Modal,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
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
  X,
  ArrowRight,
  Home,
  Check,
  Trash2,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMemberById, deleteMember, transferMember, getRooms, getMemberTransactions } from '../../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';

export default function StudentDetailsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const targetId = route.params?.id || route.params?.memberId;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Transfer States
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferStep, setTransferStep] = useState<1 | 2 | 3>(1);
  const [selectedNewRoom, setSelectedNewRoom] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [transferring, setTransferring] = useState(false);

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentTransaction, setRecentTransaction] = useState<any>(null);

  const fetchMember = async () => {
    try {
      if (!targetId) return;
      let currentMemberRoom = '';
      const response = await getMemberById(targetId);
      if (response.status === 200 && response.data?.success) {
        const m = response.data.data;
        currentMemberRoom = m.room || '';

        // Determine correct current balance for mid-join members:
        // - If isMidJoin is true AND the joining month == current month → use midJoinAmount
        // - Otherwise → use standard monthlyRent
        const fullRent = m.monthlyRent ?? m.monthlyFee ?? m.rent ?? 0;
        const isMidJoin = m.isMidJoin ?? false;
        const midJoinAmt = m.midJoinAmount ?? 0;
        let computedBalance = m.computedBalance !== undefined
          ? m.computedBalance
          : (m.hasPaidCurrentMonth ? 0 : fullRent);

        if (m.computedBalance === undefined && !m.hasPaidCurrentMonth) {
          if (isMidJoin && midJoinAmt > 0) {
            const joiningStr = m.joiningDate || m.joinDate || '';
            if (joiningStr) {
              // Parse joining date (supports DD/MM/YYYY, YYYY-MM-DD, ISO)
              let joinDateObj: Date | null = null;
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(joiningStr)) {
                const [d, mo, y] = joiningStr.split('/');
                joinDateObj = new Date(Number(y), Number(mo) - 1, Number(d));
              } else {
                joinDateObj = new Date(joiningStr);
              }
              if (joinDateObj && !isNaN(joinDateObj.getTime())) {
                const now = new Date();
                const isJoiningMonth =
                  joinDateObj.getFullYear() === now.getFullYear() &&
                  joinDateObj.getMonth() === now.getMonth();
                computedBalance = isJoiningMonth ? midJoinAmt : fullRent;
              }
            }
          }
        }

        let hasPaid = m.hasPaidCurrentMonth ?? (computedBalance === 0);

        // Fetch latest transaction for this member
        try {
          const txnRes = await getMemberTransactions(m._id);
          if (txnRes.status === 200 && txnRes.data?.success) {
            const txnsData = txnRes.data.data;
            const txns: any[] = Array.isArray(txnsData)
              ? txnsData
              : (txnsData?.transactions || []);

            if (txns.length > 0) {
              // Sort descending by date and take most recent
              const sorted = [...txns].sort((a, b) => {
                const dateA = new Date(a.date || a.createdAt || a.paymentDate).getTime();
                const dateB = new Date(b.date || b.createdAt || b.paymentDate).getTime();
                return dateB - dateA;
              });
              setRecentTransaction(sorted[0]);

              // Check if current month fee is paid in transactions
              const now = new Date();
              const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
              const isCurrentMonthPaid = txns.some(t => {
                const statusMatches = String(t.status).toLowerCase() === 'paid';
                const monthMatches = t.paymentMonth === currentMonthStr;
                return statusMatches && (monthMatches || t.type === 'credit');
              });

              if (isCurrentMonthPaid) {
                hasPaid = true;
                computedBalance = 0;
              }
            } else {
              setRecentTransaction(null);
            }
          }
        } catch (_txnErr) {
          // Non-critical, silently ignore
        }

        if (hasPaid) {
          computedBalance = 0;
        }

        setMember({
          id: m._id,
          _id: m._id,
          name: m.name,
          status: hasPaid ? 'Active' : (m.computedStatus || m.status || 'Active'),
          hasPaidCurrentMonth: hasPaid,
          room: m.room,
          bed: m.bed || 'Bed 1',
          phone: m.mobile || m.phone,
          mobile: m.mobile || m.phone,
          parentName: m.parentName || '',
          parentPhone: m.parentPhone || '',
          joinDate: m.joiningDate || m.joinDate || '-',
          joiningDate: m.joiningDate || m.joinDate || '-',
          balance: computedBalance,
          aadhar: m.aadhar || '',
          deposit: m.securityDeposit !== undefined ? m.securityDeposit : (m.deposit ?? 0),
          securityDeposit: m.securityDeposit !== undefined ? m.securityDeposit : (m.deposit ?? 0),
          rent: fullRent,
          monthlyRent: fullRent,
          isMidJoin,
          midJoinAmount: midJoinAmt,
          photoUri: m.photoUri || null,
          aadharDoc: m.aadharDoc || null,
          rentalDoc: m.rentalDoc || null,
        });
      }

      // Fetch dynamic rooms
      const roomsRes = await getRooms();
      if (roomsRes.status === 200 && roomsRes.data?.success) {
        const roomsList = roomsRes.data.data;
        const mappedRooms = roomsList.map((r: any) => {
          const occ = r.occupants !== undefined ? r.occupants : (r.members ? r.members.length : 0);
          const cap = r.roomCapacity || 1;
          const isCurrent = r.roomNumber === currentMemberRoom;
          const isFull = !isCurrent && occ >= cap;
          return {
            id: r.roomNumber,
            type: r.roomType,
            rent: r.pricePerMonth,
            floor: r.floor,
            capacity: cap,
            occupants: occ,
            isCurrent,
            isFull,
          };
        });
        setAvailableRooms(mappedRooms);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMember();
    }, [])
  );

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

  const handleDelete = () => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${member?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!targetId) return;
              const response = await deleteMember(targetId);
              if (response.status === 200 && response.data?.success) {
                Alert.alert('Success', 'Member deleted', [
                  { text: 'OK', onPress: () => navigation.goBack() }
                ]);
              } else {
                Alert.alert('Failed', response.data?.message || 'Could not delete member');
              }
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Something went wrong');
            }
          },
        },
      ]
    );
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const currentRent = member?.rent || 0;
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - now.getDate());
  const rentDifference = selectedNewRoom ? selectedNewRoom.rent - currentRent : 0;
  const proratedDifference = selectedNewRoom ? Math.round((rentDifference / daysInMonth) * daysRemaining) : 0;

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
    setTransferStep(1);
    setSelectedNewRoom(null);
  };

  const handleTransferComplete = async () => {
    if (!targetId || !selectedNewRoom) return;
    setTransferring(true);
    try {
      const response = await transferMember(targetId, selectedNewRoom.id);
      if (response.status === 200 && response.data?.success) {
        setTransferStep(3);
        setTimeout(() => {
          handleCloseTransferModal();
          fetchMember(); // Refresh member profile
        }, 1800);
      } else {
        Alert.alert('Transfer Failed', response.data?.message || 'Transfer failed');
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || 'Something went wrong';
      Alert.alert('Transfer Failed', errMsg);
    } finally {
      setTransferring(false);
    }
  };

  const handleCall = (numberOverride?: string) => {
    const phoneNumber = numberOverride || member?.phone || member?.mobile;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('Phone Unavailable', 'No phone number available for this member.');
    }
  };

  const handleMessage = (numberOverride?: string) => {
    const phoneNumber = numberOverride || member?.phone || member?.mobile;
    if (phoneNumber) {
      Linking.openURL(`sms:${phoneNumber}`);
    } else {
      Alert.alert('Phone Unavailable', 'No phone number available for this member.');
    }
  };

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
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => navigation.navigate('EditStudent', { member })}>
              <Edit2 color={colors.text} size={20} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={handleDelete}>
              <Trash2 color={colors.danger} size={20} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {loading || !member ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
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
                    {member.photoUri ? (
                      <Image source={{ uri: member.photoUri }} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
                    )}
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
                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.8}
                    onPress={() => handleCall()}>
                    <Phone color="#FFFFFF" size={18} strokeWidth={2.5} />
                    <Text style={styles.actionBtnText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnOutline]}
                    activeOpacity={0.8}
                    onPress={() => handleMessage()}>
                    <MessageSquare color={colors.primary} size={18} strokeWidth={2.5} />
                    <Text style={[styles.actionBtnText, { color: colors.primary }]}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Accommodation Details */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Accommodation</Text>
                {/* <TouchableOpacity
                  style={styles.transferBtn}
                  activeOpacity={0.8}
                  onPress={() => setShowTransferModal(true)}>
                  <Text style={styles.transferBtnText}>Transfer Room</Text>
                </TouchableOpacity> */}
              </View>
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
                    <Text
                      style={[
                        styles.balanceValue,
                        (member.balance === 0 || member.hasPaidCurrentMonth) && { color: colors.success },
                      ]}>
                      ₹{(member.balance ?? 0).toLocaleString('en-IN')}
                    </Text>
                  </View>
                  {member.balance === 0 || member.hasPaidCurrentMonth ? (
                    <View style={[styles.collectBtn, { backgroundColor: colors.successBg, borderWidth: 1, borderColor: '#A7F3D0' }]}>
                      <Text style={[styles.collectBtnText, { color: colors.success }]}>Paid ✓</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.collectBtn}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('FeesTab', { screen: 'CollectFee', params: { memberId: member.id } })}>
                      <Text style={styles.collectBtnText}>Collect</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.divider} />

                {/* Monthly Rent */}
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <IndianRupee color="#2563EB" size={20} strokeWidth={2.5} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Monthly Rent</Text>
                    <Text style={styles.infoValue}>
                      ₹{(member.rent || member.monthlyRent || (recentTransaction?.amount ?? 0)).toLocaleString('en-IN')}
                      <Text style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary }}> / month</Text>
                    </Text>
                  </View>
                  {(member.deposit > 0 || member.securityDeposit > 0) && (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.infoLabel}>Security Deposit</Text>
                      <Text style={[styles.infoValue, { fontSize: 15 }]}>
                        ₹{(member.deposit || member.securityDeposit || 0).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Mid-Month Join Badge */}
                {member.isMidJoin && (
                  <View style={styles.midJoinBanner}>
                    <Text style={styles.midJoinBannerIcon}>📅</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.midJoinBannerTitle}>Mid-Month Join</Text>
                      <Text style={styles.midJoinBannerSub}>
                        1st month: ₹{(member.midJoinAmount ?? 0).toLocaleString('en-IN')} (prorated){'\n'}
                        From next month: ₹{(member.rent ?? 0).toLocaleString('en-IN')} / month
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.historyRow}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('MemberTransactions', { memberId: member.id, memberName: member.name })}>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.m }}>
                    <View style={[styles.infoIconBox, { backgroundColor: colors.successBg }]}>
                      <CreditCard color={colors.success} size={20} strokeWidth={2.5} />
                    </View>
                    <View>
                      <Text style={styles.historyTitle}>Recent Payment</Text>
                      {recentTransaction ? (
                        <Text style={styles.historySubtitle}>
                          ₹{(recentTransaction.amount ?? 0).toLocaleString('en-IN')} •{' '}
                          {recentTransaction.date
                            ? (isNaN(new Date(recentTransaction.date).getTime())
                                ? recentTransaction.date
                                : new Date(recentTransaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))
                            : (recentTransaction.createdAt
                                ? new Date(recentTransaction.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                : 'Recent')}
                        </Text>
                      ) : (
                        <Text style={styles.historySubtitle}>No payments yet</Text>
                      )}
                    </View>
                  </View>
                  <ArrowLeft color={colors.textTertiary} size={20} style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
              </View>

              {/* Documents */}
              <Text style={styles.sectionTitle}>Documents</Text>
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.documentRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (member.aadharDoc) {
                      Alert.alert('Aadhar Card Document', `File URI: ${member.aadharDoc}`);
                    } else {
                      Alert.alert('Document Missing', 'Aadhar card has not been uploaded yet.', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Upload Now', onPress: () => navigation.navigate('EditStudent', { member }) }
                      ]);
                    }
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.m }}>
                    <View style={[styles.infoIconBox, { backgroundColor: member.aadharDoc ? '#ECFDF5' : '#F1F5F9' }]}>
                      <User color={member.aadharDoc ? colors.success : colors.textSecondary} size={20} strokeWidth={2.5} />
                    </View>
                    <View>
                      <Text style={styles.documentTitle}>Aadhar Card</Text>
                      <Text style={styles.documentSubtitle}>
                        {member.aadharDoc ? 'Uploaded • ID Proof' : 'Not Uploaded'}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: member.aadharDoc ? colors.successBg : '#F1F5F9' }]}>
                    <Text style={[styles.statusText, { color: member.aadharDoc ? colors.success : colors.textTertiary }]}>
                      {member.aadharDoc ? 'View' : 'Pending'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.documentRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (member.rentalDoc) {
                      Alert.alert('Rental Agreement Document', `File URI: ${member.rentalDoc}`);
                    } else {
                      Alert.alert('Document Missing', 'Rental agreement has not been uploaded yet.', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Upload Now', onPress: () => navigation.navigate('EditStudent', { member }) }
                      ]);
                    }
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.m }}>
                    <View style={[styles.infoIconBox, { backgroundColor: member.rentalDoc ? '#EDE9FE' : '#F1F5F9' }]}>
                      <FileText color={member.rentalDoc ? '#8B5CF6' : colors.textSecondary} size={20} strokeWidth={2.5} />
                    </View>
                    <View>
                      <Text style={styles.documentTitle}>Rental Agreement</Text>
                      <Text style={styles.documentSubtitle}>
                        {member.rentalDoc ? 'Uploaded • Stay Contract' : 'Not Uploaded'}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: member.rentalDoc ? '#EDE9FE' : '#F1F5F9' }]}>
                    <Text style={[styles.statusText, { color: member.rentalDoc ? '#8B5CF6' : colors.textTertiary }]}>
                      {member.rentalDoc ? 'View' : 'Pending'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </Animated.View>
          </ScrollView>

          {/* Transfer Room Modal */}
          <Modal
            visible={showTransferModal}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCloseTransferModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>

                {/* Modal Header */}
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>
                    {transferStep === 1 && 'Select New Room'}
                    {transferStep === 2 && 'Review Transfer Details'}
                    {transferStep === 3 && 'Transfer Complete'}
                  </Text>
                  {transferStep !== 3 && (
                    <TouchableOpacity onPress={handleCloseTransferModal}>
                      <X color={colors.textSecondary} size={24} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Step 1: Select Room */}
                {transferStep === 1 && (
                  <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                    {availableRooms.length === 0 ? (
                      <View style={{ padding: spacing.xl, alignItems: 'center' }}>
                        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>No rooms found in hostel</Text>
                      </View>
                    ) : (
                      availableRooms.map(room => {
                        const isDisabled = room.isCurrent || room.isFull;
                        return (
                          <TouchableOpacity
                            key={room.id}
                            disabled={isDisabled}
                            style={[
                              styles.roomSelectCard,
                              selectedNewRoom?.id === room.id && styles.roomSelectCardActive,
                              isDisabled && styles.roomSelectCardDisabled,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => setSelectedNewRoom(room)}>
                            <View style={[styles.roomSelectIcon, isDisabled && { backgroundColor: '#F1F5F9' }]}>
                              <Home color={selectedNewRoom?.id === room.id ? colors.primary : colors.textSecondary} size={20} />
                            </View>
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={[
                                  styles.roomSelectTitle,
                                  selectedNewRoom?.id === room.id && { color: colors.primary },
                                  isDisabled && { color: colors.textTertiary }
                                ]}>
                                  Room {room.id}
                                </Text>
                                {room.isCurrent && (
                                  <View style={styles.badgeCurrent}>
                                    <Text style={styles.badgeCurrentText}>Current</Text>
                                  </View>
                                )}
                                {room.isFull && (
                                  <View style={styles.badgeFull}>
                                    <Text style={styles.badgeFullText}>Full</Text>
                                  </View>
                                )}
                              </View>
                              <Text style={styles.roomSelectSubtitle}>
                                {room.type} • Floor {room.floor} • {room.occupants}/{room.capacity} beds
                              </Text>
                            </View>
                            <Text style={[styles.roomSelectRent, isDisabled && { color: colors.textTertiary }]}>
                              ₹{room.rent}/mo
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </ScrollView>
                )}

                {/* Step 2: Review Math */}
                {transferStep === 2 && selectedNewRoom && (
                  <View style={styles.reviewContainer}>
                    <View style={styles.transferPathRow}>
                      <View style={styles.transferNode}>
                        <Text style={styles.nodeTitle}>Current</Text>
                        <Text style={styles.nodeRoom}>Room {member.room}</Text>
                        <Text style={styles.nodeRent}>₹{currentRent}/mo</Text>
                      </View>
                      <ArrowRight color={colors.textTertiary} size={24} />
                      <View style={styles.transferNode}>
                        <Text style={styles.nodeTitle}>New</Text>
                        <Text style={styles.nodeRoom}>Room {selectedNewRoom.id}</Text>
                        <Text style={styles.nodeRent}>₹{selectedNewRoom.rent}/mo</Text>
                      </View>
                    </View>

                    <View style={styles.mathCard}>
                      <View style={styles.mathRow}>
                        <Text style={styles.mathLabel}>Days Remaining</Text>
                        <Text style={styles.mathValue}>{daysRemaining} days</Text>
                      </View>
                      <View style={styles.mathRow}>
                        <Text style={styles.mathLabel}>Rent Difference</Text>
                        <Text style={styles.mathValue}>
                          {rentDifference > 0 ? '+' : ''}₹{rentDifference}/mo
                        </Text>
                      </View>
                      <View style={styles.mathDivider} />
                      <View style={styles.mathRow}>
                        <Text style={styles.mathTotalLabel}>Prorated Amount</Text>
                        <Text style={[
                          styles.mathTotalValue,
                          { color: proratedDifference > 0 ? colors.warning : colors.success }
                        ]}>
                          {proratedDifference > 0 ? 'Pay ₹' : 'Refund ₹'}{Math.abs(proratedDifference)}
                        </Text>
                      </View>
                      <Text style={styles.mathHelpText}>
                        {proratedDifference > 0
                          ? 'Student needs to pay this amount for the remainder of the current month.'
                          : 'This amount will be credited to the student\'s ledger.'}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Step 3: Success */}
                {transferStep === 3 && (
                  <View style={styles.successContainer}>
                    <View style={styles.successIconBox}>
                      <CheckCircle2 color={colors.success} size={48} strokeWidth={2} />
                    </View>
                    <Text style={styles.successTitle}>Transfer Successful!</Text>
                    <Text style={styles.successSubtitle}>
                      {member.name} has been moved to Room {selectedNewRoom?.id}.
                    </Text>
                  </View>
                )}

                {/* Modal Footer Actions */}
                {transferStep === 1 && (
                  <TouchableOpacity
                    style={[styles.primaryBtn, !selectedNewRoom && styles.primaryBtnDisabled]}
                    disabled={!selectedNewRoom}
                    onPress={() => setTransferStep(2)}
                    activeOpacity={0.8}>
                    <Text style={styles.primaryBtnText}>Review Proration</Text>
                  </TouchableOpacity>
                )}

                {transferStep === 2 && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnOutline]}
                      onPress={() => setTransferStep(1)}
                      activeOpacity={0.8}>
                      <Text style={[styles.actionBtnText, { color: colors.primary }]}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={handleTransferComplete}
                      disabled={transferring}
                      activeOpacity={0.8}>
                      {transferring ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <Text style={styles.actionBtnText}>Confirm Transfer</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

              </View>
            </View>
          </Modal>
        </>
      )}
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
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 24,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  transferBtn: {
    backgroundColor: colors.infoBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  transferBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.info,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    paddingBottom: 40,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  roomSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    marginBottom: spacing.m,
  },
  roomSelectCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  roomSelectIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  roomSelectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  roomSelectSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  roomSelectRent: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  roomSelectCardDisabled: {
    opacity: 0.55,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  badgeCurrent: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.primaryBg,
  },
  badgeCurrentText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  badgeFull: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  badgeFullText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: spacing.l,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewContainer: {
    marginBottom: spacing.l,
  },
  transferPathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
  },
  transferNode: {
    alignItems: 'center',
  },
  nodeTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  nodeRoom: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  nodeRent: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mathCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: spacing.l,
  },
  mathRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  mathLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mathValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  mathDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.s,
    marginBottom: spacing.m,
  },
  mathTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  mathTotalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  mathHelpText: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.s,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  midJoinBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.s,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: spacing.m,
    marginVertical: spacing.s,
  },
  midJoinBannerIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  midJoinBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C2410C',
    marginBottom: 2,
  },
  midJoinBannerSub: {
    fontSize: 12,
    color: '#9A3412',
    lineHeight: 18,
  },
});

