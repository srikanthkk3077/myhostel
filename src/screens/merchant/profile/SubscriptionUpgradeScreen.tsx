import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹499',
    period: '/ month',
    description: 'Perfect for small hostels starting out.',
    icon: ShieldCheck,
    color: '#3B82F6', // Info Blue
    features: [
      'Up to 50 members',
      'Basic fee tracking',
      'Standard support',
      '1 Admin account',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹999',
    period: '/ month',
    description: 'For growing hostels that need advanced tools.',
    icon: Sparkles,
    color: '#10B981', // Emerald Green
    popular: true,
    features: [
      'Up to 150 members',
      'Advanced fee analytics',
      'Priority support',
      '2 Admin accounts',
      'Custom notice boards',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹1,999',
    period: '/ month',
    description: 'For large hostels with multi-branch needs.',
    icon: Zap,
    color: '#8B5CF6', // Purple
    features: [
      'Unlimited members',
      'Multi-Branch Support',
      'Priority 24/7 support',
      'Multiple admin accounts',
      'Custom notice boards',
    ],
  },
];

export default function SubscriptionUpgradeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const handleCheckout = () => {
    const price = selectedPlan === 'premium' ? '₹1,999' : selectedPlan === 'standard' ? '₹999' : '₹499';
    Alert.alert(
      'Secure Payment Gateway',
      `Proceeding to pay ${price}/month via Stripe/Razorpay. Do you want to complete this test payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            // Simulate processing
            setTimeout(() => {
              Alert.alert(
                'Payment Successful 🎉',
                'Your subscription has been activated successfully! Welcome to premium features.',
                [
                  { text: 'Go to Dashboard', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] }) }
                ]
              );
            }, 1500);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Hero Header */}
      <LinearGradient
        colors={[colors.text, '#1F2937']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { paddingTop: insets.top }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Upgrade Your Experience</Text>
          <Text style={styles.heroSubtitle}>
            Your free trial has ended. Choose a plan to continue managing your hostel effortlessly.
          </Text>
        </View>
      </LinearGradient>

      {/* Plans List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.plansContainer}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const Icon = plan.icon;

            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.9}
                onPress={() => setSelectedPlan(plan.id)}
                style={[
                  styles.planCard,
                  isSelected && { borderColor: plan.color, borderWidth: 2, elevation: 8 },
                ]}
              >
                {plan.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <View style={styles.planHeaderLeft}>
                    <View style={[styles.planIconBg, { backgroundColor: `${plan.color}15` }]}>
                      <Icon color={plan.color} size={24} strokeWidth={2.5} />
                    </View>
                    <View>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planDesc}>{plan.description}</Text>
                    </View>
                  </View>
                  <View style={[styles.radioCircle, isSelected && { borderColor: plan.color }]}>
                    {isSelected && <View style={[styles.radioDot, { backgroundColor: plan.color }]} />}
                  </View>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{plan.price}</Text>
                  <Text style={styles.period}>{plan.period}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.featuresList}>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <CheckCircle2 color={plan.color} size={20} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || spacing.l }]}>
        <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Continue to Payment</Text>
        </TouchableOpacity>
        <Text style={styles.secureText}>🔒 Secure payment via Razorpay / Stripe</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background
  },
  headerBackground: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.m,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContent: {
    padding: spacing.l,
    marginVertical: 10,
  },
  plansContainer: {
    gap: spacing.l,
    marginBottom: 30
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.l,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  planHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    flex: 1,
  },
  planIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  planDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: '90%',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.m,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  period: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.m,
  },
  featuresList: {
    gap: spacing.s,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  checkoutBtn: {
    backgroundColor: colors.text, // Dark button for premium feel
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secureText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
