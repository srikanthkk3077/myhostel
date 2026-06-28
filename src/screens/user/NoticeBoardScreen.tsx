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
  Bell,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getNotices } from '../../service/noticeService';

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
      console.error('Failed to fetch student notices', error);
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
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notice Board</Text>
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
              Check back later for any updates from your warden or hostel management.
            </Text>
          </View>
        ) : (
          notices.map((notice) => {
            const isHigh = notice.type === 'Urgent';
            return (
              <View key={notice._id} style={styles.noticeCard}>
                <View style={styles.noticeHeader}>
                  <View style={[
                    styles.noticeIconBox,
                    isHigh ? { backgroundColor: colors.dangerBg } : { backgroundColor: colors.primaryBg }
                  ]}>
                    <Bell 
                      color={isHigh ? colors.danger : colors.primary} 
                      size={18} 
                      strokeWidth={2.5} 
                    />
                  </View>
                  <Text style={styles.noticeDate}>{formatTime(notice.createdAt)}</Text>
                </View>
                <Text style={styles.noticeTitle}>{notice.title}</Text>
                <Text style={styles.noticeContent}>{notice.message}</Text>
              </View>
            );
          })
        )}

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
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.s,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.l,
    paddingBottom: 40,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    marginBottom: spacing.m,
  },
  noticeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeDate: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  noticeContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
