// constants/theme.ts
// AquaPulse Design System
// Deep-ocean dark theme with cyan/teal accents

import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export const SCREEN = {
  width: screenWidth,
  height: screenHeight,
  isTablet,
};

export const Colors = {
  // Core Background
  background: '#0A1628',
  backgroundSecondary: '#0D1E35',
  backgroundCard: '#0F2240',
  backgroundCardAlt: '#112647',
  backgroundElevated: '#162E4D',

  // Accent / Brand
  accent: '#00D4FF',
  accentDark: '#009BBB',
  accentMuted: 'rgba(0, 212, 255, 0.15)',
  teal: '#00B4D8',
  tealDark: '#0077A8',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8BA0B8',
  textMuted: '#4A6380',
  textAccent: '#00D4FF',
  textWarning: '#FFB020',
  textDanger: '#FF4D6A',
  textSuccess: '#00E676',

  // Status Colors
  statusOnline: '#00E676',
  statusOffline: '#FF4D6A',
  statusWarning: '#FFB020',
  statusSyncing: '#00D4FF',
  statusInactive: '#4A6380',

  // Severity
  severityInfo: '#00D4FF',
  severityWarning: '#FFB020',
  severityError: '#FF4D6A',
  severityCritical: '#FF1744',

  // Chart Colors
  chartPrimary: '#00D4FF',
  chartSecondary: '#00B4D8',
  chartTertiary: '#0077A8',
  chartGrid: 'rgba(139, 160, 184, 0.1)',

  // Signal
  signalExcellent: '#00E676',
  signalGood: '#69F0AE',
  signalFair: '#FFB020',
  signalPoor: '#FF6D00',
  signalLost: '#FF4D6A',

  // Misc
  border: 'rgba(0, 212, 255, 0.12)',
  borderStrong: 'rgba(0, 212, 255, 0.25)',
  shadow: 'rgba(0, 212, 255, 0.08)',
  overlay: 'rgba(10, 22, 40, 0.85)',
  white: '#FFFFFF',
  transparent: 'transparent',

  // Gradients (start/end pairs)
  gradientPrimary: ['#0A1628', '#0D2843'] as const,
  gradientCard: ['#0F2240', '#0A1A30'] as const,
  gradientAccent: ['#00D4FF', '#0077A8'] as const,
  gradientDanger: ['#FF4D6A', '#C62828'] as const,
  gradientSuccess: ['#00E676', '#00897B'] as const,
  gradientWarning: ['#FFB020', '#E65100'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
  hero: 44,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  card: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardStrong: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
};

export const TabletColumns = {
  feederGrid: isTablet ? 2 : 1,
  alertGrid: isTablet ? 2 : 1,
  statsGrid: isTablet ? 4 : 2,
};
