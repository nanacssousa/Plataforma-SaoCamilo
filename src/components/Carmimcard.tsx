// Coloque em: components/CarmimCard.tsx
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors } from '../constants/theme';

interface CardProps extends ViewProps {
  level?: 'low' | 'default' | 'high' | 'highest';
}

export const CarmimCard: React.FC<CardProps> = ({ level = 'default', style, children, ...props }) => {
  const getBackgroundColor = () => {
    switch (level) {
      case 'low': return colors.surfaceContainerLow;
      case 'high': return colors.surfaceContainerHigh;
      case 'highest': return colors.surfaceContainerHighest;
      default: return colors.surfaceContainer;
    }
  };

  return (
    <View 
      style={[styles.card, { backgroundColor: getBackgroundColor() }, style]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
});