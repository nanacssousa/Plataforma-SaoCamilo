import { StyleSheet } from "react-native";
import { colors, fontFamilies } from "../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },

  // Top Bar ajustada (ATLETA centralizado, avatar à direita)
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    position: "relative",
  },
  topTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.onSurface,
    textAlign: "center",
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.onSurface,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 16,
  },

  // Conteúdo
  scrollContent: { padding: 16 },
  sectionHeader: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.info,
    letterSpacing: 1,
    marginBottom: 8,
  },
  pageTitle: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 28,
    color: colors.onSurface,
    lineHeight: 34,
    marginBottom: 8,
  },
  pageDate: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.gray400,
    marginBottom: 24,
  },

  // Cards
  cardLight: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  cardWarm: {
    backgroundColor: colors.warm,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.gray400,
    letterSpacing: 1,
    marginBottom: 4,
  },
  mainValue: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 42,
    color: colors.onSurface,
  },
  unitText: {
    fontSize: 18,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  rowAlign: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  alertBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 12,
  },
  alertBadgeText: {
    color: colors.error,
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
  },
  cardDesc: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.gray700,
    lineHeight: 18,
    marginBottom: 16,
  },

  // Escalas/Zonas
  zonesBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  zoneText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 8,
    color: colors.onSurface,
  },
  zoneColors: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  zoneBox: { flex: 1, marginHorizontal: 1 },

  // Ícones e Badges
  iconRed: { fontSize: 18, color: colors.error },
  badgeGray: {
    backgroundColor: colors.gray200,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeGrayText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.onSurface,
  },

  // Card Escuro
  cardDarkRed: {
    backgroundColor: colors.primaryDark,
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  darkTitle: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 18,
    color: colors.white,
    marginBottom: 8,
  },
  darkDesc: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 18,
    marginBottom: 20,
  },
  darkHighlightBox: {
    backgroundColor: "rgba(0,0,0,0.15)",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  darkHighlightLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 1,
    marginBottom: 4,
  },
  darkHighlightValue: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 32,
    color: colors.white,
  },
  darkHighlightUnit: {
    fontSize: 14,
    fontFamily: fontFamilies.body,
    color: colors.white,
  },
});
  