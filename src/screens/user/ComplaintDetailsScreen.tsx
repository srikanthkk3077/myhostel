import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
  Droplets,
  Wind,
  AlertCircle,
  Wifi,
  Wrench,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { getComplaintById } from '../../service/complaintService';

// Helper to get category icons
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Electrical': return <Zap color={colors.primary} size={18} strokeWidth={2.5} />;
    case 'Plumbing': return <Droplets color={colors.info} size={18} strokeWidth={2.5} />;
    case 'Cleaning': return <Wind color={colors.success} size={18} strokeWidth={2.5} />;
    case 'Internet': return <Wifi color={colors.info} size={18} strokeWidth={2.5} />;
    case 'Carpentry': return <Wrench color={colors.warning} size={18} strokeWidth={2.5} />;
    default: return <AlertCircle color={colors.warning} size={18} strokeWidth={2.5} />;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  
  const standardMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const datePart = `${String(d.getDate()).padStart(2, '0')} ${standardMonths[d.getMonth()]} ${d.getFullYear()}`;
  
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timePart = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  
  return `${datePart}, ${timePart}`;
};

const formatUpdateDate = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  
  const standardMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${d.getDate()} ${standardMonths[d.getMonth()]}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

export default function ComplaintDetailsScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { id } = route.params || {};
  
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [loading]);

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) {
        setError('No complaint ID provided');
        setLoading(false);
        return;
      }
      try {
        const response = await getComplaintById(id);
        if (response.status === 200 && response.data?.success) {
          setComplaint(response.data.data);
        } else {
          setError(response.data?.message || 'Failed to fetch details');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
          Loading details…
        </Text>
      </View>
    );
  }

  if (error || !complaint) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <AlertCircle color={colors.danger} size={48} />
        <Text style={{ marginTop: 12, color: colors.text, fontWeight: '700', fontSize: 16 }}>
          {error || 'Complaint not found'}
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.primary, borderRadius: 12 }} 
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
                  {getCategoryIcon(complaint.category)}
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
              <Text style={styles.dateText}>Raised on {formatDate(complaint.createdAt)}</Text>
            </View>

            <View style={styles.divider} />
            
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{complaint.description}</Text>

            {complaint.image && (
              <View style={styles.attachmentContainer}>
                <Text style={styles.attachmentLabel}>Attached Photo</Text>
                <Image source={{ uri: complaint.image }} style={styles.attachmentImage} />
              </View>
            )}
          </View>

          {complaint.updates && complaint.updates.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Status Timeline</Text>
              <View style={styles.timelineCard}>
                {complaint.updates.map((update: any, index: number) => (
                  <View key={update._id || index} style={styles.timelineItem}>
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
                      <Text style={styles.timelineDate}>{formatUpdateDate(update.date)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

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
  attachmentContainer: {
    marginTop: spacing.xl,
  },
  attachmentLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
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
