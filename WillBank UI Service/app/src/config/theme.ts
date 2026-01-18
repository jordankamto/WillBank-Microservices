/**
 * Thème global de l'application WillBank Mobile
 * Design system cohérent avec l'application web
 */

export const theme = {
  colors: {
    // Couleurs principales (gradient WillBank)
    primary: '#667eea',
    primaryDark: '#764ba2',
    primaryLight: '#8b9ef7',
    
    // Couleurs secondaires
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Couleurs neutres
    white: '#ffffff',
    black: '#000000',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    
    // Couleurs de fond
    background: '#f9fafb',
    surface: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Couleurs de texte
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textDisabled: '#9ca3af',
    textInverse: '#ffffff',
    
    // Couleurs de bordure
    border: '#e5e7eb',
    borderFocus: '#667eea',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export type Theme = typeof theme;