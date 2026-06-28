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
  Calendar,
  FileText,
  Download,
  Trash2,
  Edit2,
  Zap,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExpenseDetailsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  
  // In a real app, this data would come from route.params
  const expense = {
    id: '1',
    title: 'Electricity Bill',
    category: 'Utility',
    amount: 12500,
    date: '15 Jun 2026',
    time: '10:30 AM',
    icon: Zap,
    color: colors.warning,
    description: 'Monthly electricity bill for the entire hostel building. Includes AC usage for summer months.',
    paymentMethod: 'Bank Transfer',
    referenceNo: 'TDS123456789',
    recordedBy: 'Admin (HM-2024)',
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
          <Text style={styles.headerTitle}>Expense Details</Text>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Edit2 color={colors.text} size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Card */}
        <View style={styles.mainCard}>
          <View style={[styles.iconBox, { backgroundColor: expense.color + '15' }]}>
            <expense.icon color={expense.color} size={32} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>{expense.title}</Text>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: expense.color }]}>{expense.category}</Text>
          </View>
          <Text style={styles.amount}>-₹{expense.amount.toLocaleString()}</Text>
          <Text style={styles.date}>{expense.date} at {expense.time}</Text>
        </View>

        {/* Details Section */}
        <Text style={styles.sectionTitle}>Transaction Info</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{expense.paymentMethod}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference No.</Text>
            <Text style={styles.detailValue}>{expense.referenceNo}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Recorded By</Text>
            <Text style={styles.detailValue}>{expense.recordedBy}</Text>
          </View>
        </View>

        {/* Description Section */}
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.descCard}>
          <Text style={styles.descText}>{expense.description}</Text>
        </View>

        {/* Receipt Section */}
        <Text style={styles.sectionTitle}>Attachments</Text>
        <TouchableOpacity style={styles.receiptCard} activeOpacity={0.7}>
          <View style={styles.receiptLeft}>
            <View style={styles.receiptIconBox}>
              <FileText color={colors.primary} size={20} strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.receiptTitle}>Invoice_June.pdf</Text>
              <Text style={styles.receiptSize}>1.2 MB</Text>
            </View>
          </View>
          <Download color={colors.textSecondary} size={20} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} activeOpacity={0.8}>
          <Trash2 color={colors.danger} size={20} strokeWidth={2.5} />
          <Text style={styles.deleteButtonText}>Delete Expense</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.l,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginBottom: spacing.m,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.m,
  },
  descCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.l,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  descText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  receiptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.m,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  receiptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  receiptIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  receiptSize: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    backgroundColor: colors.dangerBg,
    paddingVertical: 16,
    borderRadius: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.danger,
  },
});
