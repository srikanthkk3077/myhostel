import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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

export default function NoticeBoardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const notices = [
    {
      id: '1',
      title: 'Water Supply Maintenance',
      message: 'There will be no water supply on 3rd Floor between 10 AM and 2 PM tomorrow due to overhead tank cleaning.',
      date: 'Today, 08:30 AM',
      type: 'Urgent',
      author: 'Warden',
    },
    {
      id: '2',
      title: 'Monthly Fees Reminder',
      message: 'Please clear your pending hostel fees for the current month before the 10th to avoid late fines.',
      date: 'Yesterday, 10:00 AM',
      type: 'Important',
      author: 'Admin',
    },
    {
      id: '3',
      title: 'Upcoming Festival Celebration',
      message: 'We are organizing a small get-together this weekend in the common area. Snacks will be provided!',
      date: '12 Oct, 04:15 PM',
      type: 'Normal',
      author: 'Cultural Committee',
    },
  ];

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notices.map((notice, index) => {
          const Icon = getIconForType(notice.type);
          const iconColor = getColorForType(notice.type);

          return (
            <View key={notice.id} style={styles.noticeCard}>
              <View style={styles.cardHeader}>
                <View style={styles.authorBox}>
                  <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
                    <Icon color={iconColor} size={18} strokeWidth={2.5} />
                  </View>
                  <View>
                    <Text style={styles.authorName}>{notice.author}</Text>
                    <Text style={styles.dateText}>{notice.date}</Text>
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
        })}
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
