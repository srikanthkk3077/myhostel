import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Share,
  Alert,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  Plus,
  User,
  Search,
  MapPin,
  ChevronRight,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  Download,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { getMembers, getRooms } from '../../../service/merchant';

const { width } = Dimensions.get('window');

export default function StudentsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'pending'>('all');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<string>('All');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, roomsRes] = await Promise.all([getMembers(), getRooms()]);
      if (membersRes.status === 200 && membersRes.data?.success) {
        // Map backend response to match expected frontend structure if needed
        const mappedStudents = (membersRes.data.data || []).map((m: any) => ({
          id: m._id,
          name: m.name,
          room: m.room,
          status: m.computedStatus || m.status,
          joinDate: m.joiningDate || '-',
          balance: m.computedBalance !== undefined ? m.computedBalance : (m.monthlyRent - (m.securityDeposit || 0)),
        }));
        setStudents(mappedStudents);
      }
      if (roomsRes.status === 200 && roomsRes.data?.success) {
        setRooms(roomsRes.data.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const blobY = blobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const roomToFloorMap = rooms.reduce((acc, room) => {
    acc[room.roomNumber] = String(room.floor);
    return acc;
  }, {} as Record<string, string>);

  const getStudentFloor = (studentRoom: string) => {
    if (!studentRoom || studentRoom === 'Unassigned') return 'Unassigned';
    return roomToFloorMap[studentRoom] || 'Unknown';
  };

  const availableFloors = Array.from(new Set(students.map(s => getStudentFloor(s.room)))).sort((a, b) => {
    if (a === 'Unassigned' || a === 'Unknown') return 1;
    if (b === 'Unassigned' || b === 'Unknown') return -1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const availableRooms = Array.from(new Set(students.filter(s => {
      const floor = getStudentFloor(s.room);
      return selectedFloorFilter === 'All' || floor === selectedFloorFilter;
  }).map(s => s.room || 'Unassigned'))).sort((a, b) => {
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.room?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'active' && student.status === 'Active') ||
      (filterType === 'pending' && student.status === 'Pending Fee');
      
    const studentFloor = getStudentFloor(student.room);
    const matchesFloor = selectedFloorFilter === 'All' || studentFloor === selectedFloorFilter;
    const matchesRoom = selectedRoomFilter === 'All' || (student.room || 'Unassigned') === selectedRoomFilter;
    
    return matchesSearch && matchesFilter && matchesFloor && matchesRoom;
  });

  const hasActiveFilters = searchQuery !== '' || filterType !== 'all' || selectedFloorFilter !== 'All' || selectedRoomFilter !== 'All';

  const groupedStudents = filteredStudents.reduce((acc, student) => {
    const room = student.room || 'Unassigned';
    if (!acc[room]) {
      acc[room] = [];
    }
    acc[room].push(student);
    return acc;
  }, {} as Record<string, typeof students>);

  const sortedRooms = Object.keys(groupedStudents).sort((a, b) => {
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleExport = async () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    
    // Generate CSV string
    const header = "ID,Name,Room,Status,Join Date,Balance\n";
    const rows = filteredStudents.map(s => `${s.id},${s.name},${s.room},${s.status},${s.joinDate},${s.balance}`).join('\n');
    const csvContent = header + rows;
    
    try {
      await Share.share({
        message: csvContent,
        title: 'Export_Students.csv',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderSkeletonCard = (key: number) => (
    <View key={`skeleton-${key}`} style={styles.studentCard}>
      <View style={styles.cardContent}>
        <View style={[styles.avatar, { backgroundColor: '#E2E8F0', overflow: 'hidden' }]}>
           <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.4)', transform: [{ translateX: shimmerTranslate }] }]} />
        </View>
        <View style={styles.infoSection}>
          <View style={{ width: '60%', height: 16, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 8, overflow: 'hidden' }}>
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.4)', transform: [{ translateX: shimmerTranslate }] }]} />
          </View>
          <View style={{ width: '40%', height: 12, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.4)', transform: [{ translateX: shimmerTranslate }] }]} />
          </View>
        </View>
        <View style={{ width: 40, height: 16, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.4)', transform: [{ translateX: shimmerTranslate }] }]} />
        </View>
      </View>
    </View>
  );

  const renderStudentCard = (student: typeof students[0], index: number) => {
    const isActive = student.status === 'Active';

    return (
      <TouchableOpacity
        key={student.id}
        style={styles.studentCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('StudentDetails', { id: student.id })}>
        <View style={styles.cardContent}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: isActive ? colors.primaryBg : colors.warningBg },
              ]}>
              <Text
                style={[
                  styles.avatarText,
                  { color: isActive ? colors.primary : colors.warning },
                ]}>
                {getInitials(student.name)}
              </Text>
            </View>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: isActive ? colors.success : colors.warning },
              ]}
            />
          </View>

          {/* Info */}
          <View style={styles.infoSection}>
            <Text style={styles.studentName}>{student.name}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MapPin color={colors.textTertiary} size={12} strokeWidth={2.5} />
                <Text style={styles.metaText}>Room {student.room}</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Clock color={colors.textTertiary} size={12} strokeWidth={2.5} />
                <Text style={styles.metaText}>{student.joinDate}</Text>
              </View>
            </View>
          </View>

          {/* Action / Status */}
          <View style={styles.actionSection}>
            {student.balance > 0 ? (
              <View style={styles.balanceBadge}>
                <IndianRupee color={colors.danger} size={10} strokeWidth={3} />
                <Text style={styles.balanceText}>{student.balance}</Text>
              </View>
            ) : (
              <View style={styles.activeBadge}>
                <CheckCircle2 color={colors.success} size={16} strokeWidth={2.5} />
              </View>
            )}
            <ChevronRight color={colors.border} size={20} strokeWidth={2.5} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Header Background */}
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
            <View style={styles.headerTitleRow}>
              <Text style={styles.title}>Members 👨‍🎓</Text>
            </View>
            <View style={styles.topBarActions}>
              <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7} onPress={handleExport}>
                <Download color="#16A34A" size={20} strokeWidth={2.2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7} onPress={() => setFilterModalVisible(true)}>
                <Filter color="#16A34A" size={20} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Overview Card */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <View>
                <Text style={styles.overviewLabel}>Total Members</Text>
                <Text style={styles.overviewValue}>{students.length}</Text>
              </View>
              <View style={styles.overviewIconBox}>
                <Users color={colors.primary} size={26} strokeWidth={2.5} />
              </View>
            </View>
            <View style={styles.overviewFooter}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>
                  {students.filter((s) => s.status === 'Active').length}
                </Text>
                <Text style={styles.overviewStatLabel}>Active</Text>
              </View>
              <View style={styles.overviewStatDivider} />
              <View style={styles.overviewStat}>
                <Text style={[styles.overviewStatValue, { color: colors.warning }]}>
                  {students.filter((s) => s.status === 'Pending Fee').length}
                </Text>
                <Text style={styles.overviewStatLabel}>Pending Fees</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color={colors.textSecondary} size={18} strokeWidth={2.2} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or room..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Section Title */}
          <View style={styles.listHeader}>
            <Text style={styles.listCountTitle}>
              {filteredStudents.length} Member{filteredStudents.length !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              disabled={!hasActiveFilters}
              onPress={() => {
                setSearchQuery('');
                setFilterType('all');
                setSelectedFloorFilter('All');
                setSelectedRoomFilter('All');
              }}
              style={{ opacity: hasActiveFilters ? 1 : 0.4 }}
            >
              <Text style={{color: colors.primary, fontWeight: '600', fontSize: 13}}>Clear Filters</Text>
            </TouchableOpacity>
          </View>

          {/* Students List */}
          {loading 
            ? [1, 2, 3, 4, 5].map(k => renderSkeletonCard(k))
            : sortedRooms.map(room => (
                <View key={room} style={styles.roomGroupContainer}>
                  <View style={styles.roomHeaderContainer}>
                    <Text style={styles.roomHeaderText}>{room === 'Unassigned' ? room : `Room ${room}`}</Text>
                    <View style={styles.roomHeaderLine} />
                  </View>
                  {groupedStudents[room].map((student, idx) => renderStudentCard(student, idx))}
                </View>
              ))
          }

          {/* Empty space for FAB */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Members</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
              
              <Text style={styles.filterSectionTitle}>Status</Text>
              <View style={styles.modalFilterRow}>
                {[{ id: 'all', label: 'All Members' }, { id: 'active', label: 'Active' }, { id: 'pending', label: 'Pending Fee' }].map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[styles.filterPill, filterType === filter.id && styles.filterPillActive]}
                    activeOpacity={0.7}
                    onPress={() => setFilterType(filter.id as any)}>
                    <Text style={[styles.filterPillText, filterType === filter.id && styles.filterPillTextActive]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {availableFloors.length > 0 && availableFloors.some(f => f !== 'Unassigned' && f !== 'Unknown') && (
                <>
                  <Text style={styles.filterSectionTitle}>Floor</Text>
                  <View style={styles.modalFilterRow}>
                    {['All', ...availableFloors].map((floor) => (
                      <TouchableOpacity
                        key={floor}
                        style={[styles.filterPill, selectedFloorFilter === floor && styles.filterPillActive]}
                        activeOpacity={0.7}
                        onPress={() => {
                          setSelectedFloorFilter(floor);
                          setSelectedRoomFilter('All');
                        }}>
                        <Text style={[styles.filterPillText, selectedFloorFilter === floor && styles.filterPillTextActive]}>
                          {floor === 'All' ? 'All Floors' : (floor === 'Unassigned' || floor === 'Unknown' ? floor : `Floor ${floor}`)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {availableRooms.length > 0 && (
                <>
                  <Text style={styles.filterSectionTitle}>Room</Text>
                  <View style={styles.modalFilterRow}>
                    {['All', ...availableRooms].map((room) => (
                      <TouchableOpacity
                        key={room}
                        style={[styles.filterPill, selectedRoomFilter === room && styles.filterPillActive]}
                        activeOpacity={0.7}
                        onPress={() => setSelectedRoomFilter(room)}>
                        <Text style={[styles.filterPillText, selectedRoomFilter === room && styles.filterPillTextActive]}>
                          {room === 'All' ? 'All Rooms' : (room === 'Unassigned' ? room : `Room ${room}`)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
            
            <TouchableOpacity style={styles.applyFilterButton} activeOpacity={0.8} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.applyFilterButtonText}>Show Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('RegisterStudent')}>
        <Plus color="#FFF" size={28} strokeWidth={3} />
      </TouchableOpacity>
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
    top: 100,
    left: -60,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    paddingTop: spacing.s,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  titleLabel: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerIconButton: {
    width: 44,
    height: 44,
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
  overviewValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
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
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  studentCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: spacing.m,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  infoSection: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: 6,
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 2,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  activeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.successBg,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  listHeader: {
    marginTop: spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.s,
  },
  listCountTitle:{
    color: colors.textSecondary,
    fontWeight: '500',
  },
  roomGroupContainer: {
    marginBottom: spacing.m,
  },
  roomHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
    marginTop: spacing.xs,
  },
  roomHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roomHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.m,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.l,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalScrollContent: {
    paddingBottom: spacing.xl,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.m,
  },
  modalFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  applyFilterButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: spacing.s,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyFilterButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
