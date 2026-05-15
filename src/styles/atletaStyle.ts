// src/styles/atletaStyle.ts
import { StyleSheet } from "react-native";
import { colors, fontFamilies } from "../constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // ─── Top Bar ────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
  },
  topTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.onSurface,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarMiniText: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 14,
    color: colors.onSurface,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // ─── Alert Card ─────────────────────────────────────────────────────────────
  alertCard: {
    backgroundColor: colors.primaryTint,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  alertTitle: {
    color: colors.primary,
    fontFamily: fontFamilies.technicalBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  alertText: {
    color: colors.onSurfaceVariant,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 19,
  },

  // ─── Hero Card ──────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  heroSub: {
    color: "rgba(255,255,255,0.65)",
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fontFamilies.headlineBold,
    fontSize: 28,
    marginBottom: 12,
    lineHeight: 33,
  },
  heroText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  heroBtn: {
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  heroBtnText: {
    color: colors.primary,
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // ─── Status Grid ────────────────────────────────────────────────────────────
  grid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  gridLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  gridValueBigger: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 32,
    color: colors.onSurface,
    lineHeight: 36,
  },
  gridValue: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 28,
    color: colors.onSurface,
    lineHeight: 33,
  },
  gridUnit: {
    fontSize: 14,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
  },
  gridDesc: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
    marginTop: 8,
  },
  gridSubDesc: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontStyle: "italic",
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.outlineVariant,
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },

  // ─── Highlight Card ─────────────────────────────────────────────────────────
  highlightCard: {
    backgroundColor: colors.secondary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  highlightSub: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  highlightTitle: {
    color: colors.white,
    fontFamily: fontFamilies.headlineBold,
    fontSize: 18,
    marginBottom: 20,
  },
  highlightValue: {
    color: colors.white,
    fontFamily: fontFamilies.headlineBold,
    fontSize: 48,
    lineHeight: 52,
  },
  highlightUnit: {
    fontSize: 18,
    fontFamily: fontFamilies.body,
  },

  // ─── Metric Card ────────────────────────────────────────────────────────────
  metricCard: {
    backgroundColor: colors.primaryTint,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  metricLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 24,
    color: colors.onSurface,
    marginBottom: 2,
  },
  metricTarget: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 28,
    color: colors.primary,
  },
});