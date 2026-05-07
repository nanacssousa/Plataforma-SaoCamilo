import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontFamilies } from '../constants/theme';

const ScienceSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          A Ciência por trás da{'\n'}Hidratação
        </Text>
        <Text style={styles.body}>
          H2O-Elite não é sobre beber água. É sobre o equilíbrio exato entre
          eletrólitos, volume e tempo metabólico.
        </Text>
      </View>
      <Text style={styles.decorNumber}>01.0</Text>
    </View>
  );
};

export default ScienceSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s8,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    paddingRight: spacing.s4,
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 24,
    color: colors.onSurface,
    lineHeight: 30,
    marginBottom: spacing.s4,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  decorNumber: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 52,
    color: colors.outlineVariant,
    lineHeight: 56,
    marginTop: spacing.s2,
    opacity: 0.7,
  },
});
