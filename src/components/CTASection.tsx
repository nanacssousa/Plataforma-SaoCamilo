import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontFamilies } from '../constants/theme';

const CTASection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pronto para o{'\n'}próximo nível?
      </Text>
      <TouchableOpacity style={styles.button} activeOpacity={0.85}>
        <Text style={styles.buttonText}>COMEÇAR JORNADA CLÍNICA</Text>
      </TouchableOpacity>
      <Text style={styles.disclaimer}>
        Avaliação inicial gratuita · Sem compromisso
      </Text>
    </View>
  );
};

export default CTASection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.s6,
    paddingTop: spacing.s8,
    paddingBottom: spacing.s12,
    backgroundColor: colors.warm,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 32,
    color: colors.onSurface,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: spacing.s8,
  },
  button: {
    backgroundColor: colors.onSurface,
    paddingVertical: spacing.s4,
    paddingHorizontal: spacing.s8,
    borderRadius: radius.xs,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.s4,
  },
  buttonText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
    letterSpacing: 1.2,
    color: colors.white,
    textTransform: 'uppercase',
  },
  disclaimer: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: colors.gray400,
    textAlign: 'center',
  },
});
