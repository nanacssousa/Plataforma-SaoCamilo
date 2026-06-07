// src/components/duranteTreino/AclimatacaoChart.tsx
// Gráfico de Aclimatação, Análise de Eletrólitos, Triagem de Risco e Detecção de Inconsistências
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fontFamilies } from "../../constants/theme";
import { climaAPI, type ClimaAtualAPI } from "../../services/api";
import { useAppStore } from "../../store/useAppStore";

// ─── Paleta local ─────────────────────────────────────────────────────────────
const P = {
  red:    "#a40000",
  redBg:  "#fdf5f5",
  redLight:"#f6e1e1",
  border: "#ecc8c8",
  text:   "#2c1a1a",
  muted:  "#a08080",
  success:"#1A6B35",
  warn:   "#A05C0A",
  warnBg: "#FFF8EC",
  blue:   "#0062a1",
  blueBg: "#EFF6FF",
  white:  "#ffffff",
};

// ─── Tipos internos ───────────────────────────────────────────────────────────
type Aba = "aclimatacao" | "eletrolitos" | "triagem" | "inconsistencias";

interface PontoGrafico {
  label: string;   // "S1", "S2" …
  taxa: number;    // L/h
  temp: number;    // °C ambiente estimada
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function classificarTaxa(taxa: number): { cor: string; label: string } {
  if (taxa < 0.5) return { cor: P.blue,    label: "BAIXA" };
  if (taxa < 1.2) return { cor: P.success, label: "NORMAL" };
  if (taxa < 1.8) return { cor: P.warn,    label: "ELEVADA" };
  return           { cor: P.red,    label: "CRÍTICA" };
}

function estimarNaSodio(taxa: number, temCaibras: boolean): number {
  // Estimativa média: 30–60 mmol/L no suor; ajustada por taxa e histórico de cãibras
  const base = 40;
  const ajusteTaxa = taxa > 1.5 ? 8 : taxa > 1.0 ? 4 : 0;
  const ajusteCaibras = temCaibras ? 10 : 0;
  return Math.min(75, base + ajusteTaxa + ajusteCaibras);
}

function detectarInconsistencias(taxa: number, durMin: number, aguaML: number): string[] {
  const alertas: string[] = [];
  if (taxa > 3.5) alertas.push("Taxa de sudorese muito alta (>3,5 L/h) — verifique as pesagens.");
  if (taxa < 0.1 && durMin > 20) alertas.push("Taxa muito baixa para duração >20 min — revise os pesos.");
  if (aguaML > 0 && aguaML / durMin > 50) alertas.push("Ingestão muito rápida (>50 ml/min) — risco de hiponatremia.");
  if (durMin > 0 && aguaML === 0) alertas.push("Nenhuma hidratação registrada — adicione o consumo real.");
  return alertas;
}

// ─── Sub-componente: barra de gráfico ─────────────────────────────────────────
function BarraGrafico({ ponto, maxTaxa, larguraTotal }: { ponto: PontoGrafico; maxTaxa: number; larguraTotal: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const pct = maxTaxa > 0 ? ponto.taxa / maxTaxa : 0;
  const { cor } = classificarTaxa(ponto.taxa);

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 600, useNativeDriver: false }).start();
  }, [pct]);

  const barWidth = anim.interpolate({ inputRange: [0, 1], outputRange: [0, larguraTotal * 0.72] });

  return (
    <View style={gc.barRow}>
      <Text style={gc.barLabel}>{ponto.label}</Text>
      <View style={gc.barTrack}>
        <Animated.View style={[gc.barFill, { width: barWidth, backgroundColor: cor }]} />
      </View>
      <Text style={[gc.barValue, { color: cor }]}>{ponto.taxa.toFixed(1)}</Text>
    </View>
  );
}

// ─── Sub-componente: abas ─────────────────────────────────────────────────────
function Aba({ label, ativo, onPress }: { label: string; ativo: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[gc.aba, ativo && gc.abaAtiva]}
      activeOpacity={0.75}
    >
      <Text style={[gc.abaText, ativo && gc.abaTextAtiva]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function AclimatacaoChart({ entryOverride }: { entryOverride?: import('../../types').HydrationEntry } = {}) {
  const { state } = useAppStore();
const { historico, sessaoAtiva } = state;

// Se vier entryOverride (histórico), usa os dados dele como contexto da sessão ativa simulada
const sintomasRef = entryOverride?.sintomasPre ?? sessaoAtiva?.sintomasPre ?? [];
const corUrinaRef = entryOverride?.corUrinaPre ?? sessaoAtiva?.corUrinaPre ?? "";
const sedeRef = entryOverride?.sede ?? sessaoAtiva?.sede ?? 5;
const aguaMLRef = entryOverride?.aguaConsumidaML ?? sessaoAtiva?.aguaML ?? 0;
const durMinRef = entryOverride?.duracaoMin ?? (
  sessaoAtiva
    ? Math.round(
        (Date.now() - new Date(sessaoAtiva.iniciadaEm).getTime()) / 60000
      )
    : 0
);

const [abaAtiva, setAbaAtiva] = useState<Aba>("aclimatacao");
const [clima, setClima] = useState<ClimaAtualAPI | null>(null);
  // Busca clima automaticamente
  useEffect(() => {
    climaAPI.buscarAtual(1).then(setClima).catch(() => null);
  }, []);

  // ── Dados do gráfico de aclimatação ─────────────────────────────────────
  const pontos: PontoGrafico[] = useMemo(() => {
    const ultimas = [...historico].slice(0, 8).reverse();
    return ultimas.map((e, i) => ({
      label: `S${i + 1}`,
      taxa: e.taxaSudorese,
      temp: clima ? clima.temperatura_c : 25,
    }));
  }, [historico, clima]);

  const maxTaxa = useMemo(() => Math.max(...pontos.map(p => p.taxa), 1), [pontos]);
  const taxaMedia = useMemo(() =>
    pontos.length ? pontos.reduce((s, p) => s + p.taxa, 0) / pontos.length : 0,
  [pontos]);

  // ── Análise de eletrólitos ───────────────────────────────────────────────
  const temCaibras = sintomasRef.includes("caibras");
  const naEstimado = estimarNaSodio(taxaMedia, temCaibras);
  const perdaNaTotal = taxaMedia > 0
    ? ((taxaMedia * (durMinRef / 60 || 1)) * naEstimado).toFixed(0)
    : "0";

  // ── Triagem de risco ─────────────────────────────────────────────────────
  const aguaML = aguaMLRef;
  const durMin = durMinRef;
  const riscoHipo = aguaML > 0 && durMin > 0 && (aguaML / durMin) > 40;
  const riscoDesid = taxaMedia > 1.5;
  const sintomasAtivos = sintomasRef;

  // ── Inconsistências ──────────────────────────────────────────────────────
  const inconsistencias = detectarInconsistencias(taxaMedia, durMin, aguaML);

  // ── Tendência sazonal (últimas 4 semanas vs. anteriores) ────────────────
  const agora = Date.now();
  const recent  = historico.filter(e => agora - new Date(e.dataISO).getTime() < 28 * 86400000);
  const antigo  = historico.filter(e => agora - new Date(e.dataISO).getTime() >= 28 * 86400000);
  const mediaRecent = recent.length  ? recent.reduce((s, e) => s + e.taxaSudorese, 0) / recent.length  : 0;
  const mediaAntigo = antigo.length  ? antigo.reduce((s, e) => s + e.taxaSudorese, 0) / antigo.length  : 0;
  const tendencia = mediaRecent - mediaAntigo;

  return (
    <View style={gc.container}>
      {/* Título */}
      <View style={gc.titleRow}>
        <Text style={gc.title}>📊 Análise Avançada</Text>
        {clima && (
          <View style={gc.climaBadge}>
            <Text style={gc.climaText}>🌡️ {clima.temperatura_c.toFixed(0)}°C · {clima.umidade_pct.toFixed(0)}%</Text>
          </View>
        )}
      </View>

      {/* Abas */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={gc.abasScroll}>
        <Aba label="ACLIMATAÇÃO" ativo={abaAtiva === "aclimatacao"} onPress={() => setAbaAtiva("aclimatacao")} />
        <Aba label="ELETRÓLITOS" ativo={abaAtiva === "eletrolitos"} onPress={() => setAbaAtiva("eletrolitos")} />
        <Aba label="TRIAGEM" ativo={abaAtiva === "triagem"} onPress={() => setAbaAtiva("triagem")} />
        <Aba label="INCONSISTÊNCIAS" ativo={abaAtiva === "inconsistencias"} onPress={() => setAbaAtiva("inconsistencias")} />
      </ScrollView>

      {/* ── ABA ACLIMATAÇÃO ─────────────────────────────────────────────── */}
      {abaAtiva === "aclimatacao" && (
        <View>
          {pontos.length === 0 ? (
            <View style={gc.emptyBox}>
              <Text style={gc.emptyText}>Complete sessões para ver o gráfico de aclimatação.</Text>
            </View>
          ) : (
            <>
              <View style={gc.grafBox}>
                <Text style={gc.grafSub}>TAXA DE SUDORESE POR SESSÃO (L/h)</Text>
                <View style={gc.grafico}>
                  {pontos.map((p, i) => (
                    <BarraGrafico key={i} ponto={p} maxTaxa={maxTaxa} larguraTotal={260} />
                  ))}
                </View>
              </View>

              {/* Tendência sazonal */}
              <View style={gc.infoRow}>
                <View style={[gc.infoCard, { flex: 1 }]}>
                  <Text style={gc.infoLabel}>TENDÊNCIA 28 DIAS</Text>
                  <Text style={[gc.infoValue, { color: tendencia > 0 ? P.warn : P.success }]}>
                    {tendencia > 0 ? "▲" : "▼"} {Math.abs(tendencia).toFixed(2)} L/h
                  </Text>
                  <Text style={gc.infoSub}>
                    {tendencia > 0
                      ? "Sudorese crescente — revise aclimatação ao calor"
                      : "Sudorese estável ou decrescente — boa adaptação"}
                  </Text>
                </View>
                <View style={[gc.infoCard, { flex: 1, marginLeft: 8 }]}>
                  <Text style={gc.infoLabel}>TEMP. AMBIENTE</Text>
                  <Text style={gc.infoValue}>{clima ? `${clima.temperatura_c.toFixed(1)}°C` : "—"}</Text>
                  <Text style={gc.infoSub}>{clima ? clima.descricao_condicao : "Sem dados climáticos"}</Text>
                </View>
              </View>

              <View style={gc.feedCard}>
                <Text style={gc.feedTitle}>💡 Feedforward para próximas sessões</Text>
                <Text style={gc.feedText}>
                  {taxaMedia > 1.5
                    ? `Taxa média elevada (${taxaMedia.toFixed(1)} L/h). Inicie a próxima sessão com 400–600 ml antes do treino e reponha 500 ml/h durante.`
                    : taxaMedia > 0
                    ? `Taxa média de ${taxaMedia.toFixed(1)} L/h. Mantenha reposição de ${Math.round(taxaMedia * 500)} ml/h durante o treino.`
                    : "Sem sessões anteriores. Registre treinos para receber recomendações personalizadas."}
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* ── ABA ELETRÓLITOS ─────────────────────────────────────────────── */}
      {abaAtiva === "eletrolitos" && (
        <View>
          <View style={gc.modCard}>
            <Text style={gc.modTitle}>⚗️ Módulo Avançado — Estimativa de Eletrólitos</Text>
            <View style={gc.modRow}>
              <View style={gc.modItem}>
                <Text style={gc.modLabel}>SÓDIO ESTIMADO NO SUOR</Text>
                <Text style={gc.modValue}>{naEstimado} mmol/L</Text>
                <Text style={gc.modSub}>Base: concentração média de 40 mmol/L ajustada por taxa e histórico de cãibras</Text>
              </View>
              <View style={gc.modItem}>
                <Text style={gc.modLabel}>PERDA NA TOTAL (SESSÃO)</Text>
                <Text style={[gc.modValue, { color: Number(perdaNaTotal) > 50 ? P.warn : P.success }]}>
                  {perdaNaTotal} mmol
                </Text>
                <Text style={gc.modSub}>Estimativa baseada em taxa × duração × concentração</Text>
              </View>
            </View>
          </View>

          <View style={[gc.modCard, { backgroundColor: P.warnBg, borderColor: "#f0c070" }]}>
            <Text style={[gc.modTitle, { color: P.warn }]}>🧂 Alternativa Prática (sem laboratório)</Text>
            {[
              { icon: "💧", text: "Suor salgado (gosto ou cristais brancos na pele)", ativo: naEstimado > 55 },
              { icon: "👕", text: "Marcas de sal nas roupas após treino",              ativo: naEstimado > 50 },
              { icon: "⚡", text: "Histórico de cãibras musculares",                   ativo: temCaibras },
            ].map((item, i) => (
              <View key={i} style={gc.checkRow}>
                <Text style={gc.checkIcon}>{item.ativo ? "✅" : "⬜"}</Text>
                <Text style={[gc.checkText, item.ativo && { color: P.warn, fontFamily: fontFamilies.technicalBold }]}>
                  {item.icon} {item.text}
                </Text>
              </View>
            ))}
            <Text style={gc.disclaimer}>⚠️ Não substitui medidas laboratoriais. Consulte nutricionista esportivo.</Text>
          </View>
        </View>
      )}

      {/* ── ABA TRIAGEM ─────────────────────────────────────────────────── */}
      {abaAtiva === "triagem" && (
        <View>
          <Text style={gc.triagemSub}>MÓDULO DE TRIAGEM DE RISCO</Text>

          {/* Hipoidratação */}
          <View style={[gc.riskCard, riscoDesid && gc.riskCardAtivo]}>
            <View style={gc.riskHeader}>
              <Text style={gc.riskTitle}>🔴 Hipoidratação</Text>
              <View style={[gc.riskBadge, { backgroundColor: riscoDesid ? "#fce4e4" : "#e8f5e9" }]}>
                <Text style={[gc.riskBadgeText, { color: riscoDesid ? P.red : P.success }]}>
                  {riscoDesid ? "RISCO DETECTADO" : "NORMAL"}
                </Text>
              </View>
            </View>
            {[
              "Sede intensa (sede > 7)",
              "Urina escura (cor ≥ 4)",
              "Taxa de sudorese > 1,5 L/h",
              "Tontura ou fadiga reportada",
            ].map((s, i) => {
              const corUrinaRef = Number(
                entryOverride?.corUrinaPre ??
                sessaoAtiva?.corUrinaPre ??
                1
              );
              const ativo =
                i === 0 ? (sedeRef) > 7 :
                i === 1 ? (corUrinaRef) >= 4 :
                i === 2 ? taxaMedia > 1.5 :
                sintomasAtivos.includes("tontura") || sintomasAtivos.includes("fadiga");
              return (
                <View key={i} style={gc.checkRow}>
                  <Text style={gc.checkIcon}>{ativo ? "⚠️" : "✅"}</Text>
                  <Text style={[gc.checkText, ativo && { color: P.warn }]}>{s}</Text>
                </View>
              );
            })}
          </View>
          

          {/* Hiperidratação */}
          <View style={[gc.riskCard, riscoHipo && gc.riskCardAtivoBlue]}>
            <View style={gc.riskHeader}>
              <Text style={gc.riskTitle}>🔵 Hiperidratação / Hiponatremia</Text>
              <View style={[gc.riskBadge, { backgroundColor: riscoHipo ? "#dbeafe" : "#e8f5e9" }]}>
                <Text style={[gc.riskBadgeText, { color: riscoHipo ? P.blue : P.success }]}>
                  {riscoHipo ? "ATENÇÃO" : "NORMAL"}
                </Text>
              </View>
            </View>
            {[
              "Ingestão > 800 ml/h",
              "Sintomas: náusea, cefaleia",
              "Taxa muito baixa com alta ingestão",
            ].map((s, i) => {
              const ativo =
                i === 0 ? riscoHipo :
                i === 1 ? sintomasAtivos.includes("tontura") :
                taxaMedia < 0.3 && aguaML > 500;
              return (
                <View key={i} style={gc.checkRow}>
                  <Text style={gc.checkIcon}>{ativo ? "⚠️" : "✅"}</Text>
                  <Text style={[gc.checkText, ativo && { color: P.blue }]}>{s}</Text>
                </View>
              );
            })}
          </View>

          <View style={gc.encaminhBox}>
            <Text style={gc.encaminhTitle}>📋 Regra de Segurança</Text>
            <Text style={gc.encaminhText}>
              Sinais de confusão mental, convulsões ou perda de consciência requerem encaminhamento imediato para avaliação médica. Não continue o treino.
            </Text>
          </View>
        </View>
      )}

      {/* ── ABA INCONSISTÊNCIAS ──────────────────────────────────────────── */}
      {abaAtiva === "inconsistencias" && (
        <View>
          <Text style={gc.triagemSub}>DETECÇÃO DE VALORES IMPLAUSÍVEIS</Text>

          {inconsistencias.length === 0 ? (
            <View style={[gc.riskCard, { borderColor: "#a5d6a7", backgroundColor: "#e8f5e9" }]}>
              <Text style={[gc.riskTitle, { color: P.success }]}>✅ Nenhuma inconsistência detectada</Text>
              <Text style={gc.checkText}>Todos os valores estão dentro dos limites esperados para o perfil do atleta.</Text>
            </View>
          ) : (
            inconsistencias.map((msg, i) => (
              <View key={i} style={[gc.riskCard, gc.riskCardAtivo]}>
                <Text style={gc.riskTitle}>⚠️ Alerta #{i + 1}</Text>
                <Text style={[gc.checkText, { color: P.warn }]}>{msg}</Text>
              </View>
            ))
          )}

          <View style={[gc.feedCard, { marginTop: 8 }]}>
            <Text style={gc.feedTitle}>🔁 Sugestão de Repetição</Text>
            <Text style={gc.feedText}>
              {inconsistencias.length > 0
                ? "Repita a pesagem com balança calibrada em superfície plana, com roupa mínima e bexiga vazia. Confirme o horário de início da sessão."
                : "Medições consistentes. Continue registrando para melhorar a precisão do modelo preditivo."}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const gc = StyleSheet.create({
  container:      { backgroundColor: P.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: P.border },
  titleRow:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title:          { fontFamily: fontFamilies.technicalBold, fontSize: 13, color: P.text },
  climaBadge:     { backgroundColor: P.redLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  climaText:      { fontFamily: fontFamilies.technical, fontSize: 11, color: P.red },

  abasScroll:     { marginBottom: 14 },
  aba:            { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: P.redBg, borderWidth: 1, borderColor: P.border },
  abaAtiva:       { backgroundColor: P.red, borderColor: P.red },
  abaText:        { fontFamily: fontFamilies.technicalBold, fontSize: 10, letterSpacing: 1, color: P.muted },
  abaTextAtiva:   { color: P.white },

  grafBox:        { backgroundColor: P.redBg, borderRadius: 12, padding: 12, marginBottom: 10 },
  grafSub:        { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 1, color: P.muted, marginBottom: 10 },
  grafico:        { gap: 6 },
  barRow:         { flexDirection: "row", alignItems: "center", gap: 8 },
  barLabel:       { fontFamily: fontFamilies.technicalBold, fontSize: 10, color: P.muted, width: 24, textAlign: "right" },
  barTrack:       { flex: 1, height: 14, backgroundColor: P.redLight, borderRadius: 7, overflow: "hidden" },
  barFill:        { height: 14, borderRadius: 7 },
  barValue:       { fontFamily: fontFamilies.technicalBold, fontSize: 10, width: 30, textAlign: "right" },

  infoRow:        { flexDirection: "row", marginBottom: 10 },
  infoCard:       { backgroundColor: P.redBg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: P.border },
  infoLabel:      { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 1, color: P.muted, marginBottom: 4 },
  infoValue:      { fontFamily: fontFamilies.headlineBold, fontSize: 20, color: P.text, marginBottom: 2 },
  infoSub:        { fontFamily: fontFamilies.technical, fontSize: 11, color: P.muted, lineHeight: 15 },

  feedCard:       { backgroundColor: "#fffbf0", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#f0c070" },
  feedTitle:      { fontFamily: fontFamilies.technicalBold, fontSize: 11, color: P.warn, marginBottom: 6 },
  feedText:       { fontFamily: fontFamilies.technical, fontSize: 12, color: "#7a4c00", lineHeight: 18 },

  modCard:        { backgroundColor: P.redBg, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: P.border },
  modTitle:       { fontFamily: fontFamilies.technicalBold, fontSize: 11, color: P.text, marginBottom: 10 },
  modRow:         { flexDirection: "row", gap: 10 },
  modItem:        { flex: 1 },
  modLabel:       { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 1, color: P.muted, marginBottom: 4 },
  modValue:       { fontFamily: fontFamilies.headlineBold, fontSize: 22, color: P.text, marginBottom: 2 },
  modSub:         { fontFamily: fontFamilies.technical, fontSize: 10, color: P.muted, lineHeight: 14 },

  checkRow:       { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  checkIcon:      { fontSize: 14, width: 20 },
  checkText:      { fontFamily: fontFamilies.technical, fontSize: 12, color: P.text, flex: 1, lineHeight: 18 },
  disclaimer:     { fontFamily: fontFamilies.technical, fontSize: 10, color: P.muted, marginTop: 8, fontStyle: "italic" },

  triagemSub:     { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 1.5, color: P.muted, marginBottom: 10 },
  riskCard:       { borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1.5, borderColor: P.border, backgroundColor: P.white },
  riskCardAtivo:  { borderColor: "#f0a0a0", backgroundColor: "#fff5f5" },
  riskCardAtivoBlue: { borderColor: "#93c5fd", backgroundColor: "#eff6ff" },
  riskHeader:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  riskTitle:      { fontFamily: fontFamilies.technicalBold, fontSize: 12, color: P.text },
  riskBadge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  riskBadgeText:  { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 1 },

  encaminhBox:    { backgroundColor: "#fff3cd", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#ffc107" },
  encaminhTitle:  { fontFamily: fontFamilies.technicalBold, fontSize: 11, color: "#7a5c00", marginBottom: 6 },
  encaminhText:   { fontFamily: fontFamilies.technical, fontSize: 12, color: "#7a5c00", lineHeight: 18 },

  emptyBox:       { padding: 24, alignItems: "center" },
  emptyText:      { fontFamily: fontFamilies.technical, fontSize: 13, color: P.muted, textAlign: "center" },
});

export default AclimatacaoChart;
