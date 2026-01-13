export const Colors = {
  // Primary Colors
  primary: '#5DCED9',
  primaryDark: '#4AB8C4',
  primaryLight: '#F0F9FA',
  
  // Accent Colors
  accent: '#FF9800',
  accentLight: '#FFF4E6',
  
  // Neutral Colors
  white: '#FFFFFF',
  background: '#F5F5F5',
  
  // Text Colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Status Colors
  success: '#4CAF50',
  error: '#FF5252',
  warning: '#FFC107',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  infoDark: '#1565C0',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Message Colors
  userMessage: '#FF9800',
  assistantMessage: '#F0F0F0',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  circle: 9999,
} as const;

export const FontSizes = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 32,
} as const;

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const IconSizes = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  huge: 40,
} as const;

export const Layout = {
  headerHeight: 64,
  tabBarHeight: 64,
  tabBarHeightIOS: 88,
  maxContentWidth: 600,
} as const;