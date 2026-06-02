/**
 * Design tokens — paleta cálida tipo papel, verde bosque, terracota.
 * Inspirado en principios Impeccable (sin gradientes púrpura, sin Inter).
 */

export const colors = {
  paper: '#F7F2EB',
  paperDark: '#EDE4D8',
  surface: '#FFFCF7',
  ink: '#2C2416',
  inkMuted: '#6B5E4E',
  inkLight: '#9A8B78',
  primary: '#2D5A3D',
  primaryDark: '#1E3D29',
  primaryLight: '#E8F0EA',
  accent: '#C4694A',
  accentDark: '#A35235',
  accentLight: '#F5E8E3',
  white: '#FFFFFF',
  success: '#3D7A4A',
  successLight: '#E6F2E8',
  error: '#B83232',
  errorLight: '#F9E8E8',
  warning: '#C4894A',
  border: '#D4C9BA',
  borderFocus: '#2D5A3D',
  overlay: 'rgba(44, 36, 22, 0.04)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 999,
};

export const typography = {
  fontFamily: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    bold: 'DMSans_700Bold',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.65,
  },
};

export const shadows = {
  sm: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
};

export default { colors, spacing, radius, typography, shadows };
