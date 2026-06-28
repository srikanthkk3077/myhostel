import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  ArrowLeft,
  Plus,
  Bell,
  Megaphone,
  AlertCircle,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getNotices } from '../../../service/noticeService';

const formatTime = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeStr = '';
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  if (diffDays === 0 && now.getDate() === d.getDate()) {
    return `Today, ${timeStr}`;
  } else if (diffDays === 1 || (diffDays === 0 && now.getDate() !== d.getDate())) {
    return `Yesterday, ${timeStr}`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    const standardMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${standardMonths[d.getMonth()]} ${d.getFullYear()}`;
  }
};

export default function NoticeBoardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotices = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getNotices();
      if (response.status === 200 && response.data?.success) {
        setNotices(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch merchant notices', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotices(true);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotices(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Urgent': return AlertCircle;
      case 'Important': return Megaphone;
      default: return Bell;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'Urgent': return colors.danger;
      case 'Important': return colors.warning;
      default: return colors.primary;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
          Loading notices…
        </Text>
      </View>
    );
  }

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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notice Board</Text>
            <Text style={styles.headerSubtitle}>Announcements</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateNotice')}
            activeOpacity={0.7}>
            <Plus color="#FFFFFF" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {notices.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
            <Bell color={colors.textTertiary} size={64} strokeWidth={1.5} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.l }}>
              No notices published
            </Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: spacing.s, textAlign: 'center', paddingHorizontal: spacing.xl }}>
              Publish an announcement to inform your residents.
            </Text>
          </View>
        ) : (
          notices.map((notice) => {
            const Icon = getIconForType(notice.type);
            const iconColor = getColorForType(notice.type);

            return (
              <View key={notice._id} style={styles.noticeCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.authorBox}>
                    <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
                      <Icon color={iconColor} size={18} strokeWidth={2.5} />
                    </View>
                    <View>
                      <Text style={styles.authorName}>{notice.author}</Text>
                      <Text style={styles.dateText}>{formatTime(notice.createdAt)}</Text>
                    </View>
                  </View>
                  {notice.type !== 'Normal' && (
                    <View style={[styles.typeBadge, { backgroundColor: iconColor }]}>
                      <Text style={styles.typeBadgeText}>{notice.type}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.noticeTitle}>{notice.title}</Text>
                <Text style={styles.noticeMessage}>{notice.message}</Text>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacing.l,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  authorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noticeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.s,
  },
  noticeMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
