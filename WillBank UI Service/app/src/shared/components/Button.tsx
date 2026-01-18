import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { theme } from '../../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/* =========================
   STYLE MAPS
========================= */

const VARIANT_STYLES: Record<
  NonNullable<ButtonProps['variant']>,
  ViewStyle
> = {
  primary: { backgroundColor: theme.colors.primary },
  secondary: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  success: { backgroundColor: theme.colors.success },
  danger: { backgroundColor: theme.colors.danger },
};

const SIZE_STYLES: Record<
  NonNullable<ButtonProps['size']>,
  ViewStyle
> = {
  small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  medium: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  large: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
};

const TEXT_SIZE_STYLES: Record<
  NonNullable<ButtonProps['size']>,
  TextStyle
> = {
  small: { fontSize: theme.typography.sizes.sm },
  medium: { fontSize: theme.typography.sizes.md },
  large: { fontSize: theme.typography.sizes.lg },
};

/* =========================
   COMPONENT
========================= */

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const buttonStyles: StyleProp<ViewStyle> = [
    styles.base,
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    fullWidth ? styles.fullWidth : null,
    disabled || loading ? styles.disabled : null,
    style,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.textBase,
    TEXT_SIZE_STYLES[size],
    variant === 'secondary' ? styles.textSecondary : null,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'secondary'
              ? theme.colors.primary
              : theme.colors.white
          }
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    color: theme.colors.white,
    fontWeight: theme.typography.weights.semibold,
  },
  textSecondary: {
    color: theme.colors.textPrimary,
  },
});
