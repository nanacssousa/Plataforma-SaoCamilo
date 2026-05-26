import { colors, fontFamilies } from "@/constants/theme";
import { formatTime } from "@/utils/formatters";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SessionTimerProps {
  seconds: number;
}

export function SessionTimer({ seconds }: SessionTimerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.circleTopRight} />
      <View style={styles.circleSmall} />
      <Text style={styles.label}>TEMPO DE SESSÃO</Text>
      <View style={styles.row}>
        <Text style={styles.time}>{formatTime(seconds)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>● ATIVO</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#a40000",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  circleTopRight: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  circleSmall: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  label: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  time: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 44,
    color: colors.white,
    letterSpacing: 2,
    lineHeight: 48,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1.5,
  },
});