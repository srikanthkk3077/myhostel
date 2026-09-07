const lightColors = {
  primary: '#2e8451ff',
  primaryBg: '#DCFCE7',
  primaryLight: '#4ADE80',
  secondary: '#10B981',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#d3d7deff',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  success: '#10B981',
  successBg: '#ECFDF5',
  info: '#3B82F6',
  infoBg: '#EFF6FF',
};

const darkColors = {
  primary: '#4ADE80', // Brighter green for dark mode
  primaryBg: '#14532d',
  primaryLight: '#2e8451ff',
  secondary: '#34D399',
  background: '#111827', // Dark background
  surface: '#1F2937', // Slightly lighter dark for cards
  text: '#F9FAFB', // Light text
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  border: '#374151',
  danger: '#F87171',
  dangerBg: '#7F1D1D',
  warning: '#FBBF24',
  warningBg: '#78350F',
  success: '#34D399',
  successBg: '#064E3B',
  info: '#60A5FA',
  infoBg: '#1E3A8A',
};

// TODO: Integrate a ThemeProvider to dynamically swap between lightColors and darkColors using useColorScheme()
export const colors = lightColors;

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, color: colors.text, letterSpacing: -0.5 },
  h3: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, color: colors.textSecondary, lineHeight: 24 },
  caption: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' as const },
  small: { fontSize: 12, color: colors.textTertiary, fontWeight: '500' as const },
};
