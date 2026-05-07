import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontFamilies } from '../constants/theme';

const MonitoringCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>📈</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.realtimeLabel}>TEMPO REAL</Text>
            <Text style={styles.title}>Monitoramento{'\n'}Preditivo</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Antecipe a fadiga muscular através da análise de bioimpedância e taxas
          de sudorese capturadas via wearable.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>22%</Text>
            <Text style={styles.statLabel}>MENOR RISCO</Text>
            <Text style={styles.statSub}>Câimbra e M.</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15min</Text>
            <Text style={styles.statLabel}>ANTECIPAÇÃO</Text>
            <Text style={styles.statSub}>Acelerada</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MonitoringCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.s6,
    paddingBottom: spacing.s6,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.s6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.s4,
    gap: spacing.s3,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  headerText: {
    flex: 1,
  },
  realtimeLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 20,
    color: colors.onSurface,
    lineHeight: 24,
  },
  description: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 21,
    marginBottom: spacing.s5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.s4,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 26,
    color: colors.primary,
    lineHeight: 30,
  },
  statLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statSub: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: colors.gray400,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.outlineVariant,
  },
});
