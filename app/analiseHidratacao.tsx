// app/analiseHidratacao.tsx
// Análise de Hidratação Individualizada — usada pelo resultado E pelo histórico
// Recebe `id` como parâmetro de rota. Se não vier, usa a sessão mais recente.
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { AclimatacaoChart } from "../src/components/duranteTreino/Aclimatacaochart";
import { AtletaAvatarMini } from "../src/components/shared/AtletaAvatar";
import SessaoGrafico from "../src/components/shared/SessaoGrafico";
import { colors, fontFamilies } from "../src/constants/theme";
import { agenteIA, climaAPI, type AgenteIAContrato, type ClimaAtualAPI } from "../src/services/api";
import { useAppStore } from "../src/store/useAppStore";
import { HydrationEntry } from "../src/types";

function getNivel(pct: number) {
  if (pct < 1) return { label: "HIDRATADO", color: colors.success };
  if (pct < 2) return { label: "LEVE",      color: "#F59E0B" };
  if (pct < 3) return { label: "MODERADA",  color: colors.warning };
  return            { label: "CRÍTICA",     color: colors.error };
}

export default function AnaliseHidratacao() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state } = useAppStore();

  // Busca a sessão pelo id ou usa a mais recente
  const entry: HydrationEntry | undefined = id
    ? state.historico.find(e => e.id === id)
    : state.historico[0];

  const [clima, setClima]           = useState<ClimaAtualAPI | null>(null);
  const [analise, setAnalise]       = useState<AgenteIAContrato | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [mostrarAnalise, setMostrarAnalise] = useState(false);

  useEffect(() => {
    climaAPI.buscarAtual(1).then(setClima).catch(() => null);
    const idSessao = state.idSessaoBackend;
    const idUsuario = state.idUsuarioBackend;
    if (idSessao && idUsuario && !id) {
      // Só chama IA para sessão recém-encerrada
      setCarregandoIA(true);
      agenteIA
        .analisarPos({ id_sessao: idSessao, id_usuario: idUsuario, id_local: 1 })
        .then(setAnalise)
        .catch(() => null)
        .finally(() => setCarregandoIA(false));
    }
  }, []);

  if (!entry) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 30 }}>
          <Text style={{ fontSize: 40, marginBottom: 16 }}>📭</Text>
          <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 13, color: colors.onSurfaceVariant, textAlign: "center", letterSpacing: 1 }}>
            SESSÃO NÃO ENCONTRADA
          </Text>
          <TouchableOpacity
            style={{ marginTop: 24, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 28 }}
            onPress={() => router.replace("/telaAtleta")}
          >
            <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 12, letterSpacing: 1, color: colors.white }}>
              VOLTAR AO PAINEL
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const nivel      = getNivel(entry.desidratacaoPct);
  const reposicaoL = (Math.max(0, entry.pesoPreKg - entry.pesoPosKg) * 1.5).toFixed(1);
  const horas      = Math.floor(entry.duracaoMin / 60);
  const min        = entry.duracaoMin % 60;
  const duracaoStr = horas > 0 ? `${horas}h ${min}m` : `${min}min`;
  const dataStr    = new Date(entry.dataISO).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const horaInicio = new Date(entry.dataISO);
  horaInicio.setMinutes(horaInicio.getMinutes() - entry.duracaoMin);
  const horaStr    = `${horaInicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} – ${new Date(entry.dataISO).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  const isCritica  = entry.desidratacaoPct >= 2;

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={s.topTitle}>ATLETA</Text>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <AtletaAvatarMini size={36} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.sectionHeader}>RESUMO DE PERFORMANCE</Text>
        <Text style={s.pageTitle}>Análise de Hidratação Individualizada</Text>
        <Text style={s.pageDate}>📅 {dataStr} 🕒 {horaStr}</Text>

        {/* ── Gráfico visual da sessão ────────────────────────────────── */}
        <SessaoGrafico entry={entry} />

        {/* ── Clima ──────────────────────────────────────────────────── */}
        {clima && (
          <View style={[xc.card, { borderLeftColor: clima.condicao === "CONFORTAVEL" ? colors.success : clima.condicao === "ATENCAO" ? colors.warning : colors.error }]}>
            <Text style={xc.titulo}>🌡️ Clima Durante o Treino</Text>
            <View style={xc.grid}>
              <View style={xc.gi}><Text style={xc.gv}>{clima.temperatura_c.toFixed(1)}°C</Text><Text style={xc.gl}>Temperatura</Text></View>
              <View style={xc.gi}><Text style={xc.gv}>{clima.umidade_pct.toFixed(0)}%</Text><Text style={xc.gl}>Umidade</Text></View>
              <View style={xc.gi}><Text style={xc.gv}>{clima.indice_calor_c.toFixed(1)}°C</Text><Text style={xc.gl}>Índice calor</Text></View>
            </View>
            <Text style={xc.sub}>{clima.descricao_condicao} · {clima.fonte}</Text>
          </View>
        )}

        {/* ── Agente IA (só para sessão recém-encerrada) ───────────── */}
        {carregandoIA && (
          <View style={[xc.card, { alignItems: "center", paddingVertical: 20 }]}>
            <ActivityIndicator color={colors.primaryContainer} />
            <Text style={[xc.sub, { marginTop: 8 }]}>Agente IA analisando resultado...</Text>
          </View>
        )}
        {!carregandoIA && analise && (
          <View style={[xc.card, { borderLeftColor: analise.status_sessao === "ESTÁVEL" ? colors.success : analise.status_sessao === "ATENÇÃO" ? colors.warning : colors.error }]}>
            <View style={xc.row}>
              <Text style={xc.titulo}>🤖 Análise Pós-Treino (IA)</Text>
              <View style={[xc.badge, { backgroundColor: (analise.status_sessao === "ESTÁVEL" ? colors.success : colors.warning) + "22" }]}>
                <Text style={[xc.badgeText, { color: analise.status_sessao === "ESTÁVEL" ? colors.success : colors.warning }]}>
                  {analise.status_sessao}
                </Text>
              </View>
            </View>
            {analise.disparar_alerta_push && (
              <View style={{ backgroundColor: "#FFF3CD", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <Text style={{ color: "#856404", fontSize: 12 }}>⚠️ {analise.mensagem_notificacao}</Text>
              </View>
            )}
            <Text style={[xc.sub, { fontWeight: "600", marginBottom: 4, color: colors.onSurface }]}>
              💧 Reposição recomendada: {analise.recomendacao_hidratacao_ml} mL
            </Text>
            <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginVertical: 8 }} />
            <Text style={[xc.sub, { fontStyle: "italic" }]}>{analise.analise_clinica_comentario}</Text>
          </View>
        )}

        {/* ── Detalhes numéricos ──────────────────────────────────────── */}
        <View style={xc.card}>
          <Text style={xc.titulo}>📋 Detalhes da Sessão</Text>
          {[
            ["Tipo",           entry.tipoTreino],
            ["Intensidade",    entry.intensidade],
            ["Duração",        duracaoStr],
            ["Água consumida", `${entry.aguaConsumidaML} ml`],
            ["Peso pré",       `${entry.pesoPreKg.toFixed(1)} kg`],
            ["Peso pós",       `${entry.pesoPosKg.toFixed(1)} kg`],
            ["Recuperação",    `${entry.recuperacaoPct}%`],
          ].map(([label, value]) => (
            <View key={label} style={xc.detRow}>
              <Text style={xc.detLabel}>{label}</Text>
              <Text style={xc.detValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* ── Análise Avançada (expansível) ──────────────────────────── */}
        <TouchableOpacity
          style={[xc.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
          onPress={() => setMostrarAnalise(v => !v)}
          activeOpacity={0.8}
        >
          <Text style={xc.titulo}>📊 Análise Avançada (Aclimatação, Eletrólitos...)</Text>
          <Text style={{ fontSize: 18, color: colors.primary }}>{mostrarAnalise ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        {mostrarAnalise && <AclimatacaoChart entryOverride={entry} />}

        {/* ── Recomendação ─────────────────────────────────────────── */}
        <View style={s.cardDark}>
          <Text style={s.darkTitle}>Recomendação de Reposição</Text>
          <Text style={s.darkDesc}>
            Para otimizar sua recuperação pós-treino, consuma 150% do peso perdido nas próximas 4 horas.
          </Text>
          <View style={s.darkBox}>
            <Text style={s.darkBoxLabel}>VOLUME ALVO</Text>
            <Text style={s.darkBoxVal}>{reposicaoL}<Text style={s.darkBoxUnit}> LITROS</Text></Text>
          </View>
        </View>

        {/* ── Botões ───────────────────────────────────────────────── */}
        {!id && (
          <TouchableOpacity
            style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 16, alignItems: "center", marginBottom: 12 }}
            onPress={() => router.replace("/telaAtleta")}
          >
            <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 13, letterSpacing: 1, color: colors.white }}>
              VOLTAR AO PAINEL
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ borderWidth: 1.5, borderColor: colors.outlineVariant, borderRadius: 10, paddingVertical: 16, alignItems: "center", marginBottom: 24 }}
          onPress={() => router.push("/historico")}
        >
          <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 13, letterSpacing: 1, color: colors.onSurface }}>
            {id ? "← VOLTAR AO HISTÓRICO" : "VER HISTÓRICO COMPLETO"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.surface },
  topBar:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  backBtn:     { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  backTxt:     { fontSize: 22, color: colors.onSurface },
  topTitle:    { fontFamily: fontFamilies.technicalBold, fontSize: 13, letterSpacing: 3, color: colors.onSurface },
  scroll:      { padding: 20, paddingBottom: 40 },
  sectionHeader: { fontFamily: fontFamilies.technicalBold, fontSize: 10, letterSpacing: 2, color: colors.onSurfaceVariant, marginBottom: 4 },
  pageTitle:   { fontFamily: fontFamilies.headlineBold, fontSize: 22, color: colors.onSurface, lineHeight: 28, marginBottom: 4 },
  pageDate:    { fontFamily: fontFamilies.technical, fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 16 },
  cardDark:    { backgroundColor: colors.primary, borderRadius: 14, padding: 20, marginBottom: 16 },
  darkTitle:   { fontFamily: fontFamilies.headlineBold, fontSize: 18, color: "#fff", marginBottom: 8 },
  darkDesc:    { fontFamily: fontFamilies.technical, fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 19, marginBottom: 16 },
  darkBox:     { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 14, alignItems: "center" },
  darkBoxLabel:{ fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 1.5, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  darkBoxVal:  { fontFamily: fontFamilies.headlineBold, fontSize: 32, color: "#fff" },
  darkBoxUnit: { fontFamily: fontFamilies.technicalBold, fontSize: 14, color: "rgba(255,255,255,0.8)" },
});

const xc = StyleSheet.create({
  card:      { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: colors.outlineVariant, borderWidth: 1, borderColor: colors.surfaceContainerHigh },
  row:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  titulo:    { fontFamily: fontFamilies.technicalBold, fontSize: 13, color: colors.onSurface, flex: 1 },
  badge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontFamily: fontFamilies.technicalBold, fontSize: 10 },
  grid:      { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  gi:        { alignItems: "center" },
  gv:        { fontFamily: fontFamilies.headlineBold, fontSize: 18, color: colors.onSurface },
  gl:        { fontFamily: fontFamilies.technical, fontSize: 10, color: colors.onSurfaceVariant, marginTop: 2 },
  sub:       { fontFamily: fontFamilies.technical, fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18 },
  detRow:    { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderColor: colors.outlineVariant },
  detLabel:  { fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant },
  detValue:  { fontFamily: fontFamilies.technicalBold, fontSize: 13, color: colors.onSurface },
});
