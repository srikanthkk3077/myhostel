import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  User,
  MapPin,
  CheckCircle2,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getUnassignedMembers, assignMember } from '../../../service/merchant';

export default function AssignMemberScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { room, bedId } = route.params || { room: { id: '101' }, bedId: 'Bed 1' };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchUnassigned = async () => {
    try {
      setIsLoading(true);
      const res = await getUnassignedMembers();
      if (res.status === 200 && res.data?.success) {
        setMembers(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnassigned();
    }, [])
  );

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAssign = async () => {
    if (!selectedMemberId) return;
    const member = members.find((m) => m._id === selectedMemberId);
    if (!member) return;

    setIsAssigning(true);
    try {
      const res = await assignMember(selectedMemberId, String(room.id), bedId);
      if (res.status === 200 && res.data?.success) {
        Alert.alert(
          'Success 🎉',
          `${member.name} has been assigned to Room ${room.id} – ${bedId}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Failed', res.data?.message || 'Could not assign member');
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Something went wrong';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsAssigning(false);
    }
  };

  const selectedMember = members.find((m) => m._id === selectedMemberId);

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
            <Text style={styles.headerSubtitle}>Room {room.id} • {bedId}</Text>
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

      {isLoading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading members...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>
            {filtered.length === 0
              ? 'No unassigned members found'
              : `${filtered.length} Available Member${filtered.length !== 1 ? 's' : ''}`}
          </Text>
          {filtered.map((member) => {
            const isSelected = selectedMemberId === member._id;
            return (
              <TouchableOpacity
                key={member._id}
                style={[styles.memberCard, isSelected && styles.memberCardActive]}
                activeOpacity={0.85}
                onPress={() => setSelectedMemberId(isSelected ? null : member._id)}>
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
      )}

      {/* Sticky bottom button */}
      {selectedMemberId && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.assignButton}
            activeOpacity={0.85}
            onPress={handleAssign}
            disabled={isAssigning}>
            {isAssigning ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <User color="#FFFFFF" size={18} strokeWidth={2.5} />
                <Text style={styles.assignButtonText}>
                  Assign {selectedMember?.name}
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
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.m,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
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
