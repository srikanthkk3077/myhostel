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
  UserCheck,
  CreditCard,
  BedDouble,
  Bell,
  Wrench,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const notifications = [
    {
      id: '1',
      type: 'admission',
      title: 'New Member Registered',
      description: 'Rahul Sharma has been admitted to Room 102.',
      time: '2 min ago',
      icon: UserCheck,
      color: colors.primary,
      bgColor: colors.primaryBg,
      unread: true,
    },
    {
      id: '2',
      type: 'fee',
      title: 'Fee Payment Received',
      description: 'Priya Patel paid ₹12,500 via UPI.',
      time: '15 min ago',
      icon: CreditCard,
      color: colors.success,
      bgColor: colors.successBg,
      unread: true,
    },
    {
      id: '3',
      type: 'maintenance',
      title: 'New Complaint Logged',
      description: 'Plumbing issue reported in Room 204.',
      time: '1 hour ago',
      icon: Wrench,
      color: colors.danger,
      bgColor: colors.dangerBg,
      unread: true,
    },
    {
      id: '4',
      type: 'system',
      title: 'System Update',
      description: 'Hostel app updated to version 1.0.0 successfully.',
      time: 'Yesterday',
      icon: Bell,
      color: colors.info,
      bgColor: colors.infoBg,
      unread: false,
    },
    {
      id: '5',
      type: 'room',
      title: 'Room Change Request',
      description: 'Amit Kumar requested a change from 105 to 201.',
      time: '2 days ago',
      icon: BedDouble,
      color: colors.warning,
      bgColor: colors.warningBg,
      unread: false,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <ArrowLeft color={colors.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.markAllRead}>
            <Text style={styles.markAllReadText}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.notificationCard, item.unread && styles.unreadCard]}
            activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
              <item.icon color={item.color} size={20} strokeWidth={2.5} />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
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
  },
  markAllRead: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
  },
  markAllReadText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollContent: {
    padding: spacing.l,
    paddingBottom: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#F4F7FE',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.1)', // Subtle primary border
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
  },
});
