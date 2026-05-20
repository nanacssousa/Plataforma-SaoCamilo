// src/styles/PosSessaoStyle.ts
import { StyleSheet } from "react-native";
import { colors, fontFamilies } from "../constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },

  headerSettings: {
    fontSize: 20,
    color: colors.onSurface,
  },
  headerTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.onSurface,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
    textDecorationLine: "none", // <- Adicionado para garantir que não haja sublinhado
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
    display: "none", // <- Adicionado para esconder a barra de progresso (a provável linha vermelha)
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
