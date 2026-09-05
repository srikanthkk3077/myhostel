import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Animated,
  Platform,
  Share,
} from 'react-native';
import {
  ArrowLeft,
  Download,
  Share2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Building,
} from 'lucide-react-native';
import { colors, spacing } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PoliciesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'terms' | 'rules' | 'privacy' | 'refund'>('terms');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const scrollViewRef = useRef<ScrollView>(null);

  const policySections = [
    { id: 'terms', title: 'Terms of Service', page: 1 },
    { id: 'rules', title: 'Hostel Rules', page: 2 },
    { id: 'privacy', title: 'Privacy Policy', page: 3 },
    { id: 'refund', title: 'Refund & Dues', page: 4 },
  ];

  const handleDownloadPDF = () => {
    Alert.alert(
      'Download PDF',
      'MyHostel_Official_Merchant_Policies_v2.4.pdf has been saved to your Downloads folder.',
      [
        {
          text: 'Open File',
          onPress: () => console.log('Open PDF clicked'),
        },
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  const handleSharePDF = async () => {
    try {
      await Share.share({
        message: 'Check out the official MyHostel Merchant & Resident Policies document: https://myhostel.app/policies.pdf',
        title: 'MyHostel Official Policies PDF',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrintPDF = () => {
    Alert.alert('Print Document', 'Preparing MyHostel_Policies.pdf for printing...');
  };

  const handleZoomIn = () => {
    if (zoomLevel < 140) setZoomLevel(prev => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 80) setZoomLevel(prev => prev - 10);
  };

  const handleSelectTab = (tabId: 'terms' | 'rules' | 'privacy' | 'refund', page: number) => {
    setActiveTab(tabId);
    setCurrentPage(page);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      
      {/* PDF Header / Action Bar */}
      <View style={[styles.pdfHeader, { paddingTop: insets.top + spacing.xs }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft color="#FFFFFF" size={22} strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.documentTitleBox}>
            <View style={styles.pdfBadge}>
              <Text style={styles.pdfBadgeText}>PDF</Text>
            </View>
            <View>
              <Text style={styles.documentTitle} numberOfLines={1}>
                MyHostel_Policies_v2.4.pdf
              </Text>
              <Text style={styles.documentSub}>Official Policy Manual • 1.2 MB</Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleSharePDF} activeOpacity={0.7}>
              <Share2 color="#FFFFFF" size={20} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleDownloadPDF} activeOpacity={0.7}>
              <Download color="#4ADE80" size={20} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Zoom & Page Toolbar */}
        <View style={styles.toolbarRow}>
          <View style={styles.pageIndicator}>
            <TouchableOpacity
              disabled={currentPage <= 1}
              onPress={() => {
                const prev = Math.max(1, currentPage - 1);
                const section = policySections.find(s => s.page === prev);
                if (section) handleSelectTab(section.id as any, prev);
              }}
              style={{ opacity: currentPage <= 1 ? 0.4 : 1 }}
            >
              <ChevronLeft color="#94A3B8" size={18} />
            </TouchableOpacity>
            <Text style={styles.pageText}>Page {currentPage} of 4</Text>
            <TouchableOpacity
              disabled={currentPage >= 4}
              onPress={() => {
                const next = Math.min(4, currentPage + 1);
                const section = policySections.find(s => s.page === next);
                if (section) handleSelectTab(section.id as any, next);
              }}
              style={{ opacity: currentPage >= 4 ? 0.4 : 1 }}
            >
              <ChevronRight color="#94A3B8" size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut}>
              <ZoomOut color="#E2E8F0" size={16} />
            </TouchableOpacity>
            <Text style={styles.zoomText}>{zoomLevel}%</Text>
            <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn}>
              <ZoomIn color="#E2E8F0" size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.zoomBtn, { marginLeft: 8 }]} onPress={handlePrintPDF}>
              <Printer color="#E2E8F0" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Document Section Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {policySections.map((sec) => (
            <TouchableOpacity
              key={sec.id}
              style={[styles.tabItem, activeTab === sec.id && styles.activeTabItem]}
              onPress={() => handleSelectTab(sec.id as any, sec.page)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabItemText, activeTab === sec.id && styles.activeTabItemText]}>
                {sec.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* PDF Viewport (Gray background simulating PDF reader canvas) */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.pdfCanvas}
        contentContainerStyle={styles.pdfCanvasContent}
        showsVerticalScrollIndicator={true}
      >
        {/* PDF Page Sheet */}
        <View style={[styles.pdfPageSheet, { transform: [{ scale: zoomLevel / 100 }] }]}>
          
          {/* Header Seal & Watermark Header */}
          <View style={styles.pdfDocumentHeader}>
            <View style={styles.brandHeaderLeft}>
              <Building color={colors.primary} size={28} strokeWidth={2.5} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.brandTitle}>MyHostel ERP</Text>
                <Text style={styles.brandSubtitle}>Management Compliance & Policy Document</Text>
              </View>
            </View>
            <View style={styles.verifiedStamp}>
              <ShieldCheck color="#16A34A" size={16} />
              <Text style={styles.verifiedStampText}>VERIFIED PDF</Text>
            </View>
          </View>

          <View style={styles.pdfDivider} />

          <View style={styles.docMetaRow}>
            <Text style={styles.docMetaText}><Text style={{ fontWeight: '700' }}>Doc Ref:</Text> MH-POL-2024-REV2</Text>
            <Text style={styles.docMetaText}><Text style={{ fontWeight: '700' }}>Effective Date:</Text> Jan 01, 2024</Text>
          </View>

          {/* Policy Section Content */}
          {activeTab === 'terms' && (
            <View style={styles.policyContentBox}>
              <View style={styles.sectionHeadingRow}>
                <FileText color={colors.primary} size={22} />
                <Text style={styles.sectionHeadingText}>1.0 Merchant Terms of Service</Text>
              </View>
              
              <Text style={styles.paragraphBold}>1.1 Platform License & Authorization</Text>
              <Text style={styles.paragraph}>
                By registering as a hostel merchant or property manager on the MyHostel platform, you are granted a non-exclusive, non-transferable right to access and utilize the hostel management software, tenant ledger, room allocation tools, and payment processing services.
              </Text>

              <Text style={styles.paragraphBold}>1.2 Merchant Responsibilities</Text>
              <Text style={styles.paragraph}>
                • Maintain accurate room tariffs, availability, and tenant information.{'\n'}
                • Ensure all financial records, fee collections, and receipts issued through the platform strictly match physical operations.{'\n'}
                • Maintain compliance with local municipal hostel regulations, fire safety standards, and occupancy limits.
              </Text>

              <Text style={styles.paragraphBold}>1.3 Fee Settlement & Commission</Text>
              <Text style={styles.paragraph}>
                Online fee collections processed via integrated payment gateways shall be settled into the merchant's registered bank account within T+1 settlement cycles, subject to applicable gateway transaction fees.
              </Text>

              <Text style={styles.paragraphBold}>1.4 Account Termination</Text>
              <Text style={styles.paragraph}>
                MyHostel reserves the right to suspend or terminate merchant access in cases of fraudulent ledger entries, unauthorized tenant data exposure, or repeated non-compliance with platform standards.
              </Text>
            </View>
          )}

          {activeTab === 'rules' && (
            <View style={styles.policyContentBox}>
              <View style={styles.sectionHeadingRow}>
                <BookOpen color="#8B5CF6" size={22} />
                <Text style={styles.sectionHeadingText}>2.0 Standard Hostel Conduct & Rules</Text>
              </View>

              <Text style={styles.paragraphBold}>2.1 Resident Conduct & Quiet Hours</Text>
              <Text style={styles.paragraph}>
                Quiet hours must be strictly observed across all hostel premises between 10:00 PM and 06:00 AM. Loud music, noise disturbances, or unauthorized gatherings during these hours are strictly prohibited.
              </Text>

              <Text style={styles.paragraphBold}>2.2 Visitor & Guest Policy</Text>
              <Text style={styles.paragraph}>
                • Visitors are allowed in common lobby areas only between 09:00 AM and 07:00 PM.{'\n'}
                • No overnight external guests are permitted inside resident rooms without prior written merchant approval and entry register log.
              </Text>

              <Text style={styles.paragraphBold}>2.3 Property & Maintenance Safety</Text>
              <Text style={styles.paragraph}>
                Residents are responsible for preserving hostel property, furniture, and electrical fittings. Any damages caused by negligence shall be deducted directly from the resident's security deposit.
              </Text>
            </View>
          )}

          {activeTab === 'privacy' && (
            <View style={styles.policyContentBox}>
              <View style={styles.sectionHeadingRow}>
                <Lock color="#16A34A" size={22} />
                <Text style={styles.sectionHeadingText}>3.0 Privacy & Data Protection Policy</Text>
              </View>

              <Text style={styles.paragraphBold}>3.1 Data Collection & Encryption</Text>
              <Text style={styles.paragraph}>
                All personal identification details, contact numbers, emergency contacts, and payment records collected on MyHostel are encrypted using AES-256 bits at rest and TLS 1.3 in transit.
              </Text>

              <Text style={styles.paragraphBold}>3.2 Tenant Privacy Safeguards</Text>
              <Text style={styles.paragraph}>
                Hostel merchants are legally bound not to disclose, export, or monetize tenant personal data to third-party marketing entities. Resident records may only be accessed for official hostel administration and law enforcement verification.
              </Text>

              <Text style={styles.paragraphBold}>3.3 Security Audit & Compliance</Text>
              <Text style={styles.paragraph}>
                System access logs and ledger changes are recorded permanently for audit trail integrity and safety verification.
              </Text>
            </View>
          )}

          {activeTab === 'refund' && (
            <View style={styles.policyContentBox}>
              <View style={styles.sectionHeadingRow}>
                <CheckCircle2 color="#3B82F6" size={22} />
                <Text style={styles.sectionHeadingText}>4.0 Fee Refund & Security Deposit Policy</Text>
              </View>

              <Text style={styles.paragraphBold}>4.1 Security Deposit Refund Rules</Text>
              <Text style={styles.paragraph}>
                Security deposits shall be refunded to residents within 7 working days of checkout, after deducting any pending utility bills, damages, or unpaid monthly dues.
              </Text>

              <Text style={styles.paragraphBold}>4.2 Notice Period Requirement</Text>
              <Text style={styles.paragraph}>
                Residents intending to vacate must submit an official checkout request at least 30 days in advance via the app. Failure to provide required notice may result in forfeiture of one month's rent.
              </Text>

              <Text style={styles.paragraphBold}>4.3 Subscription Refunds for Merchants</Text>
              <Text style={styles.paragraph}>
                Merchant software subscription fees paid for monthly or annual tiers are non-refundable once activated.
              </Text>
            </View>
          )}

          <View style={styles.pdfDivider} />

          {/* Official Footer / Stamp */}
          <View style={styles.pdfFooter}>
            <View style={styles.stampBox}>
              <View style={styles.stampCircle}>
                <ShieldCheck color="#2563EB" size={20} />
              </View>
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.stampTextTitle}>MYHOSTEL COMPLIANCE</Text>
                <Text style={styles.stampTextSub}>Digitally Signed & Validated</Text>
              </View>
            </View>
            <Text style={styles.pdfPageFooterText}>Page {currentPage} of 4 • Confidential</Text>
          </View>

        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Download Banner */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.bottomBarLeft}>
          <FileText color={colors.primary} size={22} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.bottomBarTitle}>Official Policy Document</Text>
            <Text style={styles.bottomBarSub}>Format: PDF • Version 2.4</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadPDF} activeOpacity={0.85}>
          <Download color="#FFFFFF" size={18} strokeWidth={2.5} />
          <Text style={styles.downloadBtnText}>Download PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  pdfHeader: {
    backgroundColor: '#1E293B',
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentTitleBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.s,
  },
  pdfBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  pdfBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  documentTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  documentSub: {
    color: '#94A3B8',
    fontSize: 11,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zoomBtn: {
    padding: 4,
    backgroundColor: '#1E293B',
    borderRadius: 4,
  },
  zoomText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  tabsScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#334155',
    marginRight: 8,
  },
  activeTabItem: {
    backgroundColor: colors.primary,
  },
  tabItemText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabItemText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pdfCanvas: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  pdfCanvasContent: {
    padding: spacing.m,
    alignItems: 'center',
  },
  pdfPageSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 520,
  },
  pdfDocumentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  verifiedStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  verifiedStampText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '800',
  },
  pdfDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: spacing.m,
  },
  docMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
    backgroundColor: '#F8FAFC',
    padding: spacing.s,
    borderRadius: 6,
  },
  docMetaText: {
    fontSize: 11,
    color: '#475569',
  },
  policyContentBox: {
    marginVertical: spacing.xs,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.m,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary + '30',
    paddingBottom: 6,
  },
  sectionHeadingText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  paragraphBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: spacing.s,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginBottom: spacing.s,
  },
  pdfFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stampBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stampCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stampTextTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E40AF',
  },
  stampTextSub: {
    fontSize: 9,
    color: '#64748B',
  },
  pdfPageFooterText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bottomBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBarTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  bottomBarSub: {
    fontSize: 11,
    color: '#64748B',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.m,
    paddingVertical: 10,
    borderRadius: 10,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
