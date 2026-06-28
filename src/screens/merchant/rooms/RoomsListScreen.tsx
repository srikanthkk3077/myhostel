import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import {
  Plus,
  Building2,
  Search,
  Filter,
  Snowflake,
  Wind,
  Users,
  ChevronRight,
  Home,
  TrendingUp,
  BedDouble,
  X,
  Check,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function RoomsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ac' | 'non-ac'>('all');

  // Advanced Filter States
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedCapacity, setSelectedCapacity] = useState<number | 'all'>('all');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(blobAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const blobY = blobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const rooms = [
    {
      id: '101',
      type: 'AC Single',
      isAC: true,
      capacity: 4,
      occupants: 2,
      floor: 1,
      price: 12000,
      beds: [
        { id: '1', status: 'Occupied', student: 'John Doe' },
        { id: '2', status: 'Occupied', student: 'Mike Smith' },
        { id: '3', status: 'Vacant' },
        { id: '4', status: 'Vacant' },
      ],
    },
    {
      id: '102',
      type: 'Non-AC Double',
      isAC: false,
      capacity: 2,
      occupants: 1,
      floor: 1,
      price: 8000,
      beds: [
        { id: '1', status: 'Occupied', student: 'Sarah Connor' },
        { id: '2', status: 'Vacant' },
      ],
    },
    {
      id: '103',
      type: 'AC Double',
      isAC: true,
      capacity: 2,
      occupants: 2,
      floor: 1,
      price: 10000,
      beds: [
        { id: '1', status: 'Occupied', student: 'Jane Smith' },
        { id: '2', status: 'Occupied', student: 'Emily Rose' },
      ],
    },
    {
      id: '201',
      type: 'AC Triple',
      isAC: true,
      capacity: 3,
      occupants: 2,
      floor: 2,
      price: 14000,
      beds: [
        { id: '1', status: 'Occupied', student: 'Alex Kumar' },
        { id: '2', status: 'Occupied', student: 'Priya Patel' },
        { id: '3', status: 'Vacant' },
      ],
    },
  ];

  const filteredRooms = rooms.filter((room) => {
    // 1. Search filter
    const matchesSearch = room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. AC/Non-AC filter
    const matchesAcType = filterType === 'all' ||
      (filterType === 'ac' && room.isAC) ||
      (filterType === 'non-ac' && !room.isAC);
      
    // 3. Floor filter
    const matchesFloor = selectedFloor === 'all' || room.floor === selectedFloor;
    
    // 4. Capacity / Sharing filter
    const matchesCapacity = selectedCapacity === 'all' || room.capacity === selectedCapacity;
    
    // 5. Availability filter
    const isAvailable = room.capacity - room.occupants > 0;
    const matchesAvailability = showOnlyAvailable ? isAvailable : true;

    return matchesSearch && matchesAcType && matchesFloor && matchesCapacity && matchesAvailability;
  });

  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = rooms.reduce((acc, r) => acc + r.occupants, 0);
  const occupancyRate = Math.round((totalOccupied / totalCapacity) * 100);

  const renderRoomCard = (room: any, index: number) => {
    const isFull = room.occupants === room.capacity;
    const vacant = room.capacity - room.occupants;
    const progressPercentage = (room.occupants / room.capacity) * 100;
    const progressColor = isFull ? colors.danger : room.occupants >= room.capacity * 0.7 ? colors.warning : colors.success;

    return (
      <TouchableOpacity
        key={room.id}
        style={styles.roomCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('RoomDetails', { room })}>
        <View style={styles.cardHeader}>
          <View style={styles.roomIdentity}>
            <View style={[
              styles.roomIconContainer,
              { backgroundColor: room.isAC ? colors.primaryBg : colors.warningBg }
            ]}>
              {room.isAC ? (
                <Snowflake color={colors.primary} size={22} strokeWidth={2.5} />
              ) : (
                <Wind color={colors.warning} size={22} strokeWidth={2.5} />
              )}
            </View>
            <View style={styles.roomInfo}>
              <View style={styles.roomNumberRow}>
                <Text style={styles.roomNumber}>Room {room.id}</Text>
                <View style={styles.floorBadge}>
                  <Text style={styles.floorText}>F{room.floor}</Text>
                </View>
              </View>
              <Text style={styles.roomType}>{room.type}</Text>
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isFull ? colors.dangerBg : colors.successBg }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isFull ? colors.danger : colors.success }
            ]} />
            <Text style={[
              styles.statusText,
              { color: isFull ? colors.danger : colors.success }
            ]}>
              {isFull ? 'Full' : `${vacant} Available`}
            </Text>
          </View>
        </View>

        {/* Bed Visualization */}
        <View style={styles.bedsContainer}>
          {room.beds.map((bed: any, idx: number) => {
            const occupied = bed.status === 'Occupied';
            return (
              <View
                key={bed.id}
                style={[
                  styles.bedSlot,
                  {
                    backgroundColor: occupied ? colors.primary : colors.background,
                    borderColor: occupied ? colors.primary : colors.border,
                  }
                ]}>
                <BedDouble
                  color={occupied ? '#FFFFFF' : colors.textTertiary}
                  size={14}
                  strokeWidth={2.5}
                />
              </View>
            );
          })}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Occupied</Text>
            <Text style={styles.statValue}>{room.occupants}/{room.capacity}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rent</Text>
            <Text style={styles.statValue}>₹{room.price / 1000}k</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={[
              styles.statValue,
              { color: progressColor }
            ]}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%`, backgroundColor: progressColor }
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent={false} />

      {/* Header Background */}
      <View style={styles.headerBackground}>
        <Animated.View
          style={[styles.blob, styles.blob1, { transform: [{ translateY: blobY }] }]}
        />
        <Animated.View
          style={[styles.blob, styles.blob2, { transform: [{ translateY: blobY }] }]}
        />
      </View>

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
            <View>
              <Text style={styles.titleLabel}>Manage Your</Text>
              <Text style={styles.title}>Rooms 🏠</Text>
            </View>
            <TouchableOpacity 
              style={styles.headerIconButton} 
              activeOpacity={0.7}
              onPress={() => setShowFilterModal(true)}>
              <Filter color="#FFFFFF" size={20} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Stats Overview Card */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <View>
                <Text style={styles.overviewLabel}>Occupancy Rate</Text>
                <View style={styles.overviewValueRow}>
                  <Text style={styles.overviewValue}>{occupancyRate}%</Text>
                  <View style={styles.trendChip}>
                    <TrendingUp color={colors.success} size={12} strokeWidth={2.5} />
                    <Text style={styles.trendText}>+5%</Text>
                  </View>
                </View>
              </View>
              <View style={styles.overviewIconBox}>
                <Home color={colors.primary} size={26} strokeWidth={2.5} />
              </View>
            </View>
            <View style={styles.overviewFooter}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>{rooms.length}</Text>
                <Text style={styles.overviewStatLabel}>Total Rooms</Text>
              </View>
              <View style={styles.overviewStatDivider} />
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>{totalOccupied}</Text>
                <Text style={styles.overviewStatLabel}>Occupied</Text>
              </View>
              <View style={styles.overviewStatDivider} />
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>{totalCapacity - totalOccupied}</Text>
                <Text style={styles.overviewStatLabel}>Vacant</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color={colors.textSecondary} size={18} strokeWidth={2.2} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search rooms by number or type..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            {[
              { id: 'all', label: 'All Rooms' },
              { id: 'ac', label: 'AC' },
              { id: 'non-ac', label: 'Non-AC' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterPill,
                  filterType === filter.id && styles.filterPillActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setFilterType(filter.id as any)}>
                <Text style={[
                  styles.filterPillText,
                  filterType === filter.id && styles.filterPillTextActive,
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredRooms.length} Room{filteredRooms.length !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.sectionSubtitle}>Tap to view details</Text>
          </View>

          {/* Rooms List */}
          {filteredRooms.map((room, idx) => renderRoomCard(room, idx))}

          {/* Empty space for FAB */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AddRoom')}>
        <Plus color="#FFFFFF" size={28} strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Advanced Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Rooms</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)} style={styles.modalCloseBtn}>
                <X color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              
              {/* Availability Toggle */}
              <TouchableOpacity 
                style={[styles.availabilityToggle, showOnlyAvailable && styles.availabilityToggleActive]}
                activeOpacity={0.8}
                onPress={() => setShowOnlyAvailable(!showOnlyAvailable)}>
                <View style={[styles.availabilityDot, showOnlyAvailable && { backgroundColor: colors.success }]} />
                <Text style={[styles.availabilityText, showOnlyAvailable && { color: colors.success }]}>
                  Show only rooms with empty beds
                </Text>
                {showOnlyAvailable && <Check color={colors.success} size={18} style={{ marginLeft: 'auto' }} />}
              </TouchableOpacity>

              {/* Floor Selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Floor</Text>
                <View style={styles.filterPillsGrid}>
                  {['all', 1, 2, 3].map((floor) => {
                    const isActive = selectedFloor === floor;
                    return (
                      <TouchableOpacity
                        key={floor}
                        style={[styles.advFilterPill, isActive && styles.advFilterPillActive]}
                        activeOpacity={0.8}
                        onPress={() => setSelectedFloor(floor as any)}>
                        <Text style={[styles.advFilterText, isActive && styles.advFilterTextActive]}>
                          {floor === 'all' ? 'Any Floor' : `Floor ${floor}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Sharing/Capacity Selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sharing Type</Text>
                <View style={styles.filterPillsGrid}>
                  {['all', 1, 2, 3, 4].map((cap) => {
                    const isActive = selectedCapacity === cap;
                    const labels: any = { 'all': 'Any', 1: 'Single', 2: 'Double', 3: 'Triple', 4: 'Quad' };
                    return (
                      <TouchableOpacity
                        key={cap}
                        style={[styles.advFilterPill, isActive && styles.advFilterPillActive]}
                        activeOpacity={0.8}
                        onPress={() => setSelectedCapacity(cap as any)}>
                        <Text style={[styles.advFilterText, isActive && styles.advFilterTextActive]}>
                          {labels[cap]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.resetBtn} 
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedFloor('all');
                  setSelectedCapacity('all');
                  setShowOnlyAvailable(false);
                }}>
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyBtn} 
                activeOpacity={0.8}
                onPress={() => setShowFilterModal(false)}>
                <Text style={styles.applyBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

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
    height: 260,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.2,
  },
  blob1: {
    width: 260,
    height: 260,
    backgroundColor: colors.primaryLight,
    top: -120,
    right: -80,
  },
  blob2: {
    width: 200,
    height: 200,
    backgroundColor: colors.secondary,
    top: 100,
    left: -60,
    opacity: 0.15,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    paddingTop: spacing.s,
  },
  titleLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.l,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.l,
  },
  overviewLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  overviewValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  overviewValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 2,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  overviewIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewFooter: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.m,
  },
  overviewStat: {
    flex: 1,
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  overviewStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  overviewStatDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.s,
    marginBottom: spacing.l,
    paddingRight: spacing.l,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.m,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  roomCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  roomIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    flex: 1,
  },
  roomIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomInfo: {
    flex: 1,
  },
  roomNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  floorBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  floorText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  roomType: {
    fontSize: 13,
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
  bedsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.m,
  },
  bedSlot: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: spacing.m,
    marginBottom: spacing.s,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.s,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.l,
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    padding: spacing.xl,
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: 16,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  availabilityToggleActive: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  availabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.textTertiary,
    marginRight: spacing.m,
  },
  availabilityText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  filterSection: {
    marginBottom: spacing.xl,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.m,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
  },
  advFilterPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  advFilterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  advFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  advFilterTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFFFFF',
    gap: spacing.m,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
