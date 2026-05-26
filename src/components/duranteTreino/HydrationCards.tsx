import { fontFamilies } from "@/constants/theme";
import { META_ML } from "@/hooks/useDuranteTreino";
import { formatMl } from "@/utils/formatters";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HydrationCardsProps {
  total: number;
  goalReached: boolean;
}

export function HydrationCards({ total, goalReached }: HydrationCardsProps) {
  const remaining = Math.max(0, META_ML - total);

  return (
    <View style={styles.row}>
      {/* Ingestão total */}
      <View style={styles.cardRed}>
        <Text style={styles.labelRed}>INGESTÃO TOTAL</Text>
        <Text style={styles.valueRed}>{formatMl(total)}</Text>
        <Text style={styles.subRed}>acumulado</Text>
      </View>

      {/* Meta restante */}
      <View style={[styles.cardMeta, goalReached && styles.cardMetaGoal]}>
        <Text style={[styles.labelMeta, goalReached && styles.labelMetaGoal]}>
          META RESTANTE
        </Text>
        {goalReached ? (
          <Text style={styles.goalText}>Meta concluída 🎉</Text>
        ) : (
          <>
            <Text style={styles.valueMeta}>{formatMl(remaining)}</Text>
            <Text style={styles.subMeta}>de {formatMl(META_ML)}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  cardRed: {
    flex: 1,
    backgroundColor: "#f6e1e1",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ecc8c8",
  },
  labelRed: {
    color: "#a40000",
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  valueRed: {
    color: "#a40000",
    fontSize: 28,
    fontFamily: fontFamilies.headlineBold,
    lineHeight: 30,
  },
  subRed: {
    color: "#c06060",
    fontSize: 12,
    fontFamily: fontFamilies.technical,
    marginTop: 4,
  },
  cardMeta: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e8d0d0",
  },
  cardMetaGoal: {
    backgroundColor: "#e8f5e9",
    borderColor: "#a5d6a7",
  },
  labelMeta: {
    color: "#a40000",
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  labelMetaGoal: {
    color: "#2e7d32",
  },
  goalText: {
    color: "#2e7d32",
    fontSize: 18,
    fontFamily: fontFamilies.headlineBold,
    lineHeight: 22,
  },
  valueMeta: {
    color: "#7b1a1a",
    fontSize: 28,
    fontFamily: fontFamilies.headlineBold,
    lineHeight: 30,
  },
  subMeta: {
    color: "#c06060",
    fontSize: 12,
    fontFamily: fontFamilies.technical,
    marginTop: 4,
  },
});