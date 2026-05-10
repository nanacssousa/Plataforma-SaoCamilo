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
  headerEquipe: {
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

  // ─── Linha topo: gráfico + KPIs ──────────────────────────────────────────────

  topoRow: {
    flexDirection: "row",
    gap: spacing.s4,
    marginBottom: spacing.s2,
    flexWrap: "wrap",
  },
  cardGrafico: {
    flex: 2.2,
    minWidth: 260,
  },

  // ─── Gráfico de barras ────────────────────────────────────────────────────────

  graficoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.s4,
    gap: spacing.s3,
    flexWrap: "wrap",
  },
  graficoTitulo: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 4,
  },
  graficoSubtitulo: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: colors.gray400,
    letterSpacing: 0.3,
    lineHeight: 15,
  },
  filtroBtns: {
    flexDirection: "row",
    gap: spacing.s2,
  },
  filtroBtn: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xs,
    paddingHorizontal: spacing.s2,
    paddingVertical: spacing.s1,
    backgroundColor: colors.surfaceContainerLow,
  },
  filtroBtnText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.3,
    lineHeight: 13,
    textAlign: "center",
  },
  graficoContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 150,
    paddingHorizontal: spacing.s1,
  },
  graficoGrupo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  graficoBarras: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  barra: {
    width: 10,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barraMassa: {
    backgroundColor: "#D9848A", // rosa-vermelho translúcido
  },
  barraUsg: {
    backgroundColor: "#B8D0E8", // azul acinzentado
  },
  graficoDia: {
    fontFamily: fontFamilies.technical,
    fontSize: 7,
    color: colors.gray400,
    textTransform: "uppercase",
    marginTop: spacing.s1,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  legenda: {
    flexDirection: "row",
    gap: spacing.s4,
    marginTop: spacing.s3,
    paddingTop: spacing.s2,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
  },
  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s1,
  },
  legendaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendaDotMassa: {
    backgroundColor: "#D9848A",
  },
  legendaDotUsg: {
    backgroundColor: "#B8D0E8",
  },
  legendaText: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },

  // ─── KPIs ────────────────────────────────────────────────────────────────────

  kpiColuna: {
    flex: 1,
    minWidth: 140,
    gap: spacing.s4,
  },
  cardKpiRisco: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    justifyContent: "center",
  },
  cardKpiHid: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: "center",
  },
  kpiAlerta: {
    fontSize: 18,
    color: "#F4A400",
    marginBottom: spacing.s1,
  },
  kpiLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    marginBottom: spacing.s1,
  },
  kpiNumero: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 48,
    color: colors.white,
    lineHeight: 52,
    marginBottom: spacing.s1,
  },
  kpiSubLabel: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.3,
  },
  kpiGota: {
    fontSize: 20,
    marginBottom: spacing.s1,
  },
  kpiLabelHid: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.gray400,
    textTransform: "uppercase",
    marginBottom: spacing.s1,
  },
  kpiPorcentagem: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 44,
    color: colors.secondary,
    lineHeight: 50,
    marginBottom: spacing.s1,
  },
  kpiPorcentagemSufixo: {
    fontSize: 28,
    color: colors.secondary,
  },
  kpiSubLabelHid: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: colors.gray400,
    letterSpacing: 0.3,
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
  colAtleta: { flex: 2.5 },
  colStatus: { flex: 2 },
  colMassa: { flex: 1.5 },
  colDelta: { flex: 1.2 },
  colUsg: { flex: 1.2 },
  colAcoes: { width: 32 },

  // ─── Linha atleta ─────────────────────────────────────────────────────────────

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
  atletaInfo: { flex: 1.6 },
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
  deltaPos: { color: colors.success },
  deltaNeg: { color: colors.error },
  acaoBtn: {
    width: 32,
    alignItems: "center",
  },
  acaoDots: {
    fontSize: 18,
    color: colors.gray400,
    lineHeight: 20,
  },

  // ─── Badges ───────────────────────────────────────────────────────────────────

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
  badgeDesidratado: { backgroundColor: "#FFF0F0" },
  badgeTextDesidratado: { color: colors.error },
  dotDesidratado: { backgroundColor: colors.error },
  badgeHidratado: { backgroundColor: "#EAF6FF" },
  badgeTextHidratado: { color: colors.secondary },
  dotHidratado: { backgroundColor: colors.secondary },
  badgeAlerta: { backgroundColor: "#FFF8EC" },
  badgeTextAlerta: { color: colors.warning },
  dotAlerta: { backgroundColor: colors.warning },

  // ─── Rodapé: Sugestões + Relatório ──────────────────────────────────────────

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
    gap: spacing.s3,
    paddingVertical: spacing.s2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  sugestaoLinha: {
    width: 3,
    height: "100%",
    minHeight: 40,
    borderRadius: 2,
  },
  sugestaoLinhaEmergencial: {
    backgroundColor: colors.error,
  },
  sugestaoLinhaAjuste: {
    backgroundColor: colors.secondary,
  },
  sugestaoTexto: { flex: 1 },
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

  // ─── Relatório ────────────────────────────────────────────────────────────────

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
