// src/app/historico.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "@/styles/HistoricoStyle";
import { colors } from "../constants/theme";

// ─── Types ────────────────────────────────────────────────────────────────────
type Intensidade = "ALTA INTENSIDADE" | "RESISTÊNCIA" | "MODERADO";

interface Sessao {
  id: string;
  intensidade: Intensidade;
  titulo: string;
  dia: string;
  mes: string;
  duracao: string;
  taxaSudose: string;
  desidratacao: string;
  desidratacaoAlta: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SESSOES: Sessao[] = [
  {
    id: "1",
    intensidade: "ALTA INTENSIDADE",
    titulo: "Corrida",
    dia: "18",
    mes: "Fev",
    duracao: "1h 15m",
    taxaSudose: "1.8 L/h",
    desidratacao: "2.1%",
    desidratacaoAlta: true,
  },
  {
    id: "2",
    intensidade: "RESISTÊNCIA",
    titulo: "Atletismo",
    dia: "16",
    mes: "Fev",
    duracao: "2h 05m",
    taxaSudose: "0.9 L/h",
    desidratacao: "0.8%",
    desidratacaoAlta: false,
  },
  {
    id: "3",
    intensidade: "MODERADO",
    titulo: "Ciclismo",
    dia: "14",
    mes: "Fev",
    duracao: "1h 40m",
    taxaSudose: "1.2 L/h",
    desidratacao: "1.4%",
    desidratacaoAlta: false,
  },
  {
    id: "4",
    intensidade: "ALTA INTENSIDADE",
    titulo: "Futebol",
    dia: "11",
    mes: "Fev",
    duracao: "1h 30m",
    taxaSudose: "2.1 L/h",
    desidratacao: "3.2%",
    desidratacaoAlta: true,
  },
];

// ─── Session Card ─────────────────────────────────────────────────────────────
const SessionCard = ({ sessao }: { sessao: Sessao }) => {
  const badgeStyle =
    sessao.intensidade === "ALTA INTENSIDADE"
      ? styles.cardBadgeHigh
      : sessao.intensidade === "RESISTÊNCIA"
        ? styles.cardBadgeResist
        : {};

  return (
    <View style={styles.sessionCard}>
      {/* Topo: badge + data */}
      <View style={styles.cardHeader}>
        <Text style={[styles.cardBadge, badgeStyle]}>{sessao.intensidade}</Text>
        <View style={styles.cardDateContainer}>
          <Text style={styles.cardDateDay}>
            {sessao.dia} {sessao.mes}
          </Text>
          <Text style={styles.cardDateMonth}>2026</Text>
        </View>
      </View>

      {/* Título */}
      <Text style={styles.cardTitle}>{sessao.titulo}</Text>

      <View style={styles.cardDivider} />

      {/* Stats */}
      <View style={styles.cardStats}>
        <View style={styles.cardStatsLeft}>
          {/* Duração */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DURAÇÃO</Text>
            <View style={styles.statValue}>
              <Text style={styles.statIcon}>⏱</Text>
              <Text style={styles.statText}>{sessao.duracao}</Text>
            </View>
          </View>

          {/* Taxa de Sudose */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TAXA DE SUDOSE</Text>
            <View style={styles.statValue}>
              <Text style={styles.statIcon}>💧</Text>
              <Text style={styles.statText}>{sessao.taxaSudose}</Text>
            </View>
          </View>

          {/* Desidratação */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DESIDRATAÇÃO</Text>
            <View style={styles.statValue}>
              <Text style={styles.dehydrationIcon}>
                {sessao.desidratacaoAlta ? "▲" : "✓"}
              </Text>
              <Text
                style={[
                  styles.statText,
                  sessao.desidratacaoAlta
                    ? styles.dehydrationHigh
                    : styles.dehydrationNormal,
                ]}
              >
                {sessao.desidratacao}
              </Text>
            </View>
          </View>
        </View>

        {/* Seta */}
        <TouchableOpacity style={styles.arrowButton}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
type TabKey = "sessao" | "historico" | "perfil";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "sessao", label: "SESSÃO", icon: "⏱" },
  { key: "historico", label: "HISTÓRICO", icon: "📊" },
  { key: "perfil", label: "PERFIL", icon: "👤" },
];

const BottomTabBar = ({ active }: { active: TabKey }) => (
  <View style={styles.tabBar}>
    {TABS.map((tab) => {
      const isActive = tab.key === active;
      return (
        <TouchableOpacity key={tab.key} style={styles.tabItem}>
          <View
            style={[styles.tabIconContainer, isActive && styles.tabIconActive]}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
          </View>
          <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HistoricoScreen() {
  const [search, setSearch] = useState("");

  const sessoesFiltradas = SESSOES.filter(
    (s) =>
      s.titulo.toLowerCase().includes(search.toLowerCase()) ||
      s.intensidade.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerMenu}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico Sessões</Text>
        <TouchableOpacity>
          <Text style={styles.headerFilter}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise por tipo ou data"
            placeholderTextColor={colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>Extrair relatório</Text>
      </TouchableOpacity>

      {/* List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sessoesFiltradas.map((sessao) => (
          <SessionCard key={sessao.id} sessao={sessao} />
        ))}
      </ScrollView>

      <BottomTabBar active="historico" />
    </SafeAreaView>
  );
}
