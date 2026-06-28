import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  BedDouble,
  User,
  Snowflake,
  Wind,
  Users,
  MoreVertical,
  Phone,
  Calendar,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { deleteRoom, getRoomById } from '../../../service/merchant';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function RoomDetailsScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const initialRoom = route.params.room;

  // Live room state — starts from route params, refreshed on focus
  const [room, setRoom] = useState<any>(initialRoom);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRoom = async () => {
    if (!initialRoom._id) return;
    try {
      setIsRefreshing(true);
      const res = await getRoomById(initialRoom._id);
      if (res.status === 200 && res.data?.success) {
        const r = res.data.data;
        const assignedMembers = r.members || [];
        const mappedBeds: any[] = [];

        assignedMembers.forEach((m: any) => {
          let bedId = m.bed || '';
          if (bedId.startsWith('Bed ')) {
            bedId = bedId.replace('Bed ', '');
          }
          mappedBeds.push({
            id: bedId || String(mappedBeds.length + 1),
            status: 'Occupied',
            student: m.name,
            memberId: m._id,
          });
        });

        const capacity = r.roomCapacity || 2;
        let nextVacantId = 1;
        while (mappedBeds.length < capacity) {
          while (mappedBeds.some((b: any) => String(b.id) === String(nextVacantId))) {
            nextVacantId++;
          }
          mappedBeds.push({ id: String(nextVacantId), status: 'Vacant' });
          nextVacantId++;
        }

        mappedBeds.sort((a: any, b: any) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));

        setRoom({
          _id: r._id,
          id: String(r.roomNumber),
          type: r.roomType || 'Standard',
          isAC: r.roomType?.toLowerCase().includes('ac') && !r.roomType?.toLowerCase().includes('non-ac'),
          capacity: r.roomCapacity || 2,
          occupants: r.occupants || 0,
          floor: Number(r.floor) || 1,
          price: r.pricePerMonth || 0,
          beds: mappedBeds,
        });
      }
    } catch (e) {
      console.log('Error refreshing room:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoom();
    }, [])
  );

  const isFull = room.occupants >= room.capacity;
  const isOverCapacity = room.occupants > room.capacity;
  const vacant = Math.max(0, room.capacity - room.occupants);
  const progressPercentage = Math.min(100, (room.occupants / room.capacity) * 100);
  const progressColor = isFull ? colors.danger : room.occupants >= room.capacity * 0.7 ? colors.warning : colors.success;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(blobAnim, { toValue: 0, duration: 5000, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const blobY = blobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const handleDelete = () => {
    if (!room._id) {
      Alert.alert('Error', 'Room ID is missing. Please refresh the rooms list.');
      return;
    }

    Alert.alert(
      'Delete Room',
      `Are you sure you want to delete Room ${room.id}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
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
            }
          },
        },
      ],
    );
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Animated Header */}
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      >
        <Animated.View
          style={[styles.blob, styles.blob1, { transform: [{ translateY: blobY }] }]}
        />
        <Animated.View
          style={[styles.blob, styles.blob2, { transform: [{ translateY: blobY }] }]}
        />
      </LinearGradient>



      <ScrollView
        style={{ flex: 1, marginTop: insets.top }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}>
              <ArrowLeft color="#16A34A" size={20} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Room Details</Text>
            <View style={styles.topBarActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('EditRoom', { room })}
                activeOpacity={0.7}>
                <Edit2 color="#16A34A" size={18} strokeWidth={2.2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
                <Trash2 color="#16A34A" size={18} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.heroIconBox}>
                {room.isAC ? (
                  <Snowflake color="#FFFFFF" size={32} strokeWidth={2.5} />
                ) : (
                  <Wind color="#FFFFFF" size={32} strokeWidth={2.5} />
                )}
              </View>
              <View style={styles.heroInfo}>
                <Text style={styles.heroLabel}>Room Number</Text>
                <Text style={styles.heroTitle}>{room.id}</Text>
                <Text style={styles.heroSubtitle}>{room.type}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: isFull ? colors.dangerBg : colors.successBg },
                ]}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isFull ? colors.danger : colors.success },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: isFull ? colors.danger : colors.success },
                  ]}>
                  {isFull ? (room.occupants > room.capacity ? 'Over capacity' : 'Full') : `${vacant} Free`}
                </Text>
              </View>
            </View>

            {/* Quick Info Pills */}
            <View style={styles.infoPillsRow}>
              <View style={styles.infoPill}>
                <Users color="#FFFFFF" size={14} strokeWidth={2.5} />
                <Text style={styles.infoPillText}>Floor {room.floor || 1}</Text>
              </View>
              <View style={styles.infoPill}>
                <IndianRupee color="#FFFFFF" size={14} strokeWidth={2.5} />
                <Text style={styles.infoPillText}>₹{room.price || 10000}/mo</Text>
              </View>
              <View style={styles.infoPill}>
                <BedDouble color="#FFFFFF" size={14} strokeWidth={2.5} />
                <Text style={styles.infoPillText}>{room.capacity} Beds</Text>
              </View>
            </View>
          </View>

          {/* Over-capacity warning banner */}
          {isOverCapacity && (
            <View style={styles.overCapacityBanner}>
              <AlertTriangle color="#B45309" size={20} strokeWidth={2.5} />
              <View style={{ flex: 1 }}>
                <Text style={styles.overCapacityTitle}>Room is Over Capacity!</Text>
                <Text style={styles.overCapacityMsg}>
                  {room.occupants - room.capacity} member(s) must be transferred to another room.
                </Text>
              </View>
            </View>
          )}

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsCardTitle}>Room Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: colors.primaryBg }]}>
                  <Users color={colors.primary} size={18} strokeWidth={2.5} />
                </View>
                <Text style={styles.statValue}>{room.capacity}</Text>
                <Text style={styles.statLabel}>Capacity</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: colors.warningBg }]}>
                  <User color={colors.warning} size={18} strokeWidth={2.5} />
                </View>
                <Text style={styles.statValue}>{room.occupants}</Text>
                <Text style={styles.statLabel}>Occupied</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: colors.successBg }]}>
                  <BedDouble color={colors.success} size={18} strokeWidth={2.5} />
                </View>
                <Text style={styles.statValue}>{vacant}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Occupancy</Text>
                <Text style={[styles.progressValue, { color: progressColor }]}>
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercentage}%`, backgroundColor: progressColor },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Beds List */}
          <View style={styles.bedsSection}>
            <View style={styles.bedsHeader}>
              <Text style={styles.bedsTitle}>Bed Assignments</Text>
              <TouchableOpacity
                onPress={() => {
                  // Find the first available bed
                  const firstVacant = room.beds.find((b: any) => b.status !== 'Occupied');
                  const bedId = firstVacant ? `Bed ${firstVacant.id}` : `Bed 1`;
                  navigation.navigate('AssignMember', { room, bedId });
                }}>
                <Text style={styles.seeAllText}>Manage</Text>
              </TouchableOpacity>
            </View>

            {room.beds.map((bed: any, index: number) => {
              const isOccupied = bed.status === 'Occupied';
              // A bed is "over capacity" if its index is >= the room's capacity
              const isExtraBed = index >= room.capacity;
              return (
                <View key={`${bed.id}-${index}`} style={[
                  styles.bedCard,
                  isExtraBed && styles.bedCardOverCapacity,
                ]}>
                  <View style={styles.bedCardLeft}>
                    <View
                      style={[
                        styles.bedIcon,
                        {
                          backgroundColor: isExtraBed ? '#FEF3C7' : (isOccupied ? colors.primaryBg : colors.successBg),
                        },
                      ]}>
                      <BedDouble
                        color={isExtraBed ? '#B45309' : (isOccupied ? colors.primary : colors.success)}
                        size={22}
                        strokeWidth={2.5}
                      />
                    </View>
                    <View>
                      <Text style={styles.bedName}>Bed {bed.id}</Text>
                      <Text style={[styles.bedType, isExtraBed && { color: '#B45309' }]}>
                        {isExtraBed ? '⚠️ Must Transfer' : (isOccupied ? 'Occupied' : 'Available')}
                      </Text>
                    </View>
                  </View>

                  {isOccupied ? (
                    isExtraBed ? (
                      // Show Transfer button for over-capacity occupied beds
                      <TouchableOpacity
                        style={styles.transferButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('TransferMember', {
                          member: { _id: bed.memberId, name: bed.student, bed: `Bed ${bed.id}` },
                          currentRoom: room,
                        })}>
                        <ArrowRight color="#B45309" size={14} strokeWidth={2.5} />
                        <Text style={styles.transferButtonText}>Transfer</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.occupantSection}
                        activeOpacity={0.7}
                        onPress={() => {
                          if (bed.memberId) {
                            navigation.navigate('StudentDetails', { memberId: bed.memberId });
                          }
                        }}>
                        <View style={styles.occupantAvatar}>
                          <Text style={styles.occupantInitials}>
                            {getInitials(bed.student)}
                          </Text>
                        </View>
                        <View style={styles.occupantInfo}>
                          <Text style={styles.occupantName}>{bed.student}</Text>
                          <View style={styles.occupantMeta}>
                            <Calendar color={colors.textTertiary} size={11} strokeWidth={2.2} />
                            <Text style={styles.occupantMetaText}>Since Jan 2026</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity
                      style={styles.assignButton}
                      onPress={() => navigation.navigate('AssignMember', { room, bedId: `Bed ${bed.id}` })}
                      activeOpacity={0.8}>
                      <User color={colors.primary} size={14} strokeWidth={2.5} />
                      <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('AssignMember', { room, bedId: 'Next' })}
                activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: colors.primaryBg }]}>
                  <User color={colors.primary} size={20} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionLabel}>Assign{'\n'}Member</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('FeesTab', { screen: 'CollectFee' })}
                activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: colors.successBg }]}>
                  <IndianRupee color={colors.success} size={20} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionLabel}>Collect{'\n'}Rent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => navigation.navigate('RoomMembers', { room })}
                activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: colors.warningBg }]}>
                  <Phone color={colors.warning} size={20} strokeWidth={2.5} />
                </View>
                <Text style={styles.actionLabel}>Contact{'\n'}Members</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom space */}
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
  },
  blob1: {
    width: 260,
    height: 260,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: -120,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.4)',
    top: 60,
    left: -60,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  heroInfo: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoPillsRow: {
    flexDirection: 'row',
    gap: spacing.s,
    flexWrap: 'wrap',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.m,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: spacing.l,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  progressSection: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.m,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  bedsSection: {
    marginBottom: spacing.m,
  },
  bedsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
    paddingHorizontal: 2,
  },
  bedsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  bedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.m,
    marginBottom: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  bedCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  bedIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bedName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  bedType: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  occupantSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 8,
  },
  occupantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  occupantInitials: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  occupantInfo: {
    justifyContent: 'center',
  },
  occupantName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  occupantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  occupantMetaText: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  assignButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.m,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  overCapacityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: spacing.m,
    marginBottom: spacing.m,
    gap: spacing.m,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  overCapacityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  overCapacityMsg: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '500',
  },
  bedCardOverCapacity: {
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  transferButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
});
