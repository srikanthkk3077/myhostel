import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ArrowLeft, Plus, Zap, Droplets, PenTool as Tool, ShoppingCart } from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExpenseTrackingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const expenses = [
    { id: '1', title: 'Electricity Bill', category: 'Utility', amount: 12500, date: '15 Jun 2026', icon: Zap, color: colors.warning },
    { id: '2', title: 'Water Tanker', category: 'Utility', amount: 3000, date: '14 Jun 2026', icon: Droplets, color: colors.info },
    { id: '3', title: 'Plumbing Repair', category: 'Maintenance', amount: 1500, date: '10 Jun 2026', icon: Tool, color: colors.danger },
    { id: '4', title: 'Groceries', category: 'Supplies', amount: 8500, date: '05 Jun 2026', icon: ShoppingCart, color: colors.primary },
  ];

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
          <Text style={styles.headerTitle}>Expense Tracker</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Expenses (This Month)</Text>
          <Text style={styles.summaryAmount}>₹25,500</Text>
          <View style={styles.summaryBar}>
            <View style={[styles.summarySegment, { flex: 3, backgroundColor: colors.warning }]} />
            <View style={[styles.summarySegment, { flex: 1, backgroundColor: colors.info }]} />
            <View style={[styles.summarySegment, { flex: 2, backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.legendText}>Utility</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.info }]} />
              <Text style={styles.legendText}>Maintenance</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Supplies</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <View style={styles.listContainer}>
          {expenses.map((exp) => (
            <TouchableOpacity 
              key={exp.id} 
              style={styles.expCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ExpenseDetails', { id: exp.id })}>
              <View style={styles.expLeft}>
                <View style={[styles.iconBox, { backgroundColor: exp.color + '15' }]}>
                  <exp.icon color={exp.color} size={20} />
                </View>
                <View>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expDate}>{exp.date} • {exp.category}</Text>
                </View>
              </View>
              <Text style={styles.expAmount}>-₹{exp.amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 100 }]} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AddExpense')}>
        <Plus color="#FFFFFF" size={24} strokeWidth={3} />
      </TouchableOpacity>
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
  scrollContent: {
    padding: spacing.l,
    paddingBottom: 100, // Space for FAB
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
    marginBottom: spacing.l,
  },
  summaryBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing.m,
  },
  summarySegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
  },
  listContainer: {
    gap: spacing.m,
  },
  expCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.m,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  expLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  expDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  expAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});
