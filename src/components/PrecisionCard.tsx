import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontFamilies } from '../constants/theme';

const PrecisionCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.dropIcon}>
          <Text style={styles.dropText}>💧</Text>
        </View>
        <Text style={styles.title}>Precisão{'\n'}H2O-Elite</Text>
        <Text style={styles.description}>
          Nossa metodologia proprietária calcula a densidade de minerais
          necessária para cada mililitro de sudorese capturada via IMC e
          intensidade de treino.
        </Text>
        <TouchableOpacity style={styles.link} activeOpacity={0.7}>
          <Text style={styles.linkText}>VER METODOLOGIA →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrecisionCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.s6,
    paddingBottom: spacing.s6,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    padding: spacing.s6,
  },
  dropIcon: {
    marginBottom: spacing.s4,
  },
  dropText: {
    fontSize: 28,
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 24,
    color: colors.white,
    lineHeight: 30,
    marginBottom: spacing.s3,
  },
  description: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 21,
    marginBottom: spacing.s5,
  },
  link: {
    paddingTop: spacing.s4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  linkText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.white,
    textTransform: 'uppercase',
  },
});
