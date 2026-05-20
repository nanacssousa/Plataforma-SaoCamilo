// src/styles/PreSessaoStyle.ts
import { StyleSheet } from "react-native";
import { colors, fontFamilies } from "../constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
  },
  headerSpacer: {
    width: 36,
  },
  headerTitleWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: -1,
  },
  headerSettings: {
    fontSize: 20,
    color: colors.onSurface,
  },
  headerTitle: {
    flex: 1,
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.onSurface,
    textAlign: "center",
    textDecorationLine: "none", // <- Garante que não haja sublinhado no texto
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerAvatarText: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 14,
    color: colors.onSurface,
  },

  // Progress Steps
  progressContainer: {
    display: "none", // <- Oculta a barra de progresso (a linha vermelha)
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 24,
  },
  progressStep: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
  },
  progressStepActive: {
    backgroundColor: colors.primary,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Section Title
  sectionTitle: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 26,
    color: colors.onSurface,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
    marginBottom: 10,
    marginTop: 24,
  },

  // Weight Input
  weightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  weightInput: {
    flex: 1,
    fontFamily: fontFamilies.headline,
    fontSize: 28,
    color: colors.onSurface,
    paddingVertical: 12,
  },
  weightUnit: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
  },
  weightHint: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontStyle: "italic",
    marginTop: 6,
  },

  // Training Type Grid
  trainingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  trainingCard: {
    width: "47%",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    gap: 8,
  },
  trainingCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  trainingIcon: {
    fontSize: 20,
  },
  trainingLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.onSurface,
  },
  trainingLabelActive: {
    color: colors.primary,
  },

  // Urine Color
  urineContainer: {
    gap: 8,
  },
  urineRow: {
    flexDirection: "row",
    gap: 8,
  },
  urineOption: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  urineOptionSelected: {
    borderColor: colors.primary,
  },
  urineLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  urineLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
  },

  // Thirst Level
  thirstHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  thirstLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  thirstIcon: {
    fontSize: 16,
  },
  thirstTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.onSurface,
  },
  thirstValue: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 22,
    color: colors.primary,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.outlineVariant,
    borderRadius: 3,
    marginBottom: 8,
    position: "relative",
  },
  sliderFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: "absolute",
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
  },

  // Symptoms
  symptomsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 24,
  },
  symptomsTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
  },
  symptomsBadge: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.onSurfaceVariant,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  symptomsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  symptomCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  symptomCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  symptomIcon: {
    fontSize: 20,
  },
  symptomLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.onSurface,
    textAlign: "center",
  },
  symptomLabelActive: {
    color: colors.primary,
  },

  // CTA Button
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 32,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  ctaButtonText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.white,
  },
  ctaArrow: {
    fontSize: 16,
    color: colors.white,
  },
});
