import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import {
  ArrowLeft,
  MessageCircle,
  PhoneCall,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function HelpSupportScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      

      <LinearGradient
        colors={['#0F766E', '#0D9488', '#14B8A6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, { height: 240 + insets.top }]}
      >
        <View style={styles.decorativeCircle1} />
      </LinearGradient>

      <View style={[styles.headerTop, { paddingTop: insets.top + spacing.m }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          <View style={styles.contactCard}>
            <View style={styles.iconCircle}>
              <MessageCircle color="#0D9488" size={32} strokeWidth={2} />
            </View>
            <Text style={styles.contactTitle}>How can we help?</Text>
            <Text style={styles.contactDesc}>
              Our support team is available to assist you with any hostel-related issues.
            </Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity activeOpacity={0.9} style={styles.actionBtnWrapper}>
                <LinearGradient
                  colors={['#14B8A6', '#0D9488']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionBtn}
                >
                  <MessageCircle color="#FFFFFF" size={20} strokeWidth={2.5} />
                  <Text style={styles.actionTextMain}>Chat Now</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionBtnSecondary} activeOpacity={0.8}>
                <PhoneCall color="#0D9488" size={20} strokeWidth={2.5} />
                <Text style={styles.actionTextSecondary}>Call Admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqCard}>
            <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
              <View style={styles.faqIconBox}>
                <FileText color="#0D9488" size={20} />
              </View>
              <Text style={styles.faqText}>How to apply for a gate pass?</Text>
              <ChevronRight color={colors.border} size={20} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
              <View style={styles.faqIconBox}>
                <FileText color="#0D9488" size={20} />
              </View>
              <Text style={styles.faqText}>What are the mess timings?</Text>
              <ChevronRight color={colors.border} size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.faqItem} activeOpacity={0.7}>
              <View style={styles.faqIconBox}>
                <FileText color="#0D9488" size={20} />
              </View>
              <Text style={styles.faqText}>How do I change my room?</Text>
              <ChevronRight color={colors.border} size={20} />
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
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
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    paddingTop: spacing.l,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  contactDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
    paddingHorizontal: spacing.m,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.m,
    width: '100%',
  },
  actionBtnWrapper: {
    flex: 1,
  },
  actionBtn: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  actionTextMain: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionTextSecondary: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D9488',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.s,
    letterSpacing: -0.5,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  faqIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  faqText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
});
