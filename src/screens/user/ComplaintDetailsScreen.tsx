import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function ComplaintDetailsScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const complaint = {
    id: '1',
    title: 'AC not cooling',
    category: 'Electrical',
    description: 'The AC in Room 101 has stopped cooling entirely since yesterday night. It only blows normal air.',
    date: '12 Jun 2026, 09:30 AM',
    status: 'In Progress',
    updates: [
      { id: 'u1', text: 'Technician has been assigned. Will visit today by 4 PM.', date: '12 Jun, 11:00 AM' },
      { id: 'u2', text: 'Complaint registered successfully.', date: '12 Jun, 09:30 AM' }
    ]
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 260 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
      </LinearGradient>

      <View style={[styles.headerTop, { paddingTop: insets.top + spacing.m }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryBadgeWrapper}>
                <View style={styles.iconCircle}>
                  <Zap color="#4F46E5" size={18} strokeWidth={2.5} />
                </View>
                <Text style={styles.categoryText}>{complaint.category}</Text>
              </View>
              
              <View style={[
                styles.statusBadge,
                complaint.status === 'Resolved' ? styles.statusResolved : styles.statusProgress
              ]}>
                {complaint.status === 'Resolved' ? (
                  <CheckCircle2 color={colors.success} size={14} strokeWidth={2.5} />
                ) : (
                  <Clock color="#F59E0B" size={14} strokeWidth={2.5} />
                )}
                <Text style={[
                  styles.statusText,
                  complaint.status === 'Resolved' ? { color: colors.success } : { color: '#F59E0B' }
                ]}>
                  {complaint.status}
                </Text>
              </View>
            </View>
            
            <Text style={styles.complaintTitle}>{complaint.title}</Text>
            <View style={styles.dateRow}>
              <Calendar color={colors.textSecondary} size={16} />
              <Text style={styles.dateText}>Raised on {complaint.date}</Text>
            </View>

            <View style={styles.divider} />
            
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{complaint.description}</Text>
          </View>

          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timelineCard}>
            {complaint.updates.map((update, index) => (
              <View key={update.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    index === 0 && styles.timelineDotActive
                  ]} />
                  {index !== complaint.updates.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={[
                    styles.timelineUpdate,
                    index === 0 && styles.timelineUpdateActive
                  ]}>{update.text}</Text>
                  <Text style={styles.timelineDate}>{update.date}</Text>
                </View>
              </View>
            ))}
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -80,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s,
    marginBottom: spacing.l,
    zIndex: 10,
  },
  backButton: {
    padding: spacing.s,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 40,
    paddingTop: spacing.m,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  categoryBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusResolved: {
    backgroundColor: colors.successBg,
  },
  statusProgress: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
  },
  complaintTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.s,
    letterSpacing: -0.5,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 70,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacing.m,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
    marginTop: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  timelineDotActive: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: -4,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: spacing.l,
  },
  timelineUpdate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 22,
  },
  timelineUpdateActive: {
    color: colors.text,
    fontWeight: '800',
  },
  timelineDate: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '600',
  },
});
