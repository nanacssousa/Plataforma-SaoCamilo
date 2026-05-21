// src/components/TelaAtletaComponents.tsx
// Componentes isolados da TelaAtleta

import { styles } from "@/styles/atletaStyle";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// ─── Alerta de dados desatualizados ───────────────────────────────────────────
export function AlertaDesatualizado({ mensagem }: { mensagem: string }) {
  return (
    <View style={styles.alertCard}>
      <Text style={styles.alertTitle}>⚠️ DADOS DESATUALIZADOS</Text>
      <Text style={styles.alertText}>{mensagem}</Text>
    </View>
  );
}

// ─── Hero Card — iniciar sessão ───────────────────────────────────────────────
export function HeroIniciarSessao() {
  const router = useRouter();
  return (
    <View style={styles.heroCard}>
      <Text style={styles.heroSub}>PRONTO PARA TREINAR?</Text>
      <Text style={styles.heroTitle}>Iniciar Nova Sessão</Text>
      <Text style={styles.heroText}>
        Inicie o monitoramento em tempo real para calcular sua taxa de sudorese
        hoje.
      </Text>
      <TouchableOpacity
        style={styles.heroBtn}
        activeOpacity={0.85}
        onPress={() => router.push("/presessao")}
      >
        <Text style={styles.heroBtnText}>COMEÇAR MONITORAMENTO</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Grid de status (hidratação + sudorese) ───────────────────────────────────
export function StatusGrid({
  hidratacao,
  sudorese,
  ultimaSessao,
}: {
  hidratacao: number;   // 0–100
  sudorese: string;     // ex: "1,2"
  ultimaSessao: string; // ex: "12 Out"
}) {
  return (
    <View style={styles.grid}>
      <View style={styles.gridItem}>
        <Text style={styles.gridLabel}>STATUS ATUAL</Text>
        <Text style={styles.gridValueBigger}>
          {hidratacao}
          <Text style={styles.gridUnit}>%</Text>
        </Text>
        <Text style={styles.gridDesc}>NÍVEL DE HIDRATAÇÃO</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${hidratacao}%` }]} />
        </View>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.gridLabel}>ÚLTIMA TAXA</Text>
        <Text style={styles.gridValue}>
          {sudorese}
          <Text style={styles.gridUnit}> L/h</Text>
        </Text>
        <Text style={styles.gridDesc}>SUDORESE REGISTRADA</Text>
        <Text style={styles.gridSubDesc}>Sessão: {ultimaSessao}</Text>
      </View>
    </View>
  );
}

// ─── Card de destaque — última sessão ────────────────────────────────────────
export function HighlightSudorese({
  titulo,
  valor,
  unidade,
}: {
  titulo: string;
  valor: string;
  unidade: string;
}) {
  return (
    <View style={styles.highlightCard}>
      <Text style={styles.highlightSub}>ÚLTIMA TAXA DE SUDORESE</Text>
      <Text style={styles.highlightTitle}>{titulo}</Text>
      <Text style={styles.highlightValue}>
        {valor}
        <Text style={styles.highlightUnit}> {unidade}</Text>
      </Text>
    </View>
  );
}

// ─── Card de próxima hidratação ───────────────────────────────────────────────
export function ProximaHidratacao({
  tempo,
  volume,
}: {
  tempo: string;   // ex: "15 min"
  volume: string;  // ex: "350ml"
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>PRÓXIMA HIDRATAÇÃO</Text>
      <Text style={styles.metricValue}>🕒 {tempo}</Text>
      <Text style={[styles.metricLabel, { marginTop: 12 }]}>VOLUME ALVO</Text>
      <Text style={styles.metricTarget}>{volume}</Text>
    </View>
  );
}