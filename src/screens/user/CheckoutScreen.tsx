import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { payFee } from '../../service/merchant';

export default function CheckoutScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { amount = 12500 } = route.params || {};

  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const response = await payFee({ amount, paymentMethod: 'UPI' });
      if (response.status === 201 && response.data?.success) {
        const feeId = response.data.data._id;
        navigation.navigate('Receipt', { feeId });
      } else {
        Alert.alert('Payment Failed', response.data?.message || 'Transaction could not be completed.');
      }
    } catch (error: any) {
      console.error('Failed to checkout', error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong during payment.');
    } finally {
      setIsLoading(false);
    }
  };

  // Breakdown calculations
  const messFee = Math.min(2500, amount);
  const roomRent = amount - messFee;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 260 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
      </LinearGradient>

      <View style={[styles.headerTop, { paddingTop: insets.top + spacing.m }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Bill Summary</Text>
            
            {roomRent > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billItem}>Room Rent</Text>
                <Text style={styles.billAmount}>₹{roomRent.toLocaleString('en-IN')}</Text>
              </View>
            )}
            {messFee > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billItem}>Mess Fee</Text>
                <Text style={styles.billAmount}>₹{messFee.toLocaleString('en-IN')}</Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalAmount}>₹{amount.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.methodsCard}>
            <TouchableOpacity style={styles.methodItem} activeOpacity={0.7}>
              <View style={styles.radioOuter}>
                <View style={styles.radioInner} />
              </View>
              <Text style={styles.methodText}>UPI (GPay, PhonePe)</Text>
            </TouchableOpacity>
            
            <View style={styles.methodDivider} />
            
            <TouchableOpacity style={styles.methodItem} activeOpacity={0.7}>
              <View style={styles.radioOuterEmpty} />
              <Text style={styles.methodText}>Credit / Debit Card</Text>
            </TouchableOpacity>

            <View style={styles.methodDivider} />
            
            <TouchableOpacity style={styles.methodItem} activeOpacity={0.7}>
              <View style={styles.radioOuterEmpty} />
              <Text style={styles.methodText}>Net Banking</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.secureBadge}>
            <ShieldCheck color={colors.success} size={16} strokeWidth={2.5} />
            <Text style={styles.secureText}>100% Secure Payment</Text>
          </View>

        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.m }]}>
        <TouchableOpacity activeOpacity={0.9} onPress={handlePay} disabled={isLoading}>
          <LinearGradient
            colors={isLoading ? [colors.textSecondary, colors.textSecondary] : ['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payButton}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <CreditCard color="#FFFFFF" size={20} strokeWidth={2.5} />
                <Text style={styles.payButtonText}>Pay ₹{amount.toLocaleString('en-IN')}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -80,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s,
    marginBottom: spacing.l,
    zIndex: 10,
  },
  backButton: {
    padding: spacing.s,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: spacing.l,
    paddingBottom: 40,
    paddingTop: spacing.m,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  billTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.l,
    letterSpacing: -0.5,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  billItem: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    borderStyle: 'dashed',
    marginVertical: spacing.l,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: -1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.s,
    letterSpacing: -0.5,
  },
  methodsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  radioOuterEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.m,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  methodDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 40,
  },
  secureBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.s,
  },
  secureText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  payButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
