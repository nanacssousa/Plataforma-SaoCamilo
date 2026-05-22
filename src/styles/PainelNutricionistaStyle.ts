import { StyleSheet } from "react-native";
import { colors, spacing, radius, fontFamilies } from "@/constants/theme";

export const styles = StyleSheet.create({
  // ─── Layout base ────────────────────────────────────────────────────────────

  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  layout: {
    flex: 1,
    flexDirection: "row",
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.s4,
  },

  // ─── Sidebar ─────────────────────────────────────────────────────────────────

  sidebar: {
    width: 140,
    backgroundColor: colors.surfaceContainerLow,
    paddingTop: spacing.s6,
    paddingBottom: spacing.s4,
    borderRightWidth: 1,
    borderRightColor: colors.outlineVariant,
  },
  sidebarLogo: {
    paddingHorizontal: spacing.s4,
    marginBottom: spacing.s8,
  },
  sidebarLogoTop: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.gray400,
    textTransform: "uppercase",
  },
  sidebarLogoBottom: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 15,
    color: colors.onSurface,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sidebarNav: {
    gap: spacing.s1,
    paddingHorizontal: spacing.s2,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s2,
    paddingVertical: spacing.s3,
    paddingHorizontal: spacing.s3,
    borderRadius: radius.md,
  },
  navItemActive: {
    backgroundColor: colors.primary,
  },
  navIcon: {
    fontSize: 15,
  },
  navLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: colors.white,
  },

  // ─── Header ─────────────────────────────────────────────────────────────────

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.s4,
    marginBottom: spacing.s2,
  },
  headerBreadcrumb: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  headerBreadcrumbSep: {
    color: colors.gray400,
  },
  headerEquipe: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14,
    color: colors.onSurface,
  },
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.s3,
    paddingVertical: spacing.s2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  syncText: {
    fontFamily: fontFamilies.technical,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },

  // ─── Card genérico ───────────────────────────────────────────────────────────

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.s4,
    marginBottom: spacing.s4,
    // sombra leve
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.s4,
    flexWrap: "wrap",
    gap: spacing.s2,
  },
  cardTitulo: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 18,
    color: colors.onSurface,
  },

  // ─── Search ──────────────────────────────────────────────────────────────────

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    paddingHorizontal: spacing.s3,
    paddingVertical: spacing.s1,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    minWidth: 180,
  },
  searchIcon: {
    fontSize: 13,
    marginRight: spacing.s2,
    color: colors.gray400,
  },
  searchInput: {
    fontFamily: fontFamilies.technical,
    fontSize: 13,
    color: colors.onSurface,
    flex: 1,
    paddingVertical: 2,
  },

  // ─── Tabela ──────────────────────────────────────────────────────────────────

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing.s2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
    marginBottom: spacing.s2,
  },
  tableHeaderText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.gray400,
    textTransform: "uppercase",
  },

  // colunas — widths proporcionais
  colAtleta: { flex: 2.5 },
  colStatus: { flex: 2 },
  colMassa: { flex: 1.5 },
  colDelta: { flex: 1.2 },
  colUsg: { flex: 1.2 },
  colAcoes: { width: 32 },

  // ─── Linha de atleta ─────────────────────────────────────────────────────────

  atletaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s3,
  },
  atletaRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHighest,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.s3,
  },
  avatarText: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  atletaInfo: {
    flex: 1.6,
  },
  atletaNome: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14,
    color: colors.onSurface,
    marginBottom: 2,
  },
  atletaDetalhe: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: colors.gray400,
    letterSpacing: 0.4,
  },
  colValue: {
    fontFamily: fontFamilies.technical,
    fontSize: 14,
    color: colors.onSurface,
  },
  deltaText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
  },
  deltaPos: {
    color: colors.success,
  },
  deltaNeg: {
    color: colors.error,
  },
  acaoBtn: {
    width: 32,
    alignItems: "center",
  },
  acaoDots: {
    fontSize: 18,
    color: colors.gray400,
    lineHeight: 20,
  },

  // ─── Badges de status hídrico ─────────────────────────────────────────────────

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  // Desidratado
  badgeDesidratado: {
    backgroundColor: "#FFF0F0",
  },
  badgeTextDesidratado: {
    color: colors.error,
  },
  dotDesidratado: {
    backgroundColor: colors.error,
  },

  // Hidratado
  badgeHidratado: {
    backgroundColor: "#EAF6FF",
  },
  badgeTextHidratado: {
    color: colors.secondary,
  },
  dotHidratado: {
    backgroundColor: colors.secondary,
  },

  // Alerta leve
  badgeAlerta: {
    backgroundColor: "#FFF8EC",
  },
  badgeTextAlerta: {
    color: colors.warning,
  },
  dotAlerta: {
    backgroundColor: colors.warning,
  },

  // ─── Rodapé (sugestões + relatório) ─────────────────────────────────────────

  rodape: {
    flexDirection: "row",
    gap: spacing.s4,
    flexWrap: "wrap",
  },
  cardSugestoes: {
    flex: 1.5,
    minWidth: 260,
  },
  cardRelatorio: {
    flex: 1,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Sugestões ────────────────────────────────────────────────────────────────

  sugestaoLista: {
    gap: spacing.s3,
    marginTop: spacing.s3,
  },
  sugestaoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.s3,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    gap: spacing.s3,
  },
  sugestaoIcone: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  sugestaoIconeEmergencial: {
    backgroundColor: "#FFF0F0",
  },
  sugestaoIconeAjuste: {
    backgroundColor: "#EAF6FF",
  },
  sugestaoIconeText: {
    fontSize: 18,
  },
  sugestaoTexto: {
    flex: 1,
  },
  sugestaoTitulo: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
    color: colors.onSurface,
    marginBottom: 3,
  },
  sugestaoDesc: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 17,
  },

  // ─── Relatório ───────────────────────────────────────────────────────────────

  relatorioIcone: {
    fontSize: 32,
    marginBottom: spacing.s2,
  },
  relatorioDesc: {
    fontFamily: fontFamilies.technical,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 19,
    marginTop: spacing.s2,
    marginBottom: spacing.s4,
  },
  pdfBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.s3,
    paddingHorizontal: spacing.s4,
    borderRadius: radius.md,
    alignSelf: "stretch",
    alignItems: "center",
  },
  pdfBtnText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    color: colors.white,
    letterSpacing: 0.8,
  },

  // ─── Badge nutricionista ──────────────────────────────────────────────────────

  nutricionistaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s3,
    paddingVertical: spacing.s3,
    paddingHorizontal: spacing.s4,
    marginBottom: spacing.s6,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    alignSelf: "flex-start",
  },
  nutAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryTint,
    justifyContent: "center",
    alignItems: "center",
  },
  nutAvatarText: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
    color: colors.primary,
  },
  nutLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.gray400,
    textTransform: "uppercase",
  },
  nutNome: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14,
    color: colors.onSurface,
  },
});
