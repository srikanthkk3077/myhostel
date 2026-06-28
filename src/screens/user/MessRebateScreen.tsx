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
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getMessMenu } from '../../service/menuService';

const DAYS_MAP = [
  { id: 'mon', day: 'Monday', code: 'Mon' },
  { id: 'tue', day: 'Tuesday', code: 'Tue' },
  { id: 'wed', day: 'Wednesday', code: 'Wed' },
  { id: 'thu', day: 'Thursday', code: 'Thu' },
  { id: 'fri', day: 'Friday', code: 'Fri' },
  { id: 'sat', day: 'Saturday', code: 'Sat' },
  { id: 'sun', day: 'Sunday', code: 'Sun' },
];

export default function MessRebateScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeDay, setActiveDay] = useState('Mon');
  const [dbMenu, setDbMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMenu = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getMessMenu();
      if (response.status === 200 && response.data?.success) {
        setDbMenu(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch mess menu for student rebate screen', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMenu(true);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMenu(false);
  };

  const rebates = [
    { id: '1', dateRange: '12 Jun - 15 Jun', days: 4, amount: 480, status: 'Approved' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontWeight: '600' }}>
          Loading mess menu…
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
          <Text style={styles.headerTitle}>Mess Rebate</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        
        <Text style={styles.sectionTitle}>Mess Menu Schedule</Text>
        
        {/* Day Selector */}
        <View style={styles.daySelectorContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelectorScroll}>
            {DAYS_MAP.map((item) => {
              const isActive = activeDay === item.code;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.dayCard, isActive && styles.dayCardActive]}
                  onPress={() => setActiveDay(item.code)}
                  activeOpacity={0.8}>
                  <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                    {item.code}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Meals List */}
        <View style={styles.mealsContainer}>
          {(() => {
            const dayEntry = dbMenu.find((m: any) => m.day === activeDay) || {};
            const mealsConfig = [
              { type: 'Breakfast', time: '07:30 AM - 09:30 AM', icon: Coffee, color: colors.warning, value: dayEntry.breakfast },
              { type: 'Lunch', time: '12:30 PM - 02:30 PM', icon: Sun, color: colors.primary, value: dayEntry.lunch },
              { type: 'Snacks', time: '05:00 PM - 06:00 PM', icon: Sunset, color: colors.info, value: dayEntry.snacks },
              { type: 'Dinner', time: '08:00 PM - 10:00 PM', icon: Moon, color: colors.success, value: dayEntry.dinner },
            ];

            return mealsConfig.map((meal, idx) => (
              <View key={idx} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={[styles.iconBox, { backgroundColor: `${meal.color}15` }]}>
                    <meal.icon color={meal.color} size={20} strokeWidth={2.5} />
                  </View>
                  <View style={styles.mealTitleBox}>
                    <Text style={styles.mealType}>{meal.type}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.mealItems}>{meal.value || 'No items scheduled'}</Text>
              </View>
            ));
          })()}
        </View>
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
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  requestSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
    lineHeight: 20,
  },
  applyButton: {
    backgroundColor: colors.info,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
  },
  daySelectorContainer: {
    paddingVertical: spacing.s,
    marginBottom: spacing.m,
  },
  daySelectorScroll: {
    gap: spacing.s,
  },
  dayCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 60,
  },
  dayCardActive: {
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dayTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    width: 20,
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  mealsContainer: {
    marginBottom: spacing.l,
  },
  mealCard: {
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
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTitleBox: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  mealTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  mealItems: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  rebateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.l,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  rebateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rebateDates: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusApproved: {
    backgroundColor: colors.successBg,
  },
  statusPending: {
    backgroundColor: colors.warningBg,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rebateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.m,
  },
  rebateDays: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  rebateAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },
});
