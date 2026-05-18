import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontFamilies } from '../constants/theme';

interface DataItem {
  num: string;
  title: string;
  desc: string;
}

const ITEMS: DataItem[] = [
  {
    num: '01',
    title: 'Algoritmos de Carga',
    desc: 'Cruzamos seus dados de sono, estresse e nutricionais para gerar o plano de hidratação do dia.',
  },
  {
    num: '02',
    title: 'Micro-Metodologia',
    desc: 'Sugestões de ingestão fracionada de 150ml a cada 20 minutos durante treinos de alta intensidade.',
  },
  {
    num: '03',
    title: 'Relatório Adaptativo',
    desc: 'Ajustes dinâmicos baseados em variações de frequência cardíaca e temperatura corporal.',
  },
];

const DataArchitecture: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>ARQUITETURA DE DADOS</Text>
      <Text style={styles.title}>Interface de{'\n'}Precisão</Text>

      <View style={styles.itemsContainer}>
        {ITEMS.map((item, index) => (
          <View key={item.num} style={styles.item}>
            <View style={styles.numCol}>
              <Text style={styles.numText}>{item.num}</Text>
              {index < ITEMS.length - 1 && <View style={styles.numLine} />}
            </View>
            <View style={styles.textCol}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default DataArchitecture;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s8,
    backgroundColor: colors.background,
  },
  eyebrow: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: spacing.s3,
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 32,
    color: colors.onSurface,
    lineHeight: 38,
    marginBottom: spacing.s8,
  },
  itemsContainer: {
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    gap: spacing.s4,
    minHeight: 80,
  },
  numCol: {
    alignItems: 'center',
    width: 32,
  },
  numText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: spacing.s2,
  },
  numLine: {
    flex: 1,
    width: 1,
    backgroundColor: colors.outlineVariant,
    marginBottom: spacing.s2,
  },
  textCol: {
    flex: 1,
    paddingBottom: spacing.s6,
  },
  itemTitle: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 20,
    marginBottom: spacing.s2,
  },
  itemDesc: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 21,
  },
});