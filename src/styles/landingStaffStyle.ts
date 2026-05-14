// src/styles/landingStaffStyle.ts
import { Dimensions, StyleSheet } from "react-native";
import { colors, fontFamilies, radius, spacing } from "../constants/theme";

const { width: W } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },

  // ── Navbar ────────────────────────────────────────────────────────────────
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s4,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
  },
  navLogoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  navLogoBox: {
    width: 26,
    height: 26,
    backgroundColor: colors.primary,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  navLogoLetter: {
    color: colors.white,
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
  },
  navBrand: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.onSurface,
  },
  navLinksRow: { flexDirection: "row", gap: spacing.s5 },
  navLink: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.gray400,
  },
  navLinkActive: { color: colors.primary },
  navCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.xs,
  },
  navCtaText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.white,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    paddingHorizontal: spacing.s6,
    paddingTop: spacing.s8,
    paddingBottom: spacing.s6,
    backgroundColor: colors.white,
  },
  heroTag: {
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.s5,
  },
  heroTagText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.onSurfaceVariant,
  },
  heroTitle: {
    fontFamily: fontFamilies.headlineItalic,
    fontSize: 36,
    lineHeight: 44,
    color: colors.onSurface,
  },
  heroTitleAccent: {
    fontFamily: fontFamilies.headlineItalic,
    color: colors.primary,
  },
  heroSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.onSurfaceVariant,
    marginTop: spacing.s4,
    marginBottom: spacing.s6,
  },
  heroBtnRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  heroBtnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: radius.xs,
  },
  heroBtnPrimaryText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.white,
  },
  heroBtnSecondary: {
    borderWidth: 1.5,
    borderColor: colors.surfaceContainerHighest,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: radius.xs,
  },
  heroBtnSecondaryText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.onSurface,
  },

  // ── Live card (abaixo do hero) ─────────────────────────────────────────────
  liveCardWrapper: {
    marginHorizontal: spacing.s6,
    marginTop: spacing.s4,
    marginBottom: spacing.s2,
  },
  liveCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    padding: spacing.s4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  liveRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  liveLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.success,
  },
  liveMetric: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 32,
    color: colors.onSurface,
  },
  liveDesc: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.gray400,
    marginTop: 2,
  },

  // ── Seção de features ─────────────────────────────────────────────────────
  section: {
    paddingHorizontal: spacing.s6,
    paddingTop: spacing.s8,
    paddingBottom: spacing.s6,
  },
  sectionBg: { backgroundColor: colors.warm },
  sectionBgWhite: { backgroundColor: colors.white },
  sectionLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 2,
    color: colors.gray400,
    marginBottom: spacing.s3,
  },
  sectionTitle: {
    fontFamily: fontFamilies.headlineItalic,
    fontSize: 28,
    lineHeight: 34,
    color: colors.onSurface,
    marginBottom: spacing.s2,
  },
  sectionSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.s6,
  },

  // ── Feature card grande ────────────────────────────────────────────────────
  featureCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    padding: spacing.s5,
    marginBottom: spacing.s4,
  },
  featureCardIcon: { fontSize: 18, marginBottom: spacing.s3 },
  featureCardTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.onSurface,
    marginBottom: spacing.s2,
  },
  featureChartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 48,
    gap: 3,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: 8,
    marginBottom: spacing.s3,
  },
  featureChartBar: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: `${colors.primary}cc`,
  },
  featureCardBody: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.s3,
  },
  featureTagsRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  featureTagItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  featureTagDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  featureTagText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.primary,
  },

  // ── Feature row (2 cards) ─────────────────────────────────────────────────
  featureRow: { flexDirection: "row", gap: 12 },
  featureCardSmall: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    padding: spacing.s4,
  },
  alertBadge: {
    backgroundColor: "#FFF3F3",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xs,
    padding: 8,
    marginTop: spacing.s3,
  },
  alertBadgeTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.primary,
    marginBottom: 3,
  },
  alertBadgeText: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.onSurfaceVariant,
  },
  exportRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: spacing.s3 },
  exportText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.onSurface,
  },

  // ── Stats ─────────────────────────────────────────────────────────────────
  statsContainer: {
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s8,
    backgroundColor: colors.white,
  },
  statsLabel: {
    fontFamily: fontFamilies.technical,
    fontSize: 13,
    textAlign: "center",
    color: colors.gray400,
    marginBottom: spacing.s2,
  },
  statsTitle: {
    fontFamily: fontFamilies.headlineItalic,
    fontSize: 28,
    lineHeight: 36,
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: spacing.s8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center" },
  statNumber: {
    fontFamily: fontFamilies.headlineItalic,
    fontSize: 34,
    color: colors.onSurface,
    marginBottom: 4,
  },
  statDesc: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 8,
    letterSpacing: 1.5,
    color: colors.gray400,
    textAlign: "center",
    maxWidth: 70,
  },

  // ── CTA final (vermelho) ──────────────────────────────────────────────────
  ctaSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s12,
    alignItems: "center",
  },
  ctaTitle: {
    fontFamily: fontFamilies.headlineItalic,
    fontSize: 30,
    lineHeight: 38,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.s4,
  },
  ctaSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: spacing.s8,
    maxWidth: W * 0.8,
  },
  ctaBtn: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: radius.xs,
    width: "100%",
    alignItems: "center",
  },
  ctaBtnText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.white,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHighest,
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s5,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.s3,
  },
  footerBrand: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.onSurface,
  },
  footerLinksRow: { flexDirection: "row", gap: 16 },
  footerLink: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: colors.gray400,
  },
  footerCopy: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: colors.gray400,
  },
});