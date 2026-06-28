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
  UserCheck,
  CreditCard,
  Coffee,
  Wrench,
  Home,
  Wallet,
  Bell,
  Shield,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AllServicesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const services = [
    { id: '1', title: 'New Admission', icon: UserCheck, color: colors.primary, screen: 'RegisterStudent', stack: 'StudentsTab' },
    { id: '2', title: 'Collect Fees', icon: CreditCard, color: colors.success, screen: 'CollectFee', stack: 'FeesTab' },
    { id: '3', title: 'Notice Board', icon: Bell, color: '#3B82F6', screen: 'NoticeBoard', stack: 'DashboardTab' },
    { id: '4', title: 'Visitor Log', icon: Shield, color: '#14B8A6', screen: 'VisitorsList', stack: 'DashboardTab' },
    { id: '5', title: 'Mess Menu', icon: Coffee, color: colors.warning, screen: 'MessMenu', stack: 'DashboardTab' },
    { id: '6', title: 'Maintenance', icon: Wrench, color: colors.danger, screen: 'ComplaintsList', stack: 'DashboardTab' },
    { id: '7', title: 'Add Room', icon: Home, color: colors.info, screen: 'AddRoom', stack: 'RoomsTab' },
    { id: '8', title: 'Expense Track', icon: Wallet, color: '#8B5CF6', screen: 'ExpenseTracking', stack: 'FeesTab' },
  ];

  const handlePress = (service: any) => {
    navigation.navigate(service.stack, { screen: service.screen });
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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>All Services</Text>
            <Text style={styles.headerSubtitle}>Quick Actions</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              activeOpacity={0.8}
              onPress={() => handlePress(service)}>
              <View style={[styles.iconBox, { backgroundColor: service.color }]}>
                <service.icon color="#FFFFFF" size={24} strokeWidth={2.5} />
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  scrollContent: {
    padding: spacing.l,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.l,
  },
  serviceCard: {
    width: '31%', // 3 columns
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.m,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
});
