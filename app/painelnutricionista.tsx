import { styles } from "@/styles/PainelNutricionistaStyle";
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

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type NavItem = "equipes" | "atletas" | "relatorios" | "configuracoes";

const NAV_ITEMS: { id: NavItem; label: string; icon: string }[] = [
  { id: "equipes", label: "Equipes", icon: "👥" },
  { id: "atletas", label: "Atletas", icon: "🏃" },
  { id: "relatorios", label: "Relatórios", icon: "📊" },
  { id: "configuracoes", label: "Configurações", icon: "⚙️" },
];

const Sidebar = ({
  activeNav,
  onNavChange,
}: {
  activeNav: NavItem;
  onNavChange: (id: NavItem) => void;
}) => (
  <View style={styles.sidebar}>
    {/* Logo */}
    <View style={styles.sidebarLogo}>
      <Text style={styles.sidebarLogoTop}>CLINICAL</Text>
      <Text style={styles.sidebarLogoBottom}>ATHLETE</Text>
    </View>

    {/* Itens de navegação */}
    <View style={styles.sidebarNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === activeNav;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => onNavChange(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusHidrico = "desidratado" | "hidratado" | "alerta_leve";

interface Atleta {
  id: string;
  nome: string;
  posicao: string;
  categoria: string;
  massaAtual: number;
  deltaMassa: number; // percentual
  usg: number;
  statusHidrico: StatusHidrico;
}

interface Sugestao {
  id: string;
  tipo: "emergencial" | "ajuste";
  titulo: string;
  descricao: string;
}

// ─── Dados mockados ───────────────────────────────────────────────────────────

const ATLETAS: Atleta[] = [
  {
    id: "1",
    nome: "Gabriel Mendonça",
    posicao: "Volante",
    categoria: "Sub-20",
    massaAtual: 78.4,
    deltaMassa: -2.8,
    usg: 1.026,
    statusHidrico: "desidratado",
  },
  {
    id: "2",
    nome: "Julia Santos",
    posicao: "Ala",
    categoria: "Principal",
    massaAtual: 64.2,
    deltaMassa: 0.3,
    usg: 1.012,
    statusHidrico: "hidratado",
  },
  {
    id: "3",
    nome: "Ricardo Lima",
    posicao: "Lateral",
    categoria: "Sub-20",
    massaAtual: 82.1,
    deltaMassa: -1.1,
    usg: 1.021,
    statusHidrico: "alerta_leve",
  },
];

const SUGESTOES: Sugestao[] = [
  {
    id: "1",
    tipo: "emergencial",
    titulo: "Protocolo Emergencial: Gabriel M.",
    descricao: "Reposição de 1.200ml de solução isotônica (6% carb) em 90 min.",
  },
  {
    id: "2",
    tipo: "ajuste",
    titulo: "Ajuste de Sódio: Equipe A",
    descricao:
      "Aumentar oferta de eletrólitos pré-treino devido à alta umidade prevista.",
  },
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const BadgeStatus = ({ status }: { status: StatusHidrico }) => {
  const config: Record<
    StatusHidrico,
    { label: string; style: object; textStyle: object; dotStyle: object }
  > = {
    desidratado: {
      label: "DESIDRATADO",
      style: styles.badgeDesidratado,
      textStyle: styles.badgeTextDesidratado,
      dotStyle: styles.dotDesidratado,
    },
    hidratado: {
      label: "HIDRATADO",
      style: styles.badgeHidratado,
      textStyle: styles.badgeTextHidratado,
      dotStyle: styles.dotHidratado,
    },
    alerta_leve: {
      label: "ALERTA LEVE",
      style: styles.badgeAlerta,
      textStyle: styles.badgeTextAlerta,
      dotStyle: styles.dotAlerta,
    },
  };

  const c = config[status];
  return (
    <View style={[styles.badge, c.style]}>
      <View style={[styles.dot, c.dotStyle]} />
      <Text style={[styles.badgeText, c.textStyle]}>{c.label}</Text>
    </View>
  );
};

const AtletaRow = ({ atleta, isLast }: { atleta: Atleta; isLast: boolean }) => {
  const deltaPositivo = atleta.deltaMassa >= 0;

  return (
    <View style={[styles.atletaRow, !isLast && styles.atletaRowBorder]}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {atleta.nome
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </Text>
      </View>

      {/* Nome + posição */}
      <View style={styles.atletaInfo}>
        <Text style={styles.atletaNome}>{atleta.nome}</Text>
        <Text style={styles.atletaDetalhe}>
          {atleta.posicao.toUpperCase()} • {atleta.categoria.toUpperCase()}
        </Text>
      </View>

      {/* Status */}
      <View style={styles.colStatus}>
        <BadgeStatus status={atleta.statusHidrico} />
      </View>

      {/* Massa */}
      <View style={styles.colMassa}>
        <Text style={styles.colValue}>{atleta.massaAtual.toFixed(1)} kg</Text>
      </View>

      {/* Delta */}
      <View style={styles.colDelta}>
        <Text
          style={[
            styles.deltaText,
            deltaPositivo ? styles.deltaPos : styles.deltaNeg,
          ]}
        >
          {deltaPositivo ? "+" : ""}
          {atleta.deltaMassa.toFixed(1)}%
        </Text>
      </View>

      {/* USG */}
      <View style={styles.colUsg}>
        <Text style={styles.colValue}>{atleta.usg.toFixed(3)}</Text>
      </View>

      {/* Ações */}
      <TouchableOpacity style={styles.acaoBtn} activeOpacity={0.6}>
        <Text style={styles.acaoDots}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};

const SugestaoCard = ({ sugestao }: { sugestao: Sugestao }) => (
  <View style={styles.sugestaoCard}>
    <View
      style={[
        styles.sugestaoIcone,
        sugestao.tipo === "emergencial"
          ? styles.sugestaoIconeEmergencial
          : styles.sugestaoIconeAjuste,
      ]}
    >
      <Text style={styles.sugestaoIconeText}>
        {sugestao.tipo === "emergencial" ? "⚠" : "🧪"}
      </Text>
    </View>
    <View style={styles.sugestaoTexto}>
      <Text style={styles.sugestaoTitulo}>{sugestao.titulo}</Text>
      <Text style={styles.sugestaoDesc}>{sugestao.descricao}</Text>
    </View>
  </View>
);

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function PainelNutricionista() {
  const [filtro, setFiltro] = useState("");
  const [activeNav, setActiveNav] = useState<NavItem>("atletas");

  const atletasFiltrados = ATLETAS.filter((a) =>
    a.nome.toLowerCase().includes(filtro.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
      <View style={styles.layout}>
        {/* ── Sidebar ── */}
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

        {/* ── Conteúdo principal ── */}
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* ── Header ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBreadcrumb}>
                Visão Geral da Equipe
                <Text style={styles.headerBreadcrumbSep}> / </Text>
                <Text style={styles.headerEquipe}>Alta Performance A</Text>
              </Text>
            </View>
          </View>

          {/* ── Card de monitoramento ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>Monitoramento de Atletas</Text>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Filtrar atletas..."
                  placeholderTextColor="#8F8880"
                  value={filtro}
                  onChangeText={setFiltro}
                />
              </View>
            </View>

            {/* Cabeçalho da tabela */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colAtleta]}>
                ATLETA
              </Text>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>
                STATUS HÍDRICO
              </Text>
              <Text style={[styles.tableHeaderText, styles.colMassa]}>
                MASSA ATUAL
              </Text>
              <Text style={[styles.tableHeaderText, styles.colDelta]}>
                Δ MASSA (%)
              </Text>
              <Text style={[styles.tableHeaderText, styles.colUsg]}>
                USG (G/ML)
              </Text>
              <Text style={[styles.tableHeaderText, styles.colAcoes]}>
                AÇÕES
              </Text>
            </View>

            {/* Linhas */}
            {atletasFiltrados.map((atleta, index) => (
              <AtletaRow
                key={atleta.id}
                atleta={atleta}
                isLast={index === atletasFiltrados.length - 1}
              />
            ))}
          </View>

          {/* ── Rodapé: Sugestões + Relatório ── */}
          <View style={styles.rodape}>
            {/* Sugestões de Recomposição */}
            <View style={[styles.card, styles.cardSugestoes]}>
              <Text style={styles.cardTitulo}>Sugestões de Recomposição</Text>
              <View style={styles.sugestaoLista}>
                {SUGESTOES.map((s) => (
                  <SugestaoCard key={s.id} sugestao={s} />
                ))}
              </View>
            </View>

            {/* Relatório Consolidado */}
            <View style={[styles.card, styles.cardRelatorio]}>
              <Text style={styles.relatorioIcone}>📋</Text>
              <Text style={styles.cardTitulo}>Relatório Consolidado</Text>
              <Text style={styles.relatorioDesc}>
                O sumário da semana 42 está pronto para análise. O desempenho
                hídrico subiu 5% em relação ao anterior.
              </Text>
              <TouchableOpacity style={styles.pdfBtn} activeOpacity={0.8}>
                <Text style={styles.pdfBtnText}>GERAR PDF COMPLETO</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Rodapé nutricionista ── */}
          <View style={styles.nutricionistaBadge}>
            <View style={styles.nutAvatar}>
              <Text style={styles.nutAvatarText}>MS</Text>
            </View>
            <View>
              <Text style={styles.nutLabel}>NUTRICIONISTA</Text>
              <Text style={styles.nutNome}>Dr. Marcos Silva</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
