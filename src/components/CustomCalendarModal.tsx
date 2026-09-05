import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Check } from 'lucide-react-native';
import { colors, spacing } from '../theme/colors';

interface CustomCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate?: string; // DD/MM/YYYY
  onSelectDate: (dateStr: string, dateObj: Date) => void;
  title?: string;
  disableFutureDates?: boolean;
  maxDate?: Date;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CustomCalendarModal({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  title = 'Select Date',
  disableFutureDates = true,
  maxDate = new Date(),
}: CustomCalendarModalProps) {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<Date>(new Date());

  // Set max date cutoff to end of that day
  const effectiveMaxDate = new Date(maxDate);
  effectiveMaxDate.setHours(23, 59, 59, 999);

  // Parse incoming date string DD/MM/YYYY into Date object
  useEffect(() => {
    if (selectedDate && visible) {
      const parts = selectedDate.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const parsed = new Date(year, month, day);
          setTempSelectedDate(parsed);
          setCalendarDate(new Date(year, month, 1));
          return;
        }
      }
    }
    if (visible) {
      const now = new Date();
      setTempSelectedDate(now);
      setCalendarDate(new Date(now.getFullYear(), now.getMonth(), 1));
    }
  }, [selectedDate, visible]);

  const isNextMonthDisabled = () => {
    if (!disableFutureDates) return false;
    const nextMonthFirstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    const maxMonthFirstDay = new Date(effectiveMaxDate.getFullYear(), effectiveMaxDate.getMonth(), 1);
    return nextMonthFirstDay > maxMonthFirstDay;
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    if (isNextMonthDisabled()) return;
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const handleQuickPreset = (type: 'today' | 'yesterday' | 'first') => {
    const now = new Date();
    let target = new Date();
    if (type === 'yesterday') {
      target.setDate(now.getDate() - 1);
    } else if (type === 'first') {
      target = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    // Safety check against maxDate
    if (disableFutureDates && target > effectiveMaxDate) {
      target = new Date(effectiveMaxDate);
    }

    setTempSelectedDate(target);
    setCalendarDate(new Date(target.getFullYear(), target.getMonth(), 1));
  };

  const formatDateString = (d: Date) => {
    const dayStr = String(d.getDate()).padStart(2, '0');
    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
    return `${dayStr}/${monthStr}/${d.getFullYear()}`;
  };

  const handleConfirm = () => {
    onSelectDate(formatDateString(tempSelectedDate), tempSelectedDate);
    onClose();
  };

  const renderDaysGrid = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const daysArr = [];

    // Padding for empty start slots
    for (let i = 0; i < firstDayIndex; i++) {
      daysArr.push(<View key={`empty-${i}`} style={styles.daySlot} />);
    }

    const today = new Date();

    for (let day = 1; day <= totalDays; day++) {
      const slotDate = new Date(year, month, day, 23, 59, 59, 999);
      const isFuture = disableFutureDates && slotDate > effectiveMaxDate;

      const isSelected =
        !isFuture &&
        tempSelectedDate.getDate() === day &&
        tempSelectedDate.getMonth() === month &&
        tempSelectedDate.getFullYear() === year;

      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      daysArr.push(
        <TouchableOpacity
          key={`day-${day}`}
          disabled={isFuture}
          style={[
            styles.daySlot,
            isSelected && styles.daySelected,
            !isSelected && isToday && styles.dayToday,
            isFuture && styles.dayDisabled,
          ]}
          activeOpacity={0.7}
          onPress={() => {
            if (!isFuture) {
              setTempSelectedDate(new Date(year, month, day));
            }
          }}
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.dayTextSelected,
              !isSelected && isToday && styles.dayTextToday,
              isFuture && styles.dayTextDisabled,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return daysArr;
  };

  const nextDisabled = isNextMonthDisabled();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          {/* Handle indicator */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.titleIconBadge}>
                <CalendarIcon color={colors.primary} size={18} strokeWidth={2.5} />
              </View>
              <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>

          {/* Quick Presets */}
          <View style={styles.presetRow}>
            <TouchableOpacity style={styles.presetChip} onPress={() => handleQuickPreset('today')}>
              <Text style={styles.presetChipText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => handleQuickPreset('yesterday')}>
              <Text style={styles.presetChipText}>Yesterday</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => handleQuickPreset('first')}>
              <Text style={styles.presetChipText}>1st of Month</Text>
            </TouchableOpacity>
          </View>

          {/* Month & Year Navigation */}
          <View style={styles.monthHeader}>
            <TouchableOpacity style={styles.navButton} onPress={handlePrevMonth} activeOpacity={0.7}>
              <ChevronLeft color={colors.text} size={20} strokeWidth={2.2} />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {MONTH_NAMES[calendarDate.getMonth()]} {calendarDate.getFullYear()}
            </Text>

            <TouchableOpacity
              style={[styles.navButton, nextDisabled && styles.navButtonDisabled]}
              disabled={nextDisabled}
              onPress={handleNextMonth}
              activeOpacity={0.7}
            >
              <ChevronRight color={nextDisabled ? '#94A3B8' : colors.text} size={20} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* Day of Week Headers */}
          <View style={styles.daysHeaderRow}>
            {DAYS_OF_WEEK.map((d, index) => (
              <Text
                key={d}
                style={[
                  styles.dayHeaderLabel,
                  (index === 0 || index === 6) && { color: colors.warning },
                ]}
              >
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.gridContainer}>{renderDaysGrid()}</View>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.85}>
              <Check color="#FFFFFF" size={18} strokeWidth={2.5} />
              <Text style={styles.confirmButtonText}>Select Date</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.l,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.s,
    marginBottom: spacing.l,
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
    paddingHorizontal: spacing.xs,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.5,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.2,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  dayHeaderLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.l,
  },
  daySlot: {
    width: '14.28%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  daySelected: {
    backgroundColor: colors.primary,
    borderRadius: 21,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 21,
  },
  dayDisabled: {
    opacity: 0.4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '800',
  },
  dayTextDisabled: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.m,
    marginTop: spacing.s,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
