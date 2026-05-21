// src/styles/cadastroAtletaStyle.ts
import { colors, fontFamilies } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // ─── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
    position: "relative",
  },
  headerTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.onSurface,
    textAlign: "center",
  },
  headerAvatar: {
    position: "absolute",
    right: 20,
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
    paddingBottom: 60,
  },

  // ─── Tag / Title / Subtitle ────────────────────────────────────────────────
  tag: {
    backgroundColor: colors.primary,
    color: colors.white,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1.5,
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  title: {
    fontSize: 36,
    fontFamily: fontFamilies.headlineBold,
    color: colors.onSurface,
    marginBottom: 12,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
    lineHeight: 23,
    marginBottom: 28,
  },

  // ─── Info Card ─────────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurface,
    marginBottom: 3,
    letterSpacing: 1,
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
    gap: 0,
  },
  inputGroup: {
    marginBottom: 22,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurface,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  labelRequired: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fontFamilies.technicalBold,
  },
  labelError: {
    fontSize: 11,
    fontFamily: fontFamilies.body,
    color: colors.error,
    marginTop: 5,
  },

  // ─── Inputs ────────────────────────────────────────────────────────────────
  input: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: "#FFF5F5",
  },
  inputFilled: {
    borderColor: colors.success,
    backgroundColor: colors.surface,
  },
  inputWithSuffix: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputWithSuffixFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputWithSuffixError: {
    borderColor: colors.error,
    backgroundColor: "#FFF5F5",
  },
  inputWithSuffixFilled: {
    borderColor: colors.success,
    backgroundColor: colors.surface,
  },
  inputNoBg: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  suffix: {
    fontSize: 13,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },

  // ─── Select / Dropdown ────────────────────────────────────────────────────
  selectInput: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  selectInputOpen: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  selectInputFilled: {
    borderColor: colors.success,
    backgroundColor: colors.surface,
  },
  selectText: {
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  selectPlaceholder: {
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
  },
  selectChevron: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },

  // ─── Dropdown list ────────────────────────────────────────────────────────
  dropdownList: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: colors.primary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.outlineVariant,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemSelected: {
    backgroundColor: `${colors.primary}10`,
  },
  dropdownItemIcon: {
    fontSize: 18,
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
    flex: 1,
  },
  dropdownItemTextSelected: {
    fontFamily: fontFamilies.bodyBold,
    color: colors.primary,
  },
  dropdownCheck: {
    fontSize: 14,
    color: colors.primary,
  },

  // ─── Botão ─────────────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  btnPrimaryDisabled: {
    backgroundColor: colors.gray200,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  btnPrimaryTextDisabled: {
    color: colors.gray400,
  },

  // ─── Footer ────────────────────────────────────────────────────────────────
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 20,
    fontFamily: fontFamilies.technicalBold,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});