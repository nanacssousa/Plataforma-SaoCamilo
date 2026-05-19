import { StyleSheet } from "react-native";
import { colors, fontFamilies, radius, spacing } from "../constants/theme";

export const styles = StyleSheet.create({

  // ─── Layout base ─────────────────────────────────────────────────────────────

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

  // ─── Header ──────────────────────────────────────────────────────────────────

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
  headerSep: {
    color: colors.gray400,
  },
  headerSecao: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14,
    color: colors.primary,
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

  // ─── Título da seção ─────────────────────────────────────────────────────────

  secaoTitulo: {
    paddingBottom: spacing.s4,
  },
  tituloPrincipal: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 36,
    color: colors.onSurface,
    lineHeight: 42,
    marginBottom: spacing.s2,
  },
  tituloDesc: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },

  // ─── Card genérico ────────────────────────────────────────────────────────────

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.s4,
    marginBottom: spacing.s4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.gray400,
    textTransform: "uppercase",
    marginBottom: spacing.s1,
  },
  cardTitulo: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: spacing.s3,
  },

  // ─── Linha principal: Tabela + Matriz ────────────────────────────────────────

  linhaMain: {
    flexDirection: "row",
    gap: spacing.s4,
    flexWrap: "wrap",
    marginBottom: spacing.s2,
  },
  cardTabela: {
    flex: 2,
    minWidth: 280,
  },
  cardTabelaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: spacing.s4,
    flexWrap: "wrap",
    gap: spacing.s2,
  },
  linkGerenciar: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 11,
    color: colors.secondary,
    letterSpacing: 0.3,
  },

  // ─── Tabela de profissionais ──────────────────────────────────────────────────

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing.s2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
    marginBottom: spacing.s1,
  },
  tableHeaderText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.gray400,
    textTransform: "uppercase",
    lineHeight: 13,
  },
  colProfissional: { flex: 2.2 },
  colCargo:        { flex: 1.4 },
  colAcesso:       { flex: 1.6 },
  colAcoes:        { width: 36 },

  // ─── Linha de profissional ────────────────────────────────────────────────────

  profRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s3,
    gap: spacing.s2,
  },
  profRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  profAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceContainerHighest,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.s2,
  },
  profAvatarIcon: {
    fontSize: 16,
  },
  profInfo: {
    flex: 1.4,
  },
  profNome: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
    color: colors.onSurface,
    marginBottom: 2,
  },
  profEmail: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: colors.gray400,
  },
  colValue: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 17,
    flex: 1,
  },
  acaoBtn: {
    width: 36,
    alignItems: "center",
  },
  acaoIcon: {
    fontSize: 14,
  },

  // ─── Badges de cargo ─────────────────────────────────────────────────────────

  badgeCargo: {
    paddingHorizontal: spacing.s2,
    paddingVertical: spacing.s1,
    borderRadius: radius.xs,
    alignSelf: "flex-start",
  },
  badgeCargoText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    lineHeight: 13,
    textAlign: "center",
  },
  badgeMedico:          { backgroundColor: colors.primaryTint },
  badgeMedicoText:      { color: colors.primary },
  badgeBioanalista:     { backgroundColor: colors.surfaceContainerHighest },
  badgeBioanalistaText: { color: colors.onSurfaceVariant },
  badgeEsp:             { backgroundColor: colors.surfaceContainerHighest },
  badgeEspText:         { color: colors.onSurfaceVariant },

  // ─── Card Matriz de Equipes ───────────────────────────────────────────────────

  cardMatriz: {
    flex: 1,
    minWidth: 180,
    backgroundColor: colors.surfaceContainerLow,
  },
  matrizDesc: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: spacing.s4,
  },
  equipeList: {
    borderRadius: radius.md,
    overflow: "hidden",
    marginBottom: spacing.s4,
    backgroundColor: colors.white,
  },
  equipeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.s3,
    paddingHorizontal: spacing.s3,
  },
  equipeItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  equipeItemDestaque: {
    backgroundColor: colors.primary,
  },
  equipeNome: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
    color: colors.onSurface,
  },
  equipeNomeDestaque: {
    color: colors.white,
  },
  equipeRight: {
    alignItems: "flex-end",
  },
  equipeAtletas: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: colors.gray400,
  },
  equipeTag: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.s2,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  equipeTagText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    color: colors.white,
    letterSpacing: 0.3,
  },
  btnCriarEquipe: {
    borderWidth: 1.5,
    borderColor: colors.onSurface,
    borderRadius: radius.md,
    paddingVertical: spacing.s3,
    alignItems: "center",
  },
  btnCriarEquipeText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 11,
    color: colors.onSurface,
    letterSpacing: 0.5,
  },

  // ─── Cards de configuração (linha inferior) ───────────────────────────────────

  linhaCards: {
    flexDirection: "row",
    gap: spacing.s4,
    flexWrap: "wrap",
    marginBottom: spacing.s2,
  },
  cardConfigItem: {
    flex: 1,
    minWidth: 180,
  },
  cardConfigIcone: {
    fontSize: 28,
    marginBottom: spacing.s3,
  },
  cardConfigTitulo: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 15,
    color: colors.onSurface,
    marginBottom: spacing.s2,
  },
  cardConfigDesc: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
    flex: 1,
    marginBottom: spacing.s4,
  },
  cardConfigRodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.s3,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
  },
  cardConfigChave: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: colors.gray400,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  cardConfigValor: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 11,
    color: colors.onSurface,
    letterSpacing: 0.3,
  },
  cardConfigValorPrimario: {
    color: colors.primary,
  },

  // ─── Rodapé conformidade ─────────────────────────────────────────────────────

  rodapeConformidade: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingVertical: spacing.s4,
    marginBottom: spacing.s4,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
    gap: spacing.s2,
  },
  rodapeText: {
    fontFamily: fontFamilies.technical,
    fontSize: 9,
    color: colors.gray400,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});