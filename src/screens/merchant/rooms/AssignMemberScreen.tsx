import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  User,
  MapPin,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AssignMemberScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { room, bedId } = route.params || { room: { id: '101' }, bedId: 'A' };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Unassigned members — would come from your backend
  const unassignedMembers = [
    { id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210', joinDate: '10 Mar 2026', balance: 0 },
    { id: '2', name: 'Amit Verma', phone: '+91 91234 56789', joinDate: '15 Feb 2026', balance: 1500 },
    { id: '3', name: 'Priya Patel', phone: '+91 87654 32109', joinDate: '01 Jan 2026', balance: 0 },
    { id: '4', name: 'Sunita Kumari', phone: '+91 77654 21098', joinDate: '20 Apr 2026', balance: 3000 },
  ];

  const filtered = unassignedMembers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleAssign = () => {
    if (!selectedMember) return;
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Assign Member</Text>
            <Text style={styles.headerSubtitle}>Room {room.id} • Bed {bedId}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.textSecondary} size={18} strokeWidth={2.2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search unassigned members..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {filtered.length} Available Member{filtered.length !== 1 ? 's' : ''}
        </Text>
        {filtered.map((member) => {
          const isSelected = selectedMember === member.id;
          return (
            <TouchableOpacity
              key={member.id}
              style={[styles.memberCard, isSelected && styles.memberCardActive]}
              activeOpacity={0.85}
              onPress={() => setSelectedMember(isSelected ? null : member.id)}>
              <View style={styles.cardLeft}>
                <View style={[styles.avatar, { backgroundColor: isSelected ? colors.primary : colors.primaryBg }]}>
                  <Text style={[styles.avatarText, { color: isSelected ? '#FFFFFF' : colors.primary }]}>
                    {getInitials(member.name)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View style={styles.metaRow}>
                    <MapPin color={colors.textTertiary} size={11} strokeWidth={2.5} />
                    <Text style={styles.metaText}>Unassigned</Text>
                    {member.balance > 0 && (
                      <>
                        <View style={styles.metaDot} />
                        <IndianRupee color={colors.danger} size={10} strokeWidth={3} />
                        <Text style={[styles.metaText, { color: colors.danger }]}>
                          ₹{member.balance} due
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
              {isSelected && (
                <CheckCircle2 color={colors.primary} size={24} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky bottom button */}
      {selectedMember && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 100 }]}>
          <TouchableOpacity style={styles.assignButton} activeOpacity={0.85} onPress={handleAssign}>
            <User color="#FFFFFF" size={18} strokeWidth={2.5} />
            <Text style={styles.assignButtonText}>
              Assign {unassignedMembers.find(m => m.id === selectedMember)?.name}
            </Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: spacing.l,
    marginBottom: 0,
    borderRadius: 16,
    paddingHorizontal: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.s,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.l,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.m,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  memberCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
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
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
  assignButton: {
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
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
