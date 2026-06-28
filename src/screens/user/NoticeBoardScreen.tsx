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
  Bell,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NoticeBoardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const notices = [
    { id: '1', title: 'Water Supply Issue', content: 'Due to municipal maintenance, water supply will be interrupted between 2 PM and 5 PM today.', date: 'Today, 10:00 AM', priority: 'high' },
    { id: '2', title: 'Mess Menu Updated', content: 'The mess menu for the upcoming week has been updated. Paneer Tikka will be served on Sunday night.', date: 'Yesterday, 6:00 PM', priority: 'normal' },
    { id: '3', title: 'WiFi Maintenance', content: 'Scheduled WiFi maintenance will occur at 2 AM tonight. Expect intermittent downtime.', date: '12 Jun, 2:00 PM', priority: 'normal' },
  ];

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {notices.map((notice) => (
          <View key={notice.id} style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <View style={[
                styles.noticeIconBox,
                notice.priority === 'high' ? { backgroundColor: colors.dangerBg } : { backgroundColor: colors.primaryBg }
              ]}>
                <Bell 
                  color={notice.priority === 'high' ? colors.danger : colors.primary} 
                  size={18} 
                  strokeWidth={2.5} 
                />
              </View>
              <Text style={styles.noticeDate}>{notice.date}</Text>
            </View>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeContent}>{notice.content}</Text>
          </View>
        ))}

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
