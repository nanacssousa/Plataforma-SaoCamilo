import { StyleSheet } from "react-native";
import { colors, spacing, radius, fontFamilies } from "@/constants/theme";

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
  conteudo: {
    flex: 1,
    flexDirection: "column",
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.s4,
  },

  // ─── Sidebar ─────────────────────────────────────────────────────────────────

  sidebar: {
    width: 160,
    backgroundColor: colors.surfaceContainerLow,
    paddingTop: spacing.s5,
    paddingBottom: spacing.s4,
    borderRightWidth: 1,
    borderRightColor: colors.outlineVariant,
    justifyContent: "space-between",
  },
  sidebarLogo: {
    paddingHorizontal: spacing.s4,
    marginBottom: spacing.s6,
  },
  sidebarLogoTop: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  sidebarLogoSub: {
    fontFamily: fontFamilies.technical,
    fontSize: 8,
    color: colors.gray400,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
  sidebarNav: {
    flex: 1,
    gap: spacing.s1,
    paddingHorizontal: spacing.s2,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s2,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s3,
    borderRadius: radius.md,
  },
  navItemActive: {
    backgroundColor: colors.primary,
    borderRightWidth: 3,
    borderRightColor: colors.primaryDark,
  },
  navIcon: { fontSize: 14 },
  navLabel: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
    flex: 1,
  },
  navLabelActive: {
    color: colors.white,
    fontFamily: fontFamilies.technicalBold,
  },

  // ─── Rodapé da sidebar ────────────────────────────────────────────────────────

  sidebarFooter: {
    paddingHorizontal: spacing.s3,
    paddingTop: spacing.s3,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    gap: spacing.s2,
  },
  btnRegistrar: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.s3,
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing.s1,
  },
  btnRegistrarText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.5,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s2,
    paddingVertical: spacing.s1,
    paddingHorizontal: spacing.s2,
  },
  footerIcon: { fontSize: 13 },
  footerLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },

  // ─── TopBar ───────────────────────────────────────────────────────────────────

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s3,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    flexWrap: "wrap",
    gap: spacing.s2,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s4,
    flexWrap: "wrap",
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s3,
  },
  topBarPainelLabel: {
    fontFamily: fontFamilies.headlineItalic,
    fontSize: 15,
    color: colors.onSurface,
    letterSpacing: 0,
    textTransform: "none",
  },
  topBarItem: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.gray400,
    textTransform: "uppercase",
  },
  topBarItemAtivo: {
    color: colors.onSurface,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 2,
  },
  topBarExportar: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.onSurface,
    textTransform: "uppercase",
  },
  topBarIcone: { fontSize: 16 },
  topBarBtnProtocolo: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s3,
    borderRadius: radius.md,
  },
  topBarBtnText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.5,
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
  cardTitulo: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 20,
    color: colors.onSurface,
    marginBottom: spacing.s2,
  },

  // ─── Cabeçalho da tela ────────────────────────────────────────────────────────

  secaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: spacing.s5,
    paddingBottom: spacing.s4,
    gap: spacing.s4,
    flexWrap: "wrap",
  },
  secaoHeaderLeft: {
    flex: 1,
    minWidth: 220,
  },
  tituloPrincipal: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 34,
    color: colors.onSurface,
    lineHeight: 40,
    marginBottom: spacing.s2,
  },
  sessionId: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: colors.gray400,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // ─── KPI Risco Crítico ────────────────────────────────────────────────────────

  kpiRisco: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.s4,
    minWidth: 160,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  kpiRiscoAlerta: {
    fontSize: 18,
    color: "#F4A400",
    marginBottom: spacing.s1,
  },
  kpiRiscoLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.s1,
    alignSelf: "flex-end",
  },
  kpiRiscoValor: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 40,
    color: colors.white,
    lineHeight: 44,
    marginBottom: 4,
  },
  kpiRiscoSub: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  // ─── Linha gráfico + balanço ─────────────────────────────────────────────────

  linhaGrafico: {
    flexDirection: "row",
    gap: spacing.s4,
    flexWrap: "wrap",
    marginBottom: spacing.s2,
  },
  cardGrafico: {
    flex: 2,
    minWidth: 260,
  },
  graficoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: spacing.s4,
  },
  graficoTitulo: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 17,
    fontStyle: "italic",
    color: colors.onSurface,
  },
  graficoSubtitulo: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.gray400,
    textTransform: "uppercase",
  },

  // ─── Gráfico sparkline ────────────────────────────────────────────────────────

  graficoArea: {
    flex: 1,
  },
  graficoRefLinha: {
    height: 1,
    backgroundColor: colors.surfaceContainerHigh,
    marginBottom: spacing.s2,
  },
  graficoBarrasRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 160,
    gap: spacing.s2,
    paddingBottom: spacing.s1,
  },
  graficoColuna: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: 180,
  },
  graficoBarraWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  graficoBarraSpark: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: colors.surfaceContainerHighest,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  graficoBarraDestaque: {
    backgroundColor: colors.primary,
  },
  graficoHora: {
    fontFamily: fontFamilies.technical,
    fontSize: 9,
    color: colors.gray400,
    marginTop: spacing.s1,
    textAlign: "center",
  },
  graficoHoraDestaque: {
    color: colors.primary,
    fontFamily: fontFamilies.technicalBold,
  },
  graficoMetricas: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.s4,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
    marginTop: spacing.s3,
    gap: spacing.s2,
  },
  metricaItem: {
    flex: 1,
  },
  metricaLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    color: colors.gray400,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: spacing.s1,
  },
  metricaValor: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 18,
    color: colors.onSurface,
  },
  metricaValorAlerta: {
    color: colors.error,
  },
  metricaValorInfo: {
    color: colors.secondary,
  },

  // ─── Card balanço eletrolítico ────────────────────────────────────────────────

  cardBalanco: {
    flex: 1,
    minWidth: 180,
    backgroundColor: colors.surfaceContainerLow,
  },
  balancoTitulo: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: spacing.s4,
    lineHeight: 22,
  },
  balancoBloco: {
    marginBottom: spacing.s3,
  },
  balancoLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    color: colors.gray400,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: spacing.s1,
  },
  balancoValorRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: spacing.s2,
  },
  balancoValorGrande: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 30,
    color: colors.onSurface,
    lineHeight: 34,
  },
  balancoUnidade: {
    fontFamily: fontFamilies.technical,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  badgeDeplecao: {
    backgroundColor: "#FFF8EC",
    paddingHorizontal: spacing.s2,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  badgeDeplecaoText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    color: colors.warning,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  balancoDivider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: spacing.s3,
  },
  balancoTendIcone: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 18,
    color: colors.secondary,
  },
  balancoImagem: {
    height: 90,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: radius.md,
    marginTop: spacing.s3,
    justifyContent: "center",
    alignItems: "center",
  },
  balancoImagemTexto: {
    fontSize: 36,
  },

  // ─── Tabela laboratorial ──────────────────────────────────────────────────────

  tabelaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.s2,
    flexWrap: "wrap",
    gap: spacing.s2,
  },
  tabelaData: {
    fontFamily: fontFamilies.technical,
    fontSize: 10,
    color: colors.gray400,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  tabelaAcoes: {
    flexDirection: "row",
    gap: spacing.s2,
  },
  tabelaAcaoBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
  },
  tabelaAcaoIcon: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s2,
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
  },
  colNome: { flex: 2.2 },
  colLeitura: { flex: 1.4 },
  colRef: { flex: 1.6 },
  colStatus: { flex: 1.2 },
  colTendencia: { flex: 0.8, alignItems: "flex-end" },

  // ─── Linha de marcador ────────────────────────────────────────────────────────

  marcadorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s3,
  },
  marcadorRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  marcadorNome: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.onSurface,
    flex: 2.2,
  },
  marcadorLeitura: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
    color: colors.onSurface,
    flex: 1.4,
  },
  marcadorLeituraAlerta: {
    color: colors.error,
  },
  marcadorRef: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: colors.gray400,
    flex: 1.6,
  },
  marcadorStatusCol: {
    flex: 1.2,
  },
  marcadorTendenciaCol: {
    flex: 0.8,
    alignItems: "flex-end",
  },

  // ─── Badges status clínico ────────────────────────────────────────────────────

  badge: {
    paddingHorizontal: spacing.s2,
    paddingVertical: 3,
    borderRadius: radius.xs,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  badgeNormal: { backgroundColor: colors.surfaceContainerHigh },
  badgeNormalText: { color: colors.onSurfaceVariant },
  badgeElevado: { backgroundColor: "#FFF0F0" },
  badgeElevadoText: { color: colors.error },
  badgeLimitrofe: { backgroundColor: "#FFF8EC" },
  badgeLimitrofeText: { color: colors.warning },

  // ─── Tendências ───────────────────────────────────────────────────────────────

  tendencia: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 16,
  },
  tendEstavel: { color: colors.gray400 },
  tendSubindo: { color: colors.error },
  tendDescendo: { color: colors.secondary },

  // ─── Linha inferior ───────────────────────────────────────────────────────────

  linhaInferior: {
    flexDirection: "row",
    gap: spacing.s4,
    flexWrap: "wrap",
    marginBottom: spacing.s2,
  },

  // ─── Card protocolo ───────────────────────────────────────────────────────────

  cardProtocolo: {
    flex: 1,
    minWidth: 200,
  },
  protocoloCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.s3,
    marginBottom: spacing.s3,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  protocoloTag: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    color: colors.gray400,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: spacing.s2,
  },
  protocoloNome: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 17,
    color: colors.onSurface,
    lineHeight: 22,
    marginBottom: spacing.s3,
  },
  protocoloPassos: {
    gap: spacing.s2,
  },
  protocoloPasso: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.s2,
  },
  protocoloNumeroBox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surfaceContainerHighest,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  protocoloNumero: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  protocoloPassoDesc: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 17,
    flex: 1,
  },
  btnHistorico: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingVertical: spacing.s3,
    alignItems: "center",
  },
  btnHistoricoText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.onSurface,
    letterSpacing: 0.5,
  },

  // ─── Card quote ───────────────────────────────────────────────────────────────

  cardQuote: {
    flex: 1,
    minWidth: 180,
    justifyContent: "space-between",
  },
  quoteTexto: {
    marginBottom: spacing.s3,
    flex: 1,
  },
  quoteItalico: {
    fontFamily: fontFamilies.headlineItalic,
    fontSize: 22,
    color: colors.onSurface,
    lineHeight: 30,
  },
  quoteDesc: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: spacing.s4,
  },
  quoteAutor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s2,
  },
  quoteAvatarBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceContainerHighest,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteAvatarText: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  quoteAutorNome: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.onSurface,
    letterSpacing: 0.4,
  },
  quoteAutorCargo: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: colors.gray400,
  },

  // ─── Imagem placeholder ───────────────────────────────────────────────────────

  imagemPlaceholder: {
    flex: 1,
    minWidth: 140,
    minHeight: 180,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.s4,
  },
  imagemPlaceholderIcone: {
    fontSize: 48,
  },

  // ─── Rodapé de status ─────────────────────────────────────────────────────────

  rodapeStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    paddingVertical: spacing.s3,
    marginBottom: spacing.s4,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
    gap: spacing.s4,
  },
  rodapeStatusItem: {
    gap: spacing.s1,
  },
  rodapeStatusLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 8,
    letterSpacing: 0.6,
    color: colors.gray400,
    textTransform: "uppercase",
  },
  rodapeStatusValorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s1,
  },
  rodapeStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  rodapeStatusValor: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    color: colors.onSurface,
    letterSpacing: 0.3,
  },
  rodapeCopyright: {
    fontFamily: fontFamilies.technical,
    fontSize: 8,
    color: colors.gray400,
    letterSpacing: 0.4,
    alignSelf: "flex-end",
  },
});
