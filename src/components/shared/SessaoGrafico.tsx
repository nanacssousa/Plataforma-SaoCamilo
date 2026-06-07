// src/components/shared/SessaoGrafico.tsx
// Gráfico visual de uma sessão — usado no resultado e no histórico
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors, fontFamilies } from "../../constants/theme";
import { HydrationEntry } from "../../types/index";

// ─── Barra animada ─────────────────────────────────────────────────────────────
function BarraAnimada({
  pct, cor, label, valor,
}: { pct: number; cor: string; label: string; valor: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 700, useNativeDriver: false }).start();
  }, [pct]);
  const w = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });
  return (
    <View style={gs.barRow}>
      <Text style={gs.barLabel}>{label}</Text>
      <View style={gs.barTrack}>
        <Animated.View style={[gs.barFill, { width: w, backgroundColor: cor }]} />
      </View>
      <Text style={[gs.barVal, { color: cor }]}>{valor}</Text>
    </View>
  );
}

// ─── Círculo de progresso simples ──────────────────────────────────────────────
function CirculoMetrica({
  valor, label, cor, unidade,
}: { valor: string; label: string; cor: string; unidade: string }) {
  return (
    <View style={gs.circulo}>
      <View style={[gs.circuloBorda, { borderColor: cor }]}>
        <Text style={[gs.circuloValor, { color: cor }]}>{valor}</Text>
        <Text style={gs.circuloUnidade}>{unidade}</Text>
      </View>
      <Text style={gs.circuloLabel}>{label}</Text>
    </View>
  );
}

// ─── Principal ─────────────────────────────────────────────────────────────────
export default function SessaoGrafico({ entry }: { entry: HydrationEntry }) {
  // Zona de sudorese
  const taxaZona =
    entry.taxaSudorese < 1   ? { cor: colors.success, label: "SEGURA",   pct: (entry.taxaSudorese / 1) * 33 } :
    entry.taxaSudorese < 1.5 ? { cor: colors.warning, label: "MODERADA", pct: 33 + ((entry.taxaSudorese - 1) / 0.5) * 33 } :
                                { cor: colors.error,   label: "CRÍTICA",  pct: Math.min(100, 66 + ((entry.taxaSudorese - 1.5) / 1) * 34) };

  // Hidratação vs perda
  const perdaML    = Math.max(0, entry.pesoPreKg - entry.pesoPosKg) * 1000;
  const saldoML    = entry.aguaConsumidaML - perdaML;
  const totalRef   = Math.max(perdaML + entry.aguaConsumidaML, 1);
  const pctAgua    = Math.min(100, (entry.aguaConsumidaML / totalRef) * 100);
  const pctPerda   = Math.min(100, (perdaML / totalRef) * 100);

  // Duração formatada
  const h   = Math.floor(entry.duracaoMin / 60);
  const min = entry.duracaoMin % 60;
  const durStr = h > 0 ? `${h}h${min}m` : `${min}m`;

  // Nível desidratação
  const nivCor =
    entry.desidratacaoPct < 1 ? colors.success :
    entry.desidratacaoPct < 2 ? "#F59E0B" :
    entry.desidratacaoPct < 3 ? colors.warning : colors.error;

  return (
    <View style={gs.container}>
      <Text style={gs.titulo}>📊 Gráfico da Sessão</Text>

      {/* ── Círculos de métricas principais ─────────────────────────────── */}
      <View style={gs.circulos}>
        <CirculoMetrica
          valor={entry.taxaSudorese.toFixed(1)}
          unidade="L/h"
          label="SUDORESE"
          cor={taxaZona.cor}
        />
        <CirculoMetrica
          valor={entry.desidratacaoPct.toFixed(1)}
          unidade="%"
          label="DÉFICIT"
          cor={nivCor}
        />
        <CirculoMetrica
          valor={durStr}
          unidade=""
          label="DURAÇÃO"
          cor={colors.secondary}
        />
        <CirculoMetrica
          valor={String(entry.recuperacaoPct)}
          unidade="%"
          label="RECUPER."
          cor={entry.recuperacaoPct >= 80 ? colors.success : colors.warning}
        />
      </View>

      {/* ── Barras comparativas ──────────────────────────────────────────── */}
      <View style={gs.barSection}>
        <Text style={gs.barSectionLabel}>BALANÇO HÍDRICO DA SESSÃO</Text>

        <BarraAnimada
          pct={pctAgua}
          cor={colors.secondary}
          label="INGESTÃO"
          valor={`${entry.aguaConsumidaML}ml`}
        />
        <BarraAnimada
          pct={pctPerda}
          cor={colors.error}
          label="PERDA"
          valor={`${Math.round(perdaML)}ml`}
        />
        <BarraAnimada
          pct={entry.recuperacaoPct}
          cor={entry.recuperacaoPct >= 80 ? colors.success : colors.warning}
          label="RECUPER."
          valor={`${entry.recuperacaoPct}%`}
        />
      </View>

      {/* ── Zona de sudorese ─────────────────────────────────────────────── */}
      <View style={gs.zonaContainer}>
        <Text style={gs.barSectionLabel}>ZONA DE SUDORESE</Text>
        <View style={gs.zonaTrack}>
          <View style={[gs.zonaSegmento, { backgroundColor: colors.success }]} />
          <View style={[gs.zonaSegmento, { backgroundColor: colors.warning }]} />
          <View style={[gs.zonaSegmento, { backgroundColor: colors.error }]} />
        </View>

        <View style={gs.zonaLabels}>
          <Text style={gs.zonaLabel}>SEGURA{"\n"}&lt; 1 L/h</Text>
          <Text style={gs.zonaLabel}>MODERADA{"\n"}1–1,5</Text>
          <Text style={gs.zonaLabel}>CRÍTICA{"\n"}&gt; 1,5</Text>
        </View>

        {/* Indicador na zona */}
        <View style={[gs.zonaIndicador, { left: `${taxaZona.pct}%` as any, backgroundColor: taxaZona.cor }]}>
          <Text style={gs.zonaIndicadorText}>{entry.taxaSudorese.toFixed(1)}</Text>
        </View>
      </View>

      {/* ── Saldo hídrico final ──────────────────────────────────────────── */}
      <View style={[gs.saldoCard, { borderColor: saldoML >= 0 ? colors.success : colors.error }]}>
        <Text style={gs.saldoLabel}>SALDO HÍDRICO FINAL</Text>
        <Text style={[gs.saldoValor, { color: saldoML >= 0 ? colors.success : colors.error }]}>
          {saldoML >= 0 ? "+" : ""}{Math.round(saldoML)} ml
        </Text>
        <Text style={gs.saldoSub}>
          {saldoML >= 0
            ? "Ingestão compensou a perda por sudorese."
            : `Déficit de ${Math.abs(Math.round(saldoML))} ml. Reponha ${(Math.abs(saldoML) * 1.5 / 1000).toFixed(1)}L nas próximas 4h.`}
        </Text>
      </View>
    </View>
  );
}

const gs = StyleSheet.create({
  container:  { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#ecc8c8" },
  titulo:     { fontFamily: fontFamilies.technicalBold, fontSize: 13, color: "#2c1a1a", marginBottom: 14 },

  circulos:   { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  circulo:    { alignItems: "center", gap: 6 },
  circuloBorda: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  circuloValor: { fontFamily: fontFamilies.headlineBold, fontSize: 16, lineHeight: 18 },
  circuloUnidade: { fontFamily: fontFamilies.technical, fontSize: 9, color: "#a08080", marginTop: 1 },
  circuloLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 8, letterSpacing: 1, color: "#a08080" },

  barSection: { backgroundColor: "#fdf5f5", borderRadius: 10, padding: 12, marginBottom: 12 },
  barSectionLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 1.5, color: "#a08080", marginBottom: 10 },
  barRow:     { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  barLabel:   { fontFamily: fontFamilies.technicalBold, fontSize: 9, color: "#a08080", width: 52 },
  barTrack:   { flex: 1, height: 12, backgroundColor: "#f0dede", borderRadius: 6, overflow: "hidden" },
  barFill:    { height: 12, borderRadius: 6 },
  barVal:     { fontFamily: fontFamilies.technicalBold, fontSize: 10, width: 46, textAlign: "right" },

  zonaContainer: { marginBottom: 12, position: "relative", paddingBottom: 28 },
  zonaTrack:  { flexDirection: "row", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 4 },
  zonaSegmento: { flex: 1, marginHorizontal: 1 },
  zonaLabels: { flexDirection: "row", justifyContent: "space-between" },
  zonaLabel:  { fontFamily: fontFamilies.technical, fontSize: 9, color: "#a08080", textAlign: "center", flex: 1 },
  zonaIndicador: { position: "absolute", bottom: 0, marginLeft: -14, width: 28, height: 20, borderRadius: 4, alignItems: "center", justifyContent: "center" },
  zonaIndicadorText: { fontFamily: fontFamilies.technicalBold, fontSize: 9, color: "#fff" },

  saldoCard:  { borderRadius: 10, padding: 14, borderWidth: 2, alignItems: "center" },
  saldoLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 1.5, color: "#a08080", marginBottom: 4 },
  saldoValor: { fontFamily: fontFamilies.headlineBold, fontSize: 28, marginBottom: 4 },
  saldoSub:   { fontFamily: fontFamilies.technical, fontSize: 12, color: "#7a5c00", textAlign: "center", lineHeight: 17 },
});
