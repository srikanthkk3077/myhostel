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
  CalendarDays,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MessRebateScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const rebates = [
    { id: '1', dateRange: '12 Jun - 15 Jun', days: 4, amount: 480, status: 'Approved' },
  ];

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.requestCard}>
          <Text style={styles.requestTitle}>Apply for Rebate</Text>
          <Text style={styles.requestSubtitle}>Get a rebate on your mess fee for consecutive days of absence (Min. 3 days).</Text>
          <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
            <Text style={styles.applyButtonText}>Submit Application</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Previous Applications</Text>
        
        {rebates.map((rebate) => (
          <View key={rebate.id} style={styles.rebateCard}>
            <View style={styles.rebateHeader}>
              <View style={styles.dateRow}>
                <CalendarDays color={colors.primary} size={18} />
                <Text style={styles.rebateDates}>{rebate.dateRange}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                rebate.status === 'Approved' ? styles.statusApproved : styles.statusPending
              ]}>
                {rebate.status === 'Approved' ? (
                  <CheckCircle2 color={colors.success} size={14} />
                ) : (
                  <AlertCircle color={colors.warning} size={14} />
                )}
                <Text style={[
                  styles.statusText,
                  rebate.status === 'Approved' ? { color: colors.success } : { color: colors.warning }
                ]}>
                  {rebate.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.rebateFooter}>
              <Text style={styles.rebateDays}>{rebate.days} Days</Text>
              <Text style={styles.rebateAmount}>₹{rebate.amount} Rebate</Text>
            </View>
          </View>
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
