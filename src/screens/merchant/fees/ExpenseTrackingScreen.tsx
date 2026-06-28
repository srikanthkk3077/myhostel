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
import { ArrowLeft, Plus, Zap, Droplets, PenTool as Tool, ShoppingCart, Receipt } from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getExpenses } from '../../../service/merchant';
import { useFocusEffect } from '@react-navigation/native';

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
}

interface SummarySegment {
  category: string;
  amount: number;
  ratio: number;
}

interface ExpenseSummary {
  totalAmount: number;
  segments: SummarySegment[];
}

export default function ExpenseTrackingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({ totalAmount: 0, segments: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExpensesData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await getExpenses();
      if (response.status === 200 && response.data?.success) {
        setExpenses(response.data.data.expenses || []);
        setSummary(response.data.data.summary || { totalAmount: 0, segments: [] });
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExpensesData();
    }, [])
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Utility':
        return { icon: Zap, color: colors.warning };
      case 'Maintenance':
        return { icon: Tool, color: colors.info };
      case 'Supplies':
        return { icon: ShoppingCart, color: colors.primary };
      default:
        return { icon: Receipt, color: colors.textSecondary };
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
          <Text style={styles.headerTitle}>Expense Tracker</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading expenses…</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchExpensesData(true)}
              tintColor={colors.primary}
            />
          }
        >
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Expenses (This Month)</Text>
            <Text style={styles.summaryAmount}>₹{summary.totalAmount.toLocaleString('en-IN')}</Text>
            {summary.totalAmount > 0 && summary.segments.length > 0 && (
              <View style={styles.summaryBar}>
                {summary.segments.map((segment, index) => {
                  const { color } = getCategoryIcon(segment.category);
                  return (
                    <View 
                      key={index}
                      style={[styles.summarySegment, { flex: segment.ratio, backgroundColor: color }]} 
                    />
                  );
                })}
              </View>
            )}
            <View style={styles.legendRow}>
              {summary.segments.map((segment, index) => {
                 const { color } = getCategoryIcon(segment.category);
                 return (
                   <View key={index} style={styles.legendItem}>
                     <View style={[styles.legendDot, { backgroundColor: color }]} />
                     <Text style={styles.legendText}>{segment.category}</Text>
                   </View>
                 );
              })}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenses.length === 0 ? (
             <View style={styles.emptyContainer}>
               <Receipt color={colors.textTertiary} size={48} strokeWidth={1.5} />
               <Text style={styles.emptyTitle}>No Expenses Yet</Text>
               <Text style={styles.emptySubtitle}>
                 Record your hostel expenses to track them here.
               </Text>
             </View>
          ) : (
            <View style={styles.listContainer}>
              {expenses.map((exp) => {
                const { icon: Icon, color } = getCategoryIcon(exp.category);
                return (
                  <TouchableOpacity 
                    key={exp.id} 
                    style={styles.expCard}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('ExpenseDetails', { id: exp.id })}>
                    <View style={styles.expLeft}>
                      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                        <Icon color={color} size={20} />
                      </View>
                      <View>
                        <Text style={styles.expTitle}>{exp.title}</Text>
                        <Text style={styles.expDate}>{exp.date} • {exp.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.expAmount}>-₹{exp.amount.toLocaleString('en-IN')}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
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
    flexWrap: 'wrap',
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
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
