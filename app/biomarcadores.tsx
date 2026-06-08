// app/biomarcadores.tsx
// Biomarcadores — busca dados reais de USG, marcadores laboratoriais e taxa de sudorese do backend
import { apiFetch } from "../src/services/apiService";
import { useAppStore } from "../src/store/useAppStore";
import { styles } from "../src/styles/biomarcadoresStyle";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Sidebar ──────────────────────────────────────────────────────────────────
type NavItem = "equipes" | "atletas" | "relatorios" | "perfil";
const NAV_ROUTES: Record<NavItem, string> = {
  equipes: "/telaequipes",
  atletas: "/painelnutricionista",
  relatorios: "/biomarcadores",
  perfil: "/perfilProfissional",
};
const NAV_ITEMS: { id: NavItem; label: string; icon: string }[] = [
  { id: "equipes", label: "Equipes", icon: "👥" },
  { id: "atletas", label: "Atletas", icon: "🏃" },
  { id: "relatorios", label: "Relatórios", icon: "📊" },
  { id: "perfil", label: "Perfil", icon: "⚙️" },
];

const Sidebar = ({ activeNav }: { activeNav: NavItem }) => (
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
            onPress={() => {
              if (!isActive) router.push(NAV_ROUTES[item.id] as any);
            }}
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
interface PontoGrafico {
  hora: string;
  valor: number;
}

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

// ─── Defaults (usados enquanto carrega ou se API falhar) ───────────────────────
const PONTOS_DEFAULT: PontoGrafico[] = [
  { hora: "06:00", valor: 0.4 },
  { hora: "09:00", valor: 0.3 },
  { hora: "12:00", valor: 0.75 },
  { hora: "15:00", valor: 0.55 },
  { hora: "18:00", valor: 0.45 },
  { hora: "21:00", valor: 0.5 },
];

const MARCADORES_DEFAULT: MarcadorLab[] = [
  {
    id: "1",
    nome: "Cortisol (Soro)",
    leitura: "—",
    intervaloRef: "5.0 – 23.0 mcg/dL",
    status: "normal",
    tendencia: "estavel",
  },
  {
    id: "2",
    nome: "Creatina Quinase (CK)",
    leitura: "—",
    intervaloRef: "39 – 308 U/L",
    status: "normal",
    tendencia: "estavel",
  },
  {
    id: "3",
    nome: "Nitrogênio Ureico",
    leitura: "—",
    intervaloRef: "7 – 20 mg/dL",
    status: "normal",
    tendencia: "estavel",
  },
];

const PASSOS_PROTOCOLO: PassoProtocolo[] = [
  {
    numero: 1,
    descricao:
      "Administrar 500ml de solução isotônica em até 15min após a sessão.",
  },
  { numero: 2, descricao: "Repetir medição de USG no intervalo de T+60m." },
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const GraficoUSG = ({
  pontos,
  usgBase,
  desvio,
  status,
}: {
  pontos: PontoGrafico[];
  usgBase: string;
  desvio: string;
  status: string;
}) => {
  const ALTURA = 160;
  const maiorValor = Math.max(...pontos.map((p) => p.valor), 0.01);
  const indicePico = pontos.indexOf(
    pontos.find((p) => p.valor === maiorValor)!,
  );

  return (
    <View style={styles.graficoArea}>
      <View style={styles.graficoRefLinha} />
      <View style={styles.graficoBarrasRow}>
        {pontos.map((ponto, i) => (
          <View key={ponto.hora} style={styles.graficoColuna}>
            <View style={styles.graficoBarraWrapper}>
              <View
                style={[
                  styles.graficoBarraSpark,
                  { height: ALTURA * (ponto.valor / maiorValor) },
                  i === indicePico && styles.graficoBarraDestaque,
                ]}
              />
            </View>
            <Text
              style={[
                styles.graficoHora,
                i === indicePico && styles.graficoHoraDestaque,
              ]}
            >
              {ponto.hora}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.graficoMetricas}>
        <View style={styles.metricaItem}>
          <Text style={styles.metricaLabel}>BASE</Text>
          <Text style={styles.metricaValor}>{usgBase}</Text>
        </View>
        <View style={styles.metricaItem}>
          <Text style={styles.metricaLabel}>DESVIO DE PICO</Text>
          <Text style={[styles.metricaValor, styles.metricaValorAlerta]}>
            {desvio}
          </Text>
        </View>
        <View style={styles.metricaItem}>
          <Text style={styles.metricaLabel}>STATUS ALVO</Text>
          <Text style={[styles.metricaValor, styles.metricaValorInfo]}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
};

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

// ─── Helpers de mapeamento ────────────────────────────────────────────────────

function mapearStatus(status: string): MarcadorLab["status"] {
  if (!status) return "normal";
  const s = status.toLowerCase();
  if (s.includes("elev") || s.includes("alto") || s.includes("high"))
    return "elevado";
  if (s.includes("limit") || s.includes("border") || s.includes("aten"))
    return "limitrofe";
  return "normal";
}

function mapearTendencia(tendencia: string): MarcadorLab["tendencia"] {
  if (!tendencia) return "estavel";
  const t = tendencia.toLowerCase();
  if (t.includes("sub") || t.includes("up") || t.includes("aument"))
    return "subindo";
  if (t.includes("desc") || t.includes("down") || t.includes("reduz"))
    return "descendo";
  return "estavel";
}

function normalizarUSG(escala: number): number {
  // escala 0-5 → normaliza para 0-1 para o gráfico
  return Math.min(escala / 5, 1);
}

function calcularUsgReal(escala: number): number {
  // escala 0-5 → USG real (1.000 a 1.030)
  return 1.0 + (escala / 5) * 0.03;
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function Biomarcadores() {
  const { state } = useAppStore();

  const [pontosGrafico, setPontosGrafico] =
    useState<PontoGrafico[]>(PONTOS_DEFAULT);
  const [marcadores, setMarcadores] =
    useState<MarcadorLab[]>(MARCADORES_DEFAULT);
  const [taxaSudorese, setTaxaSudorese] = useState<string>("—");
  const [perdaSodio, setPerdaSodio] = useState<string>("—");
  const [usgBase, setUsgBase] = useState("1.018");
  const [desvio, setDesvio] = useState("+0.000");
  const [statusUSG, setStatusUSG] = useState("SEM DADOS");
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState("—");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ID do atleta — usa o próprio usuário se for atleta, ou o primeiro atleta do painel
  const idAtleta = state.idUsuario;

  const carregar = useCallback(
    async (silencioso = false) => {
      if (!idAtleta) {
        setLoading(false);
        return;
      }
      if (!silencioso) setLoading(true);

      try {
        // 1. Busca registros de cor de urina do atleta (últimas 24h)
        const registrosUrina = await apiFetch<any[]>(
          `/registro-cor-urina?id_usuario=${idAtleta}`,
        ).catch(() => []);

        if (Array.isArray(registrosUrina) && registrosUrina.length > 0) {
          // Ordena por horário
          const ordenados = [...registrosUrina].sort(
            (a, b) =>
              new Date(a.horario_registro).getTime() -
              new Date(b.horario_registro).getTime(),
          );

          // Monta pontos do gráfico
          const pontos: PontoGrafico[] = ordenados.map((r) => ({
            hora: new Date(r.horario_registro).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            valor: normalizarUSG(r.escala_cor ?? 0),
          }));
          if (pontos.length > 0) setPontosGrafico(pontos);

          // Calcula USG base e desvio de pico
          const usgMedio =
            ordenados.reduce(
              (acc, r) => acc + calcularUsgReal(r.escala_cor ?? 0),
              0,
            ) / ordenados.length;
          const usgPico = Math.max(
            ...ordenados.map((r) => calcularUsgReal(r.escala_cor ?? 0)),
          );
          const desvioCalc = usgPico - usgMedio;

          setUsgBase(usgMedio.toFixed(3));
          setDesvio(`+${desvioCalc.toFixed(3)}`);

          if (usgPico >= 1.025) setStatusUSG("DESIDRATADO");
          else if (usgPico >= 1.02) setStatusUSG("ATENÇÃO");
          else setStatusUSG("RECUPERANDO");

          const ultima = ordenados[ordenados.length - 1];
          if (ultima?.horario_registro) {
            setUltimaAtualizacao(
              new Date(ultima.horario_registro).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) +
                " | " +
                new Date(ultima.horario_registro).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            );
          }
        }

        // 2. Busca biomarcadores laboratoriais do atleta
        const medicoes = await apiFetch<any[]>(
          `/biomarcador-medicoes/usuario/${idAtleta}`,
        ).catch(() => []);

        if (Array.isArray(medicoes) && medicoes.length > 0) {
          // Agrupa por biomarcador, pega a mais recente de cada
          const porBiomarcador = new Map<number, any>();
          for (const m of medicoes) {
            const id = m.id_biomarcador;
            if (
              !porBiomarcador.has(id) ||
              new Date(m.medido_em) > new Date(porBiomarcador.get(id).medido_em)
            ) {
              porBiomarcador.set(id, m);
            }
          }

          const marcadoresMapped: MarcadorLab[] = Array.from(
            porBiomarcador.values(),
          ).map((m) => ({
            id: String(m.id_medicao),
            nome: m.nome_biomarcador ?? `Biomarcador ${m.id_biomarcador}`,
            leitura: m.leitura_texto ?? `${m.valor} ${m.unidade ?? ""}`.trim(),
            intervaloRef:
              m.faixa_min != null && m.faixa_max != null
                ? `${m.faixa_min} – ${m.faixa_max} ${m.unidade ?? ""}`
                : "—",
            status: mapearStatus(m.status ?? ""),
            tendencia: mapearTendencia(m.tendencia ?? ""),
          }));

          if (marcadoresMapped.length > 0) setMarcadores(marcadoresMapped);
        }

        // 3. Busca última sessão para taxa de sudorese e perda de sódio
        const sessoes = await apiFetch<any[]>(
          `/sessoes-treino?id_usuario=${idAtleta}&limit=1`,
        ).catch(() => []);

        if (Array.isArray(sessoes) && sessoes.length > 0) {
          const ultima = sessoes[0];
          if (ultima.taxa_sudorese_lh != null) {
            setTaxaSudorese(
              `${Number(ultima.taxa_sudorese_lh).toFixed(1)} L/hr`,
            );
          }
          // Estimativa de perda de sódio: taxa sudorese × concentração média de sódio no suor (~900mg/L)
          if (ultima.taxa_sudorese_lh != null && ultima.duracao_horas != null) {
            const perdaMg =
              ultima.taxa_sudorese_lh * ultima.duracao_horas * 900;
            setPerdaSodio(
              `${Math.round(perdaMg).toLocaleString("pt-BR")} mg/L`,
            );
          }
        }
      } catch {
        // mantém dados padrão
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [idAtleta],
  );

  useEffect(() => {
    carregar();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregar(true);
  }, [carregar]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
      <View style={styles.layout}>
        <Sidebar activeNav="relatorios" />

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8f000a"
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.headerBreadcrumb}>
              Biomarcadores
              <Text style={styles.headerSep}> / </Text>
              <Text style={styles.headerDestaque}>Atleta</Text>
            </Text>
          </View>

          <View style={styles.secaoTitulo}>
            <Text style={styles.tituloPrincipal}>
              Biomarcadores do{"\n"}Atleta
            </Text>
          </View>

          {loading ? (
            <View style={{ padding: 48, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#8f000a" />
              <Text style={{ marginTop: 12, color: "#5b403d" }}>
                Carregando biomarcadores...
              </Text>
            </View>
          ) : (
            <>
              {/* ── Gráfico USG + Balanço Eletrolítico ── */}
              <View style={styles.linhaGrafico}>
                <View style={[styles.card, styles.cardGrafico]}>
                  <View style={styles.graficoCardHeader}>
                    <Text style={styles.graficoTitulo}>
                      Densidade da Urina (USG)
                    </Text>
                    <Text style={styles.graficoSubtitulo}>
                      DADOS LONGITUDINAIS 24H
                    </Text>
                  </View>
                  <GraficoUSG
                    pontos={pontosGrafico}
                    usgBase={usgBase}
                    desvio={desvio}
                    status={statusUSG}
                  />
                </View>

                <View style={[styles.card, styles.cardBalanco]}>
                  <Text style={styles.balancoTitulo}>
                    Balanço Eletrolítico de Sódio
                  </Text>
                  <View style={styles.balancoBloco}>
                    <Text style={styles.balancoLabel}>
                      PERDA TOTAL DE SÓDIO
                    </Text>
                    <View style={styles.balancoValorRow}>
                      <Text style={styles.balancoValorGrande}>
                        {perdaSodio !== "—" ? perdaSodio.split(" ")[0] : "—"}
                      </Text>
                      {perdaSodio !== "—" && (
                        <Text style={styles.balancoUnidade}> mg/L</Text>
                      )}
                      <View style={styles.badgeDeplecao}>
                        <Text style={styles.badgeDeplecaoText}>
                          {perdaSodio === "—"
                            ? "SEM DADOS"
                            : "DEPLEÇÃO MODERADA"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.balancoDivider} />
                  <View style={styles.balancoBloco}>
                    <Text style={styles.balancoLabel}>
                      ESTIMATIVA DA TAXA DE SUDORESE
                    </Text>
                    <View style={styles.balancoValorRow}>
                      <Text style={styles.balancoValorGrande}>
                        {taxaSudorese !== "—"
                          ? taxaSudorese.split(" ")[0]
                          : "—"}
                      </Text>
                      {taxaSudorese !== "—" && (
                        <Text style={styles.balancoUnidade}> L/hr</Text>
                      )}
                      <Text style={styles.balancoTendIcone}>↗</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* ── Tabela de Marcadores ── */}
              <View style={styles.card}>
                <View style={styles.tabelaHeader}>
                  <View>
                    <Text style={styles.cardTitulo}>
                      Resultados de Análises Laboratoriais
                    </Text>
                    <Text style={styles.tabelaData}>
                      ÚLTIMA ATUALIZAÇÃO: {ultimaAtualizacao.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.tabelaAcoes}>
                    <TouchableOpacity
                      style={styles.tabelaAcaoBtn}
                      activeOpacity={0.7}
                      onPress={() => carregar()}
                    >
                      <Text style={styles.tabelaAcaoIcon}>⚡</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
                {marcadores.map((m, i) => (
                  <MarcadorRow
                    key={m.id}
                    marcador={m}
                    isLast={i === marcadores.length - 1}
                  />
                ))}
              </View>

              {/* ── Protocolo + Quote ── */}
              <View style={styles.linhaInferior}>
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
                </View>

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
                      <Text style={styles.quoteAutorNome}>
                        DRA. ELENA THORNE
                      </Text>
                      <Text style={styles.quoteAutorCargo}>
                        Fisiologista Chefe
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
