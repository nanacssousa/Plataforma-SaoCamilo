import { styles } from "@/styles/TelaEquipesStyle";
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

// ─── Sidebar (compartilhada) ──────────────────────────────────────────────────

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
    <View style={styles.sidebarLogo}>
      <Text style={styles.sidebarLogoTop}>CLINICAL</Text>
      <Text style={styles.sidebarLogoBottom}>ATHLETE</Text>
    </View>
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
  deltaMassa: number;
  usg: number;
  statusHidrico: StatusHidrico;
}

interface DiaGrafico {
  dia: string;
  massaBar: number; // altura relativa barra massa (0–1)
  usgBar: number; // altura relativa barra USG (0–1)
}

interface Sugestao {
  id: string;
  tipo: "emergencial" | "ajuste";
  titulo: string;
  descricao: string;
}

// ─── Dados mockados ───────────────────────────────────────────────────────────

const DIAS_GRAFICO: DiaGrafico[] = [
  { dia: "SEGUNDA", massaBar: 0.55, usgBar: 0.3 },
  { dia: "TERÇA", massaBar: 0.82, usgBar: 0.45 },
  { dia: "QUARTA", massaBar: 0.5, usgBar: 0.28 },
  { dia: "QUINTA", massaBar: 0.95, usgBar: 0.6 },
  { dia: "SEXTA", massaBar: 0.42, usgBar: 0.22 },
  { dia: "SÁBADO", massaBar: 0.75, usgBar: 0.4 },
  { dia: "DOMINGO", massaBar: 0.6, usgBar: 0.35 },
];

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

/** Gráfico de barras lado a lado (massa × USG) */
const GraficoBarras = () => {
  const ALTURA_MAX = 130;

  return (
    <View style={styles.graficoContainer}>
      {DIAS_GRAFICO.map((item) => (
        <View key={item.dia} style={styles.graficoGrupo}>
          <View style={styles.graficoBarras}>
            {/* Barra USG — azul claro (atrás / esquerda) */}
            <View
              style={[
                styles.barra,
                styles.barraUsg,
                { height: ALTURA_MAX * item.usgBar },
              ]}
            />
            {/* Barra Massa — vermelho claro (frente / direita) */}
            <View
              style={[
                styles.barra,
                styles.barraMassa,
                { height: ALTURA_MAX * item.massaBar },
              ]}
            />
          </View>
          <Text style={styles.graficoDia}>{item.dia}</Text>
        </View>
      ))}
    </View>
  );
};

/** Badge de status hídrico */
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
      label: "EU·HIDRATADO",
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

/** Linha de atleta na tabela */
const AtletaRow = ({ atleta, isLast }: { atleta: Atleta; isLast: boolean }) => {
  const deltaPos = atleta.deltaMassa >= 0;
  return (
    <View style={[styles.atletaRow, !isLast && styles.atletaRowBorder]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {atleta.nome
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </Text>
      </View>
      <View style={styles.atletaInfo}>
        <Text style={styles.atletaNome}>{atleta.nome}</Text>
        <Text style={styles.atletaDetalhe}>
          {atleta.posicao.toUpperCase()} • {atleta.categoria.toUpperCase()}
        </Text>
      </View>
      <View style={styles.colStatus}>
        <BadgeStatus status={atleta.statusHidrico} />
      </View>
      <View style={styles.colMassa}>
        <Text style={styles.colValue}>{atleta.massaAtual.toFixed(1)} kg</Text>
      </View>
      <View style={styles.colDelta}>
        <Text
          style={[
            styles.deltaText,
            deltaPos ? styles.deltaPos : styles.deltaNeg,
          ]}
        >
          {deltaPos ? "+" : ""}
          {atleta.deltaMassa.toFixed(1)}%
        </Text>
      </View>
      <View style={styles.colUsg}>
        <Text style={styles.colValue}>{atleta.usg.toFixed(3)}</Text>
      </View>
      <TouchableOpacity style={styles.acaoBtn} activeOpacity={0.6}>
        <Text style={styles.acaoDots}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};

/** Card de sugestão */
const SugestaoCard = ({ sugestao }: { sugestao: Sugestao }) => (
  <View style={styles.sugestaoCard}>
    <View
      style={[
        styles.sugestaoLinha,
        sugestao.tipo === "emergencial"
          ? styles.sugestaoLinhaEmergencial
          : styles.sugestaoLinhaAjuste,
      ]}
    />
    <View style={styles.sugestaoTexto}>
      <Text style={styles.sugestaoTitulo}>{sugestao.titulo}</Text>
      <Text style={styles.sugestaoDesc}>{sugestao.descricao}</Text>
    </View>
  </View>
);

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function TelaEquipes() {
  const [filtro, setFiltro] = useState("");
  const [activeNav, setActiveNav] = useState<NavItem>("equipes");
  const [filtroPeriodo] = useState("ÚLTIMOS\n7 DIAS");
  const [filtroLiga] = useState("FILTRO:\nPRO-LEAGUE");

  const atletasFiltrados = ATLETAS.filter((a) =>
    a.nome.toLowerCase().includes(filtro.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
      <View style={styles.layout}>
        {/* ── Sidebar ── */}
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

        {/* ── Conteúdo ── */}
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerBreadcrumb}>
              Visão Geral da Equipe
              <Text style={styles.headerSep}> / </Text>
              <Text style={styles.headerEquipe}>Alta Performance A</Text>
            </Text>
            <TouchableOpacity style={styles.syncBtn} activeOpacity={0.7}>
              <Text style={styles.syncText}>↻ Sincronizar</Text>
            </TouchableOpacity>
          </View>

          {/* ── Linha superior: Gráfico + KPIs ── */}
          <View style={styles.topoRow}>
            {/* Card do gráfico */}
            <View style={[styles.card, styles.cardGrafico]}>
              <View style={styles.graficoHeader}>
                <View>
                  <Text style={styles.graficoTitulo}>
                    Status Hídrico Longitudinal
                  </Text>
                  <Text style={styles.graficoSubtitulo}>
                    VARIAÇÃO DE MASSA CORPORAL (%) VS. GRAVIDADE{"\n"}ESPECÍFICA
                    URINÁRIA (USG)
                  </Text>
                </View>
                <View style={styles.filtroBtns}>
                  <View style={styles.filtroBtn}>
                    <Text style={styles.filtroBtnText}>{filtroPeriodo}</Text>
                  </View>
                  <View style={styles.filtroBtn}>
                    <Text style={styles.filtroBtnText}>{filtroLiga}</Text>
                  </View>
                </View>
              </View>
              <GraficoBarras />
              {/* Legenda */}
              <View style={styles.legenda}>
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaDot, styles.legendaDotMassa]} />
                  <Text style={styles.legendaText}>Δ Massa (%)</Text>
                </View>
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaDot, styles.legendaDotUsg]} />
                  <Text style={styles.legendaText}>USG</Text>
                </View>
              </View>
            </View>

            {/* KPIs verticais */}
            <View style={styles.kpiColuna}>
              {/* Atletas em risco */}
              <View style={[styles.card, styles.cardKpiRisco]}>
                <Text style={styles.kpiAlerta}>▲</Text>
                <Text style={styles.kpiLabel}>ATLETAS EM RISCO</Text>
                <Text style={styles.kpiNumero}>04</Text>
                <Text style={styles.kpiSubLabel}>
                  PERDA DE MASSA {">"} 2% DETECTADA
                </Text>
              </View>

              {/* Média de hidratação */}
              <View style={[styles.card, styles.cardKpiHid]}>
                <Text style={styles.kpiGota}>💧</Text>
                <Text style={styles.kpiLabelHid}>MÉDIA DE HIDRATAÇÃO</Text>
                <Text style={styles.kpiPorcentagem}>
                  82<Text style={styles.kpiPorcentagemSufixo}>%</Text>
                </Text>
                <Text style={styles.kpiSubLabelHid}>
                  EQUIPE DENTRO DA META IDEAL
                </Text>
              </View>
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

            {/* Cabeçalho tabela */}
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
            <View style={[styles.card, styles.cardSugestoes]}>
              <Text style={styles.cardTitulo}>Sugestões de Recomposição</Text>
              <View style={styles.sugestaoLista}>
                {SUGESTOES.map((s) => (
                  <SugestaoCard key={s.id} sugestao={s} />
                ))}
              </View>
            </View>

            <View style={[styles.card, styles.cardRelatorio]}>
              <Text style={styles.relatorioIcone}>✅</Text>
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

          {/* Badge nutricionista */}
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
