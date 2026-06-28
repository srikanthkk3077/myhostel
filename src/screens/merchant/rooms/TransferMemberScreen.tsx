import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Snowflake,
  Wind,
  Users,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getRooms, transferMember } from '../../../service/merchant';

export default function TransferMemberScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { member, currentRoom } = route.params;
  // member = { _id, name, bed }
  // currentRoom = { id (roomNumber), _id }

  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const res = await getRooms();
      if (res.status === 200 && res.data?.success) {
        // Only show rooms that have available beds (capacity > occupants) and are NOT the current room
        const available = (res.data.data || [])
          .filter((r: any) => {
            const isCurrentRoom = String(r.roomNumber) === String(currentRoom.id);
            const hasSpace = (r.roomCapacity || 0) > (r.members?.length || 0);
            return !isCurrentRoom && hasSpace;
          })
          .map((r: any) => ({
            _id: r._id,
            roomNumber: String(r.roomNumber),
            type: r.roomType || 'Standard',
            isAC: r.roomType?.toLowerCase().includes('ac') && !r.roomType?.toLowerCase().includes('non-ac'),
            capacity: r.roomCapacity || 2,
            occupants: r.members?.length || 0,
            floor: Number(r.floor) || 1,
            price: r.pricePerMonth || 0,
          }));
        setRooms(available);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  const handleTransfer = async () => {
    if (!selectedRoomId) return;

    const selectedRoom = rooms.find((r) => r._id === selectedRoomId);
    if (!selectedRoom) return;

    Alert.alert(
      'Confirm Transfer',
      `Transfer ${member.name} from Room ${currentRoom.id} to Room ${selectedRoom.roomNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Transfer',
          onPress: async () => {
            setIsTransferring(true);
            try {
              const res = await transferMember(member._id, selectedRoom.roomNumber);
              if (res.status === 200 && res.data?.success) {
                Alert.alert(
                  '✅ Transferred',
                  `${member.name} has been successfully moved to Room ${selectedRoom.roomNumber}.`,
                  [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
              } else {
                Alert.alert('Failed', res.data?.message || 'Could not transfer member');
              }
            } catch (error: any) {
              const msg = error?.response?.data?.message || error?.message || 'Something went wrong';
              Alert.alert('Error', msg);
            } finally {
              setIsTransferring(false);
            }
          },
        },
      ]
    );
  };

  const selectedRoom = rooms.find((r) => r._id === selectedRoomId);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Transfer Member</Text>
            <Text style={styles.headerSubtitle}>{member.name} · Room {currentRoom.id}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Member info banner */}
      <View style={styles.memberBanner}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>
            {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </Text>
        </View>
        <View>
          <Text style={styles.memberBannerName}>{member.name}</Text>
          <Text style={styles.memberBannerSub}>Currently in Room {currentRoom.id} · {member.bed || 'Unassigned Bed'}</Text>
        </View>
        <ArrowRight color={colors.primary} size={20} strokeWidth={2.5} style={{ marginLeft: 'auto' }} />
        <View style={styles.destinationPlaceholder}>
          <Text style={styles.destinationText}>{selectedRoom ? `Room ${selectedRoom.roomNumber}` : '?'}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Select Destination Room</Text>

      {isLoading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading available rooms...</Text>
        </View>
      ) : rooms.length === 0 ? (
        <View style={styles.centerLoader}>
          <BedDouble color={colors.textTertiary} size={40} strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No Rooms Available</Text>
          <Text style={styles.emptySubtitle}>All other rooms are full. Add a new room or free up space first.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {rooms.map((room) => {
            const isSelected = selectedRoomId === room._id;
            const vacant = room.capacity - room.occupants;
            return (
              <TouchableOpacity
                key={room._id}
                style={[styles.roomCard, isSelected && styles.roomCardActive]}
                activeOpacity={0.85}
                onPress={() => setSelectedRoomId(isSelected ? null : room._id)}>
                <View style={[styles.roomIcon, { backgroundColor: isSelected ? colors.primary : (room.isAC ? colors.primaryBg : colors.warningBg) }]}>
                  {room.isAC
                    ? <Snowflake color={isSelected ? '#FFF' : colors.primary} size={20} strokeWidth={2.5} />
                    : <Wind color={isSelected ? '#FFF' : colors.warning} size={20} strokeWidth={2.5} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.roomNumber, isSelected && { color: colors.primary }]}>
                    Room {room.roomNumber}
                  </Text>
                  <Text style={styles.roomMeta}>{room.type} · Floor {room.floor} · ₹{room.price}/mo</Text>
                </View>
                <View style={styles.roomStats}>
                  <Users color={colors.textTertiary} size={13} strokeWidth={2.5} />
                  <Text style={styles.roomStatsText}>{room.occupants}/{room.capacity}</Text>
                </View>
                <View style={[styles.vacantBadge, { backgroundColor: isSelected ? '#FFFFFF33' : colors.successBg }]}>
                  <BedDouble color={isSelected ? '#FFFFFF' : colors.success} size={12} strokeWidth={2.5} />
                  <Text style={[styles.vacantText, isSelected && { color: '#FFFFFF' }]}>{vacant} free</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}

      {/* Bottom sticky confirm button */}
      {selectedRoomId && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.transferButton}
            activeOpacity={0.85}
            onPress={handleTransfer}
            disabled={isTransferring}>
            {isTransferring ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <ArrowRight color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.transferButtonText}>
                  Transfer to Room {selectedRoom?.roomNumber}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  memberBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    margin: spacing.l,
    borderRadius: 18,
    padding: spacing.m,
    gap: spacing.m,
    borderWidth: 1,
    borderColor: colors.primary + '33',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  memberBannerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  memberBannerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  destinationPlaceholder: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  destinationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.m,
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.m,
    gap: spacing.m,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  roomCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roomIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  roomMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  roomStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  roomStatsText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  vacantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  vacantText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  transferButton: {
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
  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
