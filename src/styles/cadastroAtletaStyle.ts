// src/styles/cadastroAtletaStyle.ts
import { StyleSheet } from "react-native";
import { colors, fontFamilies } from "../constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // ─── Header ────────────────────────────────────────────────────────────────
  header: {
    marginBottom: 24,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: 8,
  },
  headerAvatar: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 14,
    color: colors.onSurface,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // ─── Tag / Title / Subtitle ────────────────────────────────────────────────
  tag: {
    backgroundColor: colors.primary,
    color: colors.white,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1,
    borderRadius: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamilies.headlineBold,
    color: colors.onSurface,
    marginBottom: 16,
    lineHeight: 36,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
    textAlign: "center",
  },

  // ─── Info Card ─────────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurface,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  infoDesc: {
    fontSize: 12,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },

  // ─── Form ──────────────────────────────────────────────────────────────────
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  inputWithSuffix: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  inputNoBg: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  suffix: {
    fontSize: 12,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurface,
  },
  selectInput: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    color: colors.onSurface,
    fontFamily: fontFamilies.body,
  },
  selectIcon: {
    fontSize: 18,
    color: colors.onSurfaceVariant,
  },

  // ─── Botão ─────────────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  // ─── Footer ────────────────────────────────────────────────────────────────
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 24,
    fontFamily: fontFamilies.technicalBold,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
