import { StyleSheet } from "react-native";
import { colors, fontFamilies, radius, spacing } from "../constants/theme";

export const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.s6,
    paddingBottom: spacing.s12,
  },

  // ── Header ──────────────────────────────────────────────────────────────────

  header: {
    marginBottom: spacing.s8,
  },
  tag: {
    backgroundColor: colors.primary,
    color: colors.white,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.s2,
    paddingVertical: spacing.s1,
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1,
    borderRadius: radius.xs,
    marginBottom: spacing.s4,
  },
  title: {
    fontSize: 40,
    fontFamily: fontFamilies.headlineBold,
    color: colors.onSurface,
    marginBottom: spacing.s3,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },

  // ── Role picker ─────────────────────────────────────────────────────────────

  roleSection: {
    marginBottom: spacing.s8,
  },
  roleSectionLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    color: colors.gray400,
    letterSpacing: 1,
    marginBottom: spacing.s3,
  },
  roleRow: {
    flexDirection: "row",
    gap: spacing.s3,
  },
  roleCard: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.surfaceContainerHighest,
    backgroundColor: colors.surfaceContainerLow,
    paddingVertical: spacing.s4,
    paddingHorizontal: spacing.s3,
    alignItems: "center",
    gap: spacing.s2,
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  roleIcon: {
    fontSize: 22,
  },
  roleLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    color: colors.gray400,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  roleLabelActive: {
    color: colors.primary,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceContainerHighest,
  },
  roleDotActive: {
    backgroundColor: colors.primary,
  },

  // ── Formulário ──────────────────────────────────────────────────────────────

  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.s5,
  },
  row: {
    flexDirection: "row",
    gap: spacing.s3,
    marginBottom: spacing.s5,
  },
  rowItem: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    color: colors.gray400,
    marginBottom: spacing.s2,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.md,
    paddingHorizontal: spacing.s4,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  inputFocused: {
    backgroundColor: colors.surfaceContainerHighest,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  selectInput: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.md,
    paddingHorizontal: spacing.s4,
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
  selectPlaceholder: {
    color: colors.gray400,
  },
  selectIcon: {
    fontSize: 14,
    color: colors.gray400,
    fontFamily: fontFamilies.technicalBold,
  },

  // ── Dropdown ────────────────────────────────────────────────────────────────

  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    marginTop: spacing.s1,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: spacing.s4,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontFamily: fontFamilies.bodyBold,
  },

  // ── Permissões ──────────────────────────────────────────────────────────────

  permissionsCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    padding: spacing.s5,
    marginBottom: spacing.s8,
  },
  permissionsTitle: {
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurface,
    letterSpacing: 1,
    marginBottom: spacing.s4,
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  permissionRowLast: {
    marginBottom: 0,
  },
  permissionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  permissionIcon: {
    fontSize: 16,
    marginRight: spacing.s3,
  },
  permissionLabel: {
    fontSize: 13,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  permissionBadge: {
    paddingHorizontal: spacing.s2,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  permissionBadgeOn: {
    backgroundColor: "#E8F5E9",
  },
  permissionBadgeOff: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  permissionBadgeText: {
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 0.5,
  },
  permissionBadgeTextOn: {
    color: colors.success,
  },
  permissionBadgeTextOff: {
    color: colors.gray400,
  },

  // ── Botão primário ──────────────────────────────────────────────────────────

  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: spacing.s1,
    marginBottom: spacing.s4,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 2,
  },
  btnPrimaryDisabled: {
    backgroundColor: colors.gray400,
    opacity: 0.6,
  },
  btnPrimaryTextDisabled: {
    opacity: 0.6,
  },

  // ── Rodapé ──────────────────────────────────────────────────────────────────

  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: colors.gray400,
    fontFamily: fontFamilies.technicalBold,
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  // ── Divider ─────────────────────────────────────────────────────────────────

  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerHighest,
    marginVertical: spacing.s6,
  },
});