import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Camera,
  Wrench,
  Zap,
  Droplets,
  Wifi,
  MoreHorizontal,
} from 'lucide-react-native';
import { colors, spacing } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { createComplaint } from '../../service/complaintService';

export default function RaiseComplaintScreen({ navigation }: any) {
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

  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    });
    if (result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri || null);
      if (result.assets[0].base64) {
        setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    }
  };

  const categories = [
    { id: 'electrical', name: 'Electrical', icon: Zap },
    { id: 'plumbing', name: 'Plumbing', icon: Droplets },
    { id: 'wifi', name: 'Internet', icon: Wifi },
    { id: 'carpentry', name: 'Carpentry', icon: Wrench },
    { id: 'other', name: 'Other', icon: MoreHorizontal },
  ];

  const handleSubmit = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a complaint title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    setSubmitting(true);

    const categoryMapping: { [key: string]: string } = {
      electrical: 'Electrical',
      plumbing: 'Plumbing',
      wifi: 'Internet',
      carpentry: 'Carpentry',
      other: 'Other',
    };
    const categoryName = categoryMapping[selectedCategory] || 'Other';

    try {
      const response = await createComplaint({
        title: title.trim(),
        category: categoryName,
        description: description.trim(),
        image: base64Image,
      });

      if (response.status === 201 && response.data?.success) {
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to submit complaint');
      }
    } catch (error: any) {
      console.error('Submit complaint error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
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
        <Text style={styles.headerTitle}>Raise Complaint</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          
          <Text style={styles.sectionTitle}>Select Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesList}
            style={styles.categoriesWrapper}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(cat.id)}>
                  <Icon 
                    color={isSelected ? '#FFFFFF' : '#6B7280'} 
                    size={28} 
                    strokeWidth={isSelected ? 2.5 : 2}
                  />
                  <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Issue Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Complaint Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. AC not cooling"
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the issue in detail..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <Text style={styles.inputLabel}>Add Photo (Optional)</Text>
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={handleImagePick}>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.uploadTextWhite}>Tap to change photo</Text>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.uploadIconCircle}>
                    <Camera color="#7C3AED" size={28} strokeWidth={2} />
                  </View>
                  <Text style={styles.uploadText}>Tap to take a photo or choose from gallery</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.m }]}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          <LinearGradient
            colors={submitting ? ['#9CA3AF', '#6B7280'] : ['#7C3AED', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: spacing.m,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.l,
    paddingHorizontal: spacing.l,
    letterSpacing: -0.5,
  },
  categoriesWrapper: {
    marginBottom: spacing.xl,
  },
  categoriesList: {
    paddingHorizontal: spacing.l,
    gap: spacing.m,
  },
  categoryCard: {
    width: 100,
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 12,
  },
  categoryNameActive: {
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: spacing.xl,
    marginHorizontal: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xl,
    letterSpacing: -0.5,
  },
  inputContainer: {
    marginBottom: spacing.l,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.l,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  textArea: {
    height: 140,
    paddingTop: 16,
  },
  uploadBox: {
    backgroundColor: '#F5F3FF',
    borderWidth: 2,
    borderColor: '#DDD6FE',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  uploadIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  uploadText: {
    fontSize: 14,
    color: '#6D28D9',
    fontWeight: '600',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTextWhite: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
