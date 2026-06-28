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
} from 'react-native';
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
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function StudentsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'pending'>('all');

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

  const students = [
    {
      id: '1',
      name: 'John Doe',
      room: '101',
      status: 'Active',
      joinDate: '12 Jan 2026',
      balance: 0,
    },
    {
      id: '2',
      name: 'Michael Smith',
      room: '102',
      status: 'Active',
      joinDate: '05 Feb 2026',
      balance: 0,
    },
    {
      id: '3',
      name: 'David Wilson',
      room: '103',
      status: 'Pending Fee',
      joinDate: '10 Mar 2026',
      balance: 4500,
    },
    {
      id: '4',
      name: 'Sarah Connor',
      room: '104',
      status: 'Active',
      joinDate: '15 Mar 2026',
      balance: 0,
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'active' && student.status === 'Active') ||
      (filterType === 'pending' && student.status === 'Pending Fee');
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

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
            <View style={styles.headerTitleRow}>
              <Text style={styles.title}>Members 👨‍🎓</Text>
            </View>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
              <Filter color="#FFFFFF" size={20} strokeWidth={2.2} />
            </TouchableOpacity>
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

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            {[
              { id: 'all', label: 'All Members' },
              { id: 'active', label: 'Active' },
              { id: 'pending', label: 'Pending Fee' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterPill,
                  filterType === filter.id && styles.filterPillActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setFilterType(filter.id as any)}>
                <Text
                  style={[
                    styles.filterPillText,
                    filterType === filter.id && styles.filterPillTextActive,
                  ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Section Title */}
          <View style={styles.listHeader}>
            <Text style={styles.listCountTitle}>
              {filteredStudents.length} Member{filteredStudents.length !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.sectionSubtitle}>Tap to view profile</Text>
          </View>

          {/* Students List */}
          {filteredStudents.map((student, idx) => renderStudentCard(student, idx))}

          {/* Empty space for FAB */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('RegisterStudent')}>
        <Plus color="#FFFFFF" size={28} strokeWidth={2.5} />
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
    paddingBottom: 40,
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
  }
});
