import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontFamilies } from '../constants/theme';

const TAGS = ['HIDRATAÇÃO', 'ELETRÓLITOS', 'PERFORMANCE'] as const;

const LabCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoMark}>
          <Text style={styles.logoChar}>△</Text>
        </View>
        <Text style={styles.title}>Laboratório de{'\n'}Performance</Text>

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>ANÁLISE ATIVA</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressSub}>Protocolo em execução</Text>
            <Text style={styles.progressPct}>74%</Text>
          </View>
        </View>

        <View style={styles.tagsRow}>
          {TAGS.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default LabCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.s6,
    paddingBottom: spacing.s6,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.gray700,
    borderRadius: radius.lg,
    padding: spacing.s6,
  },
  logoMark: {
    marginBottom: spacing.s4,
  },
  logoChar: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 22,
    color: colors.primary,
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 22,
    color: colors.white,
    lineHeight: 28,
    marginBottom: spacing.s5,
  },
  progressSection: {
    marginBottom: spacing.s5,
  },
  progressLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    marginBottom: spacing.s2,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    marginBottom: spacing.s2,
  },
  progressFill: {
    width: '74%',
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressSub: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  progressPct: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 11,
    color: colors.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s2,
  },
  tag: {
    paddingVertical: spacing.s1,
    paddingHorizontal: spacing.s3,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tagText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
  },
});
