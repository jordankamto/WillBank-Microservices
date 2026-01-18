import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'default',
  style 
}) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  success: {
    backgroundColor: '#d1fae5',
  },
  danger: {
    backgroundColor: '#fee2e2',
  },
  warning: {
    backgroundColor: '#fef3c7',
  },
  info: {
    backgroundColor: '#dbeafe',
  },
  default: {
    backgroundColor: theme.colors.gray100,
  },
  text: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
  },
  text_success: {
    color: '#065f46',
  },
  text_danger: {
    color: '#991b1b',
  },
  text_warning: {
    color: '#92400e',
  },
  text_info: {
    color: '#1e40af',
  },
  text_default: {
    color: theme.colors.gray700,
  },
});