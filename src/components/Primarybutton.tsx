// Coloque em: components/PrimaryButton.tsx
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontFamilies } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export const PrimaryButton: React.FC<ButtonProps> = ({ title, onPress }) => (
  <Pressable 
    style={({ pressed }) => [
      styles.button,
      { backgroundColor: pressed ? colors.primary : colors.primaryContainer }
    ]}
    onPress={onPress}
  >
    <Text style={styles.text}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginVertical: 8,
  },
  text: {
    color: colors.white,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 16,
    letterSpacing: 0.5,
  }
});