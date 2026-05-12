import { StyleSheet } from "react-native";
import { colors, fontFamilies, radius } from "../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDFCF8" },
  scrollContent: { padding: 24, paddingBottom: 48 },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: { marginBottom: 28 },
  tag: {
    backgroundColor: colors.primary,
    color: colors.white,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1,
    borderRadius: radius.xs,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontFamily: fontFamilies.headlineBold,
    color: colors.onSurface,
    marginBottom: 12,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },

  // ── Seleção de cargo (role picker) ──────────────────────────────────────────
  roleSection: { marginBottom: 28 },
  roleSectionLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    color: "#6A6A6A",
    letterSpacing: 1,
    marginBottom: 12,
  },
  roleRow: { flexDirection: "row", gap: 10 },
  roleCard: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.surfaceContainerHighest,
    backgroundColor: colors.surfaceContainerLow,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#FFF5F5",
  },
  roleIcon: { fontSize: 22 },
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
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  row: { flexDirection: "row", gap: 12 },
  rowItem: { flex: 1 },
  label: {
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    color: "#6A6A6A",
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#EAE9E4",
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  inputFocused: {
    backgroundColor: "#E0DED8",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  selectInput: {
    backgroundColor: "#EAE9E4",
    borderRadius: radius.md,
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
  selectPlaceholder: {
    color: colors.onSurfaceVariant,
  },
  selectIcon: {
    fontSize: 14,
    color: "#6A6A6A",
    fontFamily: fontFamilies.technicalBold,
  },

  // ── Dropdown ────────────────────────────────────────────────────────────────
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    marginTop: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
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

  // ── Seção de permissões ─────────────────────────────────────────────────────
  permissionsCard: {
    backgroundColor: "#F4F3EF",
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 28,
  },
  permissionsTitle: {
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurface,
    letterSpacing: 1,
    marginBottom: 16,
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
  permissionLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  permissionIcon: { fontSize: 16, marginRight: 10 },
  permissionLabel: {
    fontSize: 13,
    fontFamily: fontFamilies.body,
    color: "#4A4A4A",
    flex: 1,
  },
  permissionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  permissionBadgeOn: { backgroundColor: "#E8F5E9" },
  permissionBadgeOff: { backgroundColor: "#EEEEEE" },
  permissionBadgeText: {
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 0.5,
  },
  permissionBadgeTextOn: { color: colors.success },
  permissionBadgeTextOff: { color: colors.gray400 },

  // ── Botão primário ──────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 2,
  },

  // ── Rodapé ──────────────────────────────────────────────────────────────────
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#8A8A8A",
    fontFamily: fontFamilies.technicalBold,
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  // ── Divider ─────────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerHighest,
    marginVertical: 24,
  },
});