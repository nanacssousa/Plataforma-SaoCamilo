  import { styles } from "@/styles/TelaEquipesStyle";
  import { router } from "expo-router";
  import { useEffect, useState } from "react";
  import {
    Alert,
    SafeAreaView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";


  const LOCAL_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";


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
    massaBar: number;
    usgBar: number;
  }

  interface Sugestao {
    id: string;
    tipo: "emergencial" | "ajuste";
    titulo: string;
    descricao: string;
  }

  const DIAS_GRAFICO: DiaGrafico[] = [
    { dia: "SEGUNDA", massaBar: 0.55, usgBar: 0.3 },
    { dia: "TERÇA", massaBar: 0.82, usgBar: 0.45 },
    { dia: "QUARTA", massaBar: 0.5, usgBar: 0.28 },
    { dia: "QUINTA", massaBar: 0.95, usgBar: 0.6 },
    { dia: "SEXTA", massaBar: 0.42, usgBar: 0.22 },
    { dia: "SÁBADO", massaBar: 0.75, usgBar: 0.4 },
    { dia: "DOMINGO", massaBar: 0.6, usgBar: 0.35 },
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

  const ID_SOLICITANTE_ATUAL = 1
  const EQUIPE_ID = 1
  const BASE_URL = `http://${LOCAL_HOST}:3000`

  const GraficoBarras = () => {
    const ALTURA_MAX = 130;
    return (
      <View style={styles.graficoContainer}>
        {DIAS_GRAFICO.map((item) => (
          <View key={item.dia} style={styles.graficoGrupo}>
            <View style={styles.graficoBarras}>
              <View
                style={[
                  styles.barra,
                  styles.barraUsg,
                  { height: ALTURA_MAX * item.usgBar },
                ]}
              />
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

  const BadgeStatus = ({ status }: { status: StatusHidrico }) => {
    if (status === "desidratado") {
      return (
        <View style={[styles.badge, styles.badgeDesidratado]}>
          <View style={[styles.dot, styles.dotDesidratado]} />
          <Text style={[styles.badgeText, styles.badgeTextDesidratado]}>
            DESIDRATADO
          </Text>
        </View>
      );
    }
    if (status === "hidratado") {
      return (
        <View style={[styles.badge, styles.badgeHidratado]}>
          <View style={[styles.dot, styles.dotHidratado]} />
          <Text style={[styles.badgeText, styles.badgeTextHidratado]}>
            EU·HIDRATADO
          </Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, styles.badgeAlerta]}>
        <View style={[styles.dot, styles.dotAlerta]} />
        <Text style={[styles.badgeText, styles.badgeTextAlerta]}>
          ALERTA LEVE
        </Text>
      </View>
    );
  };

  const AtletaRow = ({ atleta, isLast }: { atleta: Atleta; isLast: boolean }) => {
    const deltaPos = atleta.deltaMassa >= 0;
    return (
      <View style={[styles.atletaRow, !isLast && styles.atletaRowBorder]}>
        <TouchableOpacity
          style={styles.avatar}
          activeOpacity={0.7}
          onPress={() => router.push("/perfilProfissional")}
        >
          <Text style={styles.avatarText}>
            {atleta.nome
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </Text>
        </TouchableOpacity>
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

  export default function TelaEquipes() {
  const [filtro, setFiltro] = useState("");
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [carregandoAtletas, setCarregandoAtletas] = useState(true);
  const [erroAtletas, setErroAtletas] = useState<string | null>(null);
  const activeNav: NavItem = "equipes";
  const [filtroPeriodo] = useState("ÚLTIMOS\n7 DIAS");
  const [filtroLiga] = useState("FILTRO:\nPRO-LEAGUE");
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);

  useEffect(() => {
    const carregarAtletas = async () => {
      setCarregandoAtletas(true);
      setErroAtletas(null);

      try {
        const response = await fetch(`${BASE_URL}/equipes/${EQUIPE_ID}/atletas`);
        const contentType = response.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          const message =
            typeof data === 'object' && data !== null
              ? data.error || data.message || JSON.stringify(data)
              : String(data);

          throw new Error(
            `Erro ao carregar atletas: ${message || response.statusText}`,
          );
        }

        setAtletas(
          (data as any[]).map((item: any) => ({
            id: String(item.id),
            nome: item.nome,
            posicao: item.posicao ?? "Atleta",
            categoria: item.categoria ?? "PRINCIPAL",
            massaAtual: Number(item.massaAtual ?? item.massa_atual ?? 0),
            deltaMassa: Number(item.deltaMassa ?? item.delta_massa ?? 0),
            usg: Number(item.usg ?? 1.02),
            statusHidrico: item.statusHidrico ?? "hidratado",
          })),
        );
      } catch (error: any) {
        setErroAtletas(error.message ?? "Erro ao carregar atletas")
      } finally {
        setCarregandoAtletas(false);
      }
    };

    carregarAtletas();
  }, []);

  const atletasFiltrados = atletas.filter((a) =>
    a.nome.toLowerCase().includes(filtro.toLowerCase()),
  );

    const handleGerarRelatorio = async () => {
    if (gerandoRelatorio) return
    setGerandoRelatorio(true)

    try {
      const url = `${BASE_URL}/equipes/${EQUIPE_ID}/relatorio/pdf`
      console.log("Buscando PDF em:", url)

      const response = await fetch(url, {
        headers: { Accept: "application/pdf" },
      })

      console.log("Status da resposta:", response.status)

      if (!response.ok) {
        const texto = await response.text()
        console.error("Erro do servidor:", texto)
        throw new Error(`Erro ao gerar relatório: ${response.status} — ${texto}`)
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = `relatorio_equipe_${EQUIPE_ID}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(objectUrl)

    } catch (error: any) {
      console.error("Erro completo:", error)
      Alert.alert("Erro", error.message ?? "Não foi possível gerar o relatório.")
    } finally {
      setGerandoRelatorio(false)
    }
  }

    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
        <View style={styles.layout}>
          <Sidebar activeNav={activeNav} />
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.headerBreadcrumb}>
                Visão Geral da Equipe
                <Text style={styles.headerSep}> / </Text>
                <Text style={styles.headerEquipe}>Alta Performance A</Text>
              </Text>
            </View>

            <View style={styles.topoRow}>
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

              <View style={styles.kpiColuna}>
                <View style={[styles.card, styles.cardKpiRisco]}>
                  <Text style={styles.kpiAlerta}>▲</Text>
                  <Text style={styles.kpiLabel}>ATLETAS EM RISCO</Text>
                  <Text style={styles.kpiNumero}>04</Text>
                  <Text style={styles.kpiSubLabel}>
                    PERDA DE MASSA {">"} 2% DETECTADA
                  </Text>
                </View>
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
                <TouchableOpacity
                  style={[styles.pdfBtn, gerandoRelatorio && { opacity: 0.6 }]}
                  activeOpacity={0.8}
                  onPress={handleGerarRelatorio}
                  disabled={gerandoRelatorio}
                >
                  <Text style={styles.pdfBtnText}>
                    {gerandoRelatorio ? "GERANDO..." : "GERAR PDF COMPLETO"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.nutricionistaBadge}
              activeOpacity={0.7}
              onPress={() => router.push("/perfilProfissional")}
            >
              <View style={styles.nutAvatar}>
                <Text style={styles.nutAvatarText}>MS</Text>
              </View>
              <View>
                <Text style={styles.nutLabel}>NUTRICIONISTA</Text>
                <Text style={styles.nutNome}>Dr. Marcos Silva</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
