import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  padding = theme.spacing.md,
}) => {
  return (
    <View style={[styles.card, { padding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
});