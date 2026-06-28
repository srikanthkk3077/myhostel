export const colors = {
  primary: '#4F46E5',
  primaryBg: '#EEF2FF',
  primaryLight: '#818CF8',
  secondary: '#10B981',
  background: '#F9FAFB', // Much lighter, cleaner background
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F3F4F6', // Softer border
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  success: '#10B981',
  successBg: '#ECFDF5',
  info: '#3B82F6',
  infoBg: '#EFF6FF',
};

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
