import React, { useState } from 'react';
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
  Coffee,
  Sun,
  Sunset,
  Moon,
  Edit2,
  CalendarDays,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MessMenuScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeDay, setActiveDay] = useState('Mon');

  // Dummy Menu Data
  const menuData: any = {
    Mon: [
      { id: '1', type: 'Breakfast', time: '07:30 AM - 09:30 AM', items: 'Idli, Vada, Sambar, Chutney, Tea/Coffee', icon: Coffee, color: colors.warning },
      { id: '2', type: 'Lunch', time: '12:30 PM - 02:30 PM', items: 'Roti, Dal Tadka, Paneer Butter Masala, Rice, Salad', icon: Sun, color: colors.primary },
      { id: '3', type: 'Snacks', time: '05:00 PM - 06:00 PM', items: 'Samosa, Green Chutney, Tea', icon: Sunset, color: colors.info },
      { id: '4', type: 'Dinner', time: '08:00 PM - 10:00 PM', items: 'Roti, Mix Veg, Dal Fry, Rice, Gulab Jamun', icon: Moon, color: colors.success },
    ],
    Tue: [
      { id: '1', type: 'Breakfast', time: '07:30 AM - 09:30 AM', items: 'Poha, Jalebi, Tea/Coffee', icon: Coffee, color: colors.warning },
      { id: '2', type: 'Lunch', time: '12:30 PM - 02:30 PM', items: 'Rajma Chawal, Roti, Curd, Salad', icon: Sun, color: colors.primary },
      { id: '3', type: 'Snacks', time: '05:00 PM - 06:00 PM', items: 'Bread Pakoda, Tea', icon: Sunset, color: colors.info },
      { id: '4', type: 'Dinner', time: '08:00 PM - 10:00 PM', items: 'Roti, Bhindi Masala, Dal, Jeera Rice', icon: Moon, color: colors.success },
    ],
    // Add other days as needed...
  };

  const todayMenu = menuData[activeDay] || menuData['Mon'];

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
            <Text style={styles.headerTitle}>Mess Menu</Text>
            <Text style={styles.headerSubtitle}>Weekly Schedule</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditMenu', { day: activeDay })}
            activeOpacity={0.7}>
            <Edit2 color={colors.primary} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        <View style={styles.daySelectorContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelectorScroll}>
            {DAYS.map((day) => {
              const isActive = activeDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayCard, isActive && styles.dayCardActive]}
                  onPress={() => setActiveDay(day)}
                  activeOpacity={0.8}>
                  <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                    {day}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.menuHeader}>
          <CalendarDays color={colors.textSecondary} size={20} strokeWidth={2.5} />
          <Text style={styles.menuDateText}>{activeDay}'s Menu</Text>
        </View>

        {todayMenu.map((meal: any, index: number) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${meal.color}15` }]}>
                <meal.icon color={meal.color} size={24} strokeWidth={2.5} />
              </View>
              <View style={styles.mealTitleBox}>
                <Text style={styles.mealType}>{meal.type}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.mealItems}>{meal.items}</Text>
          </View>
        ))}

        <View style={{ height: 120 }} />
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
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelectorContainer: {
    paddingBottom: spacing.m,
  },
  daySelectorScroll: {
    paddingHorizontal: spacing.l,
    gap: spacing.m,
  },
  dayCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 64,
  },
  dayCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  scrollContent: {
    padding: spacing.l,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
    gap: spacing.s,
    paddingHorizontal: 4,
  },
  menuDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
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
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTitleBox: {
    flex: 1,
  },
  mealType: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  mealItems: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    fontWeight: '500',
  },
});
