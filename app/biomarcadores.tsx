import { styles } from "@/styles/biomarcadoresStyle";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type NavItem =
  | "central"
  | "hidratacao"
  | "atletas"
  | "protocolos"
  | "laboratorio"
  | "adm";

const NAV_ITEMS: { id: NavItem; label: string; icon: string }[] = [
  { id: "central", label: "Central de\nPerformance", icon: "📋" },
  { id: "hidratacao", label: "Logs de\nHidratação", icon: "💧" },
  { id: "atletas", label: "Elenco de\nAtletas", icon: "👤" },
  { id: "protocolos", label: "Protocolos\nMédicos", icon: "🩺" },
  { id: "laboratorio", label: "Análise de\nLab", icon: "🔬" },
  { id: "adm", label: "Admin do\nSistema", icon: "⚙️" },
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
      <Text style={styles.sidebarLogoTop}>ATHLETE LAB</Text>
      <Text style={styles.sidebarLogoSub}>UNIDADE DE ALTA PERFORMANCE</Text>
    </View>

    {/* Nav */}
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

    {/* Rodapé sidebar */}
    <View style={styles.sidebarFooter}>
      <TouchableOpacity style={styles.btnRegistrar} activeOpacity={0.8}>
        <Text style={styles.btnRegistrarText}>REGISTRAR AVALIAÇÃO</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
        <Text style={styles.footerIcon}>❓</Text>
        <Text style={styles.footerLabel}>SUPORTE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
        <Text style={styles.footerIcon}>🔔</Text>
        <Text style={styles.footerLabel}>NOTIFICAÇÕES</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── TopBar ───────────────────────────────────────────────────────────────────

const TOPBAR_TABS = ["Painel Clínico", "RELATÓRIOS", "TEMPO REAL", "ARQUIVO"];

const TopBar = ({
  abaAtiva,
  onAbaChange,
}: {
  abaAtiva: string;
  onAbaChange: (aba: string) => void;
}) => (
  <View style={styles.topBar}>
    <View style={styles.topBarLeft}>
      {TOPBAR_TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onAbaChange(tab)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.topBarItem,
              tab === abaAtiva && styles.topBarItemAtivo,
              tab === "Painel Clínico" && styles.topBarPainelLabel,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={styles.topBarExportar}>EXPORTAR DADOS</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.topBarRight}>
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={styles.topBarIcone}>👤</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={styles.topBarIcone}>⚙️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.topBarBtnProtocolo} activeOpacity={0.8}>
        <Text style={styles.topBarBtnText}>IMPLEMENTAR PROTOCOLO</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface MarcadorLab {
  id: string;
  nome: string;
  leitura: string;
  intervaloRef: string;
  status: "normal" | "elevado" | "limitrofe";
  tendencia: "estavel" | "subindo" | "descendo";
}

interface PassoProtocolo {
  numero: number;
  descricao: string;
}

// ─── Dados mockados ───────────────────────────────────────────────────────────

const PONTOS_GRAFICO = [
  { hora: "06:00", valor: 0.4 },
  { hora: "09:00", valor: 0.3 },
  { hora: "12:00", valor: 0.75 },
  { hora: "15:00", valor: 0.55 },
  { hora: "18:00", valor: 0.45 },
  { hora: "21:00", valor: 0.5 },
];

const MARCADORES: MarcadorLab[] = [
  {
    id: "1",
    nome: "Cortisol (Soro)",
    leitura: "18.4 mcg/dL",
    intervaloRef: "5.0 – 23.0 mcg/dL",
    status: "normal",
    tendencia: "estavel",
  },
  {
    id: "2",
    nome: "Creatina Quinase (CK)",
    leitura: "842 U/L",
    intervaloRef: "39 – 308 U/L",
    status: "elevado",
    tendencia: "subindo",
  },
  {
    id: "3",
    nome: "Nitrogênio Ureico no Sangue",
    leitura: "24 mg/dL",
    intervaloRef: "7 – 20 mg/dL",
    status: "limitrofe",
    tendencia: "descendo",
  },
];

const PASSOS_PROTOCOLO: PassoProtocolo[] = [
  {
    numero: 1,
    descricao:
      "Administrar 500ml de solução isotônica em até 15min após a sessão.",
  },
  {
    numero: 2,
    descricao: "Repetir medição de USG no intervalo de T+60m.",
  },
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

/** Gráfico de linha USG (sparkline com Views) */
const GraficoUSG = () => {
  const ALTURA = 160;
  const LARGURA_BARRA = 6;

  return (
    <View style={styles.graficoArea}>
      {/* Linha de referência horizontal */}
      <View style={styles.graficoRefLinha} />

      {/* Barras do gráfico */}
      <View style={styles.graficoBarrasRow}>
        {PONTOS_GRAFICO.map((ponto, i) => (
          <View key={ponto.hora} style={styles.graficoColuna}>
            <View style={styles.graficoBarraWrapper}>
              <View
                style={[
                  styles.graficoBarraSpark,
                  { height: ALTURA * ponto.valor },
                  i === 2 && styles.graficoBarraDestaque, // pico 12:00
                ]}
              />
            </View>
            <Text
              style={[
                styles.graficoHora,
                i === 2 && styles.graficoHoraDestaque,
              ]}
            >
              {ponto.hora}
            </Text>
          </View>
        ))}
      </View>

      {/* Métricas inferiores */}
      <View style={styles.graficoMetricas}>
        <View style={styles.metricaItem}>
          <Text style={styles.metricaLabel}>BASE</Text>
          <Text style={styles.metricaValor}>1.018</Text>
        </View>
        <View style={styles.metricaItem}>
          <Text style={styles.metricaLabel}>DESVIO DE PICO</Text>
          <Text style={[styles.metricaValor, styles.metricaValorAlerta]}>
            +0.013
          </Text>
        </View>
        <View style={styles.metricaItem}>
          <Text style={styles.metricaLabel}>STATUS ALVO</Text>
          <Text style={[styles.metricaValor, styles.metricaValorInfo]}>
            RECUPERANDO
          </Text>
        </View>
      </View>
    </View>
  );
};

/** Badge de status laboratorial */
const BadgeStatus = ({ status }: { status: MarcadorLab["status"] }) => {
  const cfg: Record<
    MarcadorLab["status"],
    { label: string; estilo: object; texto: object }
  > = {
    normal: {
      label: "NORMAL",
      estilo: styles.badgeNormal,
      texto: styles.badgeNormalText,
    },
    elevado: {
      label: "ELEVADO",
      estilo: styles.badgeElevado,
      texto: styles.badgeElevadoText,
    },
    limitrofe: {
      label: "LIMÍTROFE",
      estilo: styles.badgeLimitrofe,
      texto: styles.badgeLimitrofeText,
    },
  };
  const c = cfg[status];
  return (
    <View style={[styles.badge, c.estilo]}>
      <Text style={[styles.badgeText, c.texto]}>{c.label}</Text>
    </View>
  );
};

/** Ícone de tendência */
const IconeTendencia = ({
  tendencia,
}: {
  tendencia: MarcadorLab["tendencia"];
}) => {
  const mapa: Record<MarcadorLab["tendencia"], string> = {
    estavel: "→",
    subindo: "↗",
    descendo: "↘",
  };
  const cor: Record<MarcadorLab["tendencia"], object> = {
    estavel: styles.tendEstavel,
    subindo: styles.tendSubindo,
    descendo: styles.tendDescendo,
  };
  return (
    <Text style={[styles.tendencia, cor[tendencia]]}>{mapa[tendencia]}</Text>
  );
};

/** Linha da tabela laboratorial */
const MarcadorRow = ({
  marcador,
  isLast,
}: {
  marcador: MarcadorLab;
  isLast: boolean;
}) => (
  <View style={[styles.marcadorRow, !isLast && styles.marcadorRowBorder]}>
    <Text style={styles.marcadorNome}>{marcador.nome}</Text>
    <Text
      style={[
        styles.marcadorLeitura,
        marcador.status === "elevado" && styles.marcadorLeituraAlerta,
      ]}
    >
      {marcador.leitura}
    </Text>
    <Text style={styles.marcadorRef}>{marcador.intervaloRef}</Text>
    <View style={styles.marcadorStatusCol}>
      <BadgeStatus status={marcador.status} />
    </View>
    <View style={styles.marcadorTendenciaCol}>
      <IconeTendencia tendencia={marcador.tendencia} />
    </View>
  </View>
);

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function Biomarcadores() {
  const [activeNav, setActiveNav] = useState<NavItem>("central");
  const [abaAtiva, setAbaAtiva] = useState("RELATÓRIOS");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
      <View style={styles.layout}>
        {/* ── Sidebar ── */}
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

        {/* ── Conteúdo principal ── */}
        <View style={styles.conteudo}>
          <TopBar abaAtiva={abaAtiva} onAbaChange={setAbaAtiva} />

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Cabeçalho da tela ── */}
            <View style={styles.secaoHeader}>
              <View style={styles.secaoHeaderLeft}>
                <Text style={styles.tituloPrincipal}>
                  Biomarcadores do{"\n"}Atleta
                </Text>
                <Text style={styles.sessionId}>
                  ID DA SESSÃO: #ELITE-9942-PHYSIO
                </Text>
              </View>

              {/* KPI — Risco Crítico */}
              <View style={styles.kpiRisco}>
                <Text style={styles.kpiRiscoAlerta}>▲</Text>
                <Text style={styles.kpiRiscoLabel}>RISCO CRÍTICO</Text>
                <Text style={styles.kpiRiscoValor}>1.031</Text>
                <Text style={styles.kpiRiscoSub}>DENSIDADE MÁXIMA</Text>
              </View>
            </View>

            {/* ── Linha 1: Gráfico USG + Balanço Eletrolítico ── */}
            <View style={styles.linhaGrafico}>
              {/* Card gráfico */}
              <View style={[styles.card, styles.cardGrafico]}>
                <View style={styles.graficoCardHeader}>
                  <Text style={styles.graficoTitulo}>
                    Densidade da Urina (USG)
                  </Text>
                  <Text style={styles.graficoSubtitulo}>
                    DADOS LONGITUDINAIS 24H
                  </Text>
                </View>
                <GraficoUSG />
              </View>

              {/* Card balanço eletrolítico */}
              <View style={[styles.card, styles.cardBalanco]}>
                <Text style={styles.balancoTitulo}>
                  Balanço Eletrolítico de Sódio
                </Text>

                {/* Sódio perdido */}
                <View style={styles.balancoBloco}>
                  <Text style={styles.balancoLabel}>PERDA TOTAL DE SÓDIO</Text>
                  <View style={styles.balancoValorRow}>
                    <Text style={styles.balancoValorGrande}>1,420</Text>
                    <Text style={styles.balancoUnidade}> mg/L</Text>
                    <View style={styles.badgeDeplecao}>
                      <Text style={styles.badgeDeplecaoText}>
                        DEPLEÇÃO MODERADA
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.balancoDivider} />

                {/* Taxa de sudorese */}
                <View style={styles.balancoBloco}>
                  <Text style={styles.balancoLabel}>
                    ESTIMATIVA DA TAXA DE SUDORESE
                  </Text>
                  <View style={styles.balancoValorRow}>
                    <Text style={styles.balancoValorGrande}>1.8</Text>
                    <Text style={styles.balancoUnidade}> L/hr</Text>
                    <Text style={styles.balancoTendIcone}>↗</Text>
                  </View>
                </View>

                {/* Imagem ilustrativa (placeholder visual) */}
                <View style={styles.balancoImagem}>
                  <Text style={styles.balancoImagemTexto}>🧂</Text>
                </View>
              </View>
            </View>

            {/* ── Tabela de Resultados Laboratoriais ── */}
            <View style={styles.card}>
              <View style={styles.tabelaHeader}>
                <View>
                  <Text style={styles.cardTitulo}>
                    Resultados de Análises Laboratoriais
                  </Text>
                  <Text style={styles.tabelaData}>
                    ÚLTIMAS ATUALIZAÇÕES: 12 OUT 2023 | 14:30 GMT
                  </Text>
                </View>
                <View style={styles.tabelaAcoes}>
                  <TouchableOpacity
                    style={styles.tabelaAcaoBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.tabelaAcaoIcon}>⚡</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tabelaAcaoBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.tabelaAcaoIcon}>⬇</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Cabeçalho */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderText, styles.colNome]}>
                  NOME DO MARCADOR
                </Text>
                <Text style={[styles.tableHeaderText, styles.colLeitura]}>
                  LEITURA
                </Text>
                <Text style={[styles.tableHeaderText, styles.colRef]}>
                  INTERVALO DE REF.
                </Text>
                <Text style={[styles.tableHeaderText, styles.colStatus]}>
                  STATUS CLÍNICO
                </Text>
                <Text style={[styles.tableHeaderText, styles.colTendencia]}>
                  TENDÊNCIA
                </Text>
              </View>

              {/* Linhas */}
              {MARCADORES.map((m, i) => (
                <MarcadorRow
                  key={m.id}
                  marcador={m}
                  isLast={i === MARCADORES.length - 1}
                />
              ))}
            </View>

            {/* ── Linha inferior: Protocolo + Quote + Imagem ── */}
            <View style={styles.linhaInferior}>
              {/* Card protocolo ativo */}
              <View style={[styles.card, styles.cardProtocolo]}>
                <Text style={styles.cardTitulo}>Protocolo Ativo</Text>
                <View style={styles.protocoloCard}>
                  <Text style={styles.protocoloTag}>HIDRATAÇÃO_ALPHA_04</Text>
                  <Text style={styles.protocoloNome}>
                    Carga Salina Pós-{"\n"}Esforço
                  </Text>
                  <View style={styles.protocoloPassos}>
                    {PASSOS_PROTOCOLO.map((passo) => (
                      <View key={passo.numero} style={styles.protocoloPasso}>
                        <View style={styles.protocoloNumeroBox}>
                          <Text style={styles.protocoloNumero}>
                            {passo.numero}
                          </Text>
                        </View>
                        <Text style={styles.protocoloPassoDesc}>
                          {passo.descricao}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.btnHistorico}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnHistoricoText}>
                    VER HISTÓRICO DE CONFORMIDADE
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Card quote */}
              <View style={[styles.card, styles.cardQuote]}>
                <Text style={styles.quoteTexto}>
                  <Text style={styles.quoteItalico}>
                    Performance de{"\n"}Elite Exige{"\n"}Precisão{"\n"}
                    Fisiológica.
                  </Text>
                </Text>
                <Text style={styles.quoteDesc}>
                  Fluxos de dados são analisados em tempo real contra as bases
                  individuais do atleta para mitigar a síndrome de
                  sobretreinamento e o estresse renal.
                </Text>
                <View style={styles.quoteAutor}>
                  <View style={styles.quoteAvatarBox}>
                    <Text style={styles.quoteAvatarText}>HT</Text>
                  </View>
                  <View>
                    <Text style={styles.quoteAutorNome}>DRA. ELENA THORNE</Text>
                    <Text style={styles.quoteAutorCargo}>
                      Fisiologista Chefe
                    </Text>
                  </View>
                </View>
              </View>

              {/* Bloco de imagem placeholder */}
              <View style={styles.imagemPlaceholder}>
                <Text style={styles.imagemPlaceholderIcone}>🔬</Text>
              </View>
            </View>

            {/* ── Rodapé de status ── */}
            <View style={styles.rodapeStatus}>
              <View style={styles.rodapeStatusItem}>
                <Text style={styles.rodapeStatusLabel}>STATUS DO SERVIDOR</Text>
                <View style={styles.rodapeStatusValorRow}>
                  <View style={styles.rodapeStatusDot} />
                  <Text style={styles.rodapeStatusValor}>
                    OPERACIONAL / CRIPTOGRAFADO
                  </Text>
                </View>
              </View>
              <View style={styles.rodapeStatusItem}>
                <Text style={styles.rodapeStatusLabel}>
                  SINCRONIZAÇÃO DE DADOS
                </Text>
                <Text style={styles.rodapeStatusValor}>12:04:33 MS</Text>
              </View>
              <Text style={styles.rodapeCopyright}>
                © 2023 UNIDADE DE PESQUISA CLÍNICA // ATHLETE LAB V4.2.3
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
