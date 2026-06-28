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
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GatePassScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const passes = [
    { id: '1', reason: 'Going Home', departure: '12 Jun, 5:00 PM', return: '15 Jun, 8:00 AM', status: 'Approved' },
    { id: '2', reason: 'Local Guardian Visit', departure: '05 Jun, 10:00 AM', return: '05 Jun, 8:00 PM', status: 'Approved' },
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
          <Text style={styles.headerTitle}>Gate Pass</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.requestCard}>
          <Text style={styles.requestTitle}>Request New Pass</Text>
          <Text style={styles.requestSubtitle}>Submit a request to leave the hostel premises.</Text>
          <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
            <Text style={styles.applyButtonText}>Apply for Gate Pass</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Previous Requests</Text>
        
        {passes.map((pass) => (
          <View key={pass.id} style={styles.passCard}>
            <View style={styles.passHeader}>
              <Text style={styles.passReason}>{pass.reason}</Text>
              <View style={[
                styles.statusBadge,
                pass.status === 'Approved' ? styles.statusApproved : styles.statusPending
              ]}>
                {pass.status === 'Approved' ? (
                  <CheckCircle2 color={colors.success} size={14} />
                ) : (
                  <AlertCircle color={colors.warning} size={14} />
                )}
                <Text style={[
                  styles.statusText,
                  pass.status === 'Approved' ? { color: colors.success } : { color: colors.warning }
                ]}>
                  {pass.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.passDetailsRow}>
              <View style={styles.passDetail}>
                <Calendar color={colors.textSecondary} size={14} />
                <Text style={styles.passDetailText}>Out: {pass.departure}</Text>
              </View>
              <View style={styles.passDetail}>
                <Clock color={colors.textSecondary} size={14} />
                <Text style={styles.passDetailText}>In: {pass.return}</Text>
              </View>
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
  },
  applyButton: {
    backgroundColor: colors.primary,
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
  passCard: {
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
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  passReason: {
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
  passDetailsRow: {
    gap: 8,
  },
  passDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  passDetailText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
