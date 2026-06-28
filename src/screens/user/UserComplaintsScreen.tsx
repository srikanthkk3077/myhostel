import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Clock,
  CheckCircle2,
  Plus,
  Zap,
  Droplets,
  Wind,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getMyComplaints } from '../../service/complaintService';

const { width } = Dimensions.get('window');

// Helper to get category icons
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Electrical': return <Zap color={colors.primary} size={18} />;
    case 'Plumbing': return <Droplets color={colors.info} size={18} />;
    case 'Cleaning': return <Wind color={colors.success} size={18} />;
    default: return <AlertCircle color={colors.warning} size={18} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Electrical': return colors.primaryBg;
    case 'Plumbing': return colors.infoBg;
    case 'Cleaning': return colors.successBg;
    default: return colors.warningBg;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const standardMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(d.getDate()).padStart(2, '0')} ${standardMonths[d.getMonth()]} ${d.getFullYear()}`;
};

export default function UserComplaintsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fabScale = useRef(new Animated.Value(0)).current;

  const fetchComplaints = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getMyComplaints();
      if (response.status === 200 && response.data?.success) {
        setComplaints(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch user complaints', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComplaints(true);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints(false);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
        delay: 400,
      })
    ]).start();
  }, []);

  const activeIssuesCount = complaints.filter(c => c.status !== 'Resolved').length;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
          Loading complaints…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Premium Gradient Header */}
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 260 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.l }]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Complaints</Text>
            <View style={styles.headerStatsBadge}>
              <Text style={styles.headerStatsText}>
                {activeIssuesCount} Active Issue{activeIssuesCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <View style={styles.cardsContainer}>
            {complaints.length === 0 ? (
              <View style={styles.emptyContainer}>
                <AlertCircle color={colors.textTertiary} size={48} strokeWidth={1.5} />
                <Text style={styles.emptyText}>No complaints raised yet.</Text>
                <Text style={styles.emptySubText}>
                  Tap the + button below to raise your first issue.
                </Text>
              </View>
            ) : (
              complaints.map((comp) => (
                <TouchableOpacity 
                  key={comp._id} 
                  style={styles.card} 
                  activeOpacity={0.9} 
                  onPress={() => navigation.navigate('ComplaintDetails', { id: comp._id })}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.categoryBadgeWrapper}>
                      <View style={[styles.iconCircle, { backgroundColor: getCategoryColor(comp.category) }]}>
                        {getCategoryIcon(comp.category)}
                      </View>
                      <Text style={styles.categoryText}>{comp.category}</Text>
                    </View>
                    
                    <View style={[
                      styles.statusBadge,
                      comp.status === 'Resolved' ? styles.statusResolved : styles.statusProgress
                    ]}>
                      {comp.status === 'Resolved' ? (
                        <CheckCircle2 color={colors.success} size={14} strokeWidth={2.5} />
                      ) : (
                        <Clock color="#F59E0B" size={14} strokeWidth={2.5} />
                      )}
                      <Text style={[
                        styles.statusText,
                        comp.status === 'Resolved' ? { color: colors.success } : { color: '#F59E0B' }
                      ]}>
                        {comp.status}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.cardTitle}>{comp.title}</Text>
                  
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardDate}>Reported: {formatDate(comp.createdAt)}</Text>
                    <View style={styles.arrowBox}>
                      <ChevronRight color={colors.primary} size={16} strokeWidth={3} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

        </Animated.View>
      </ScrollView>

      <Animated.View style={[
        styles.fabContainer,
        { 
          bottom: insets.bottom + 20,
          transform: [{ scale: fabScale }]
        }
      ]}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('RaiseComplaint')}>
          <LinearGradient
            colors={['#16A34A', '#15803D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <Plus color="#FFFFFF" size={28} strokeWidth={3} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: -50,
    right: -80,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.4)',
    top: 120,
    left: -30,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 100,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.s,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerStatsBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerStatsText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  cardsContainer: {
    gap: spacing.l,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusResolved: {
    backgroundColor: colors.successBg,
  },
  statusProgress: {
    backgroundColor: '#FEF3C7', // Amber light bg
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
    letterSpacing: -0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
  },
  cardDate: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.l,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    marginTop: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.m,
    marginBottom: spacing.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
