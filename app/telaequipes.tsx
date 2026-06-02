// app/telaequipes.tsx
// Tela de equipes — busca atletas e dados do gráfico do backend
import { styles } from "@/styles/TelaEquipesStyle";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { apiFetch } from "../src/services/apiService";
import { useAppStore } from "../src/store/useAppStore";

type NavItem = "equipes" | "atletas" | "relatorios" | "perfil";
const NAV_ROUTES: Record<NavItem, string> = {
  equipes: "/telaequipes",
  atletas: "/painelnutricionista",
  relatorios: "/biomarcadores",
  perfil: "/perfilProfissional",
};
const NAV_ITEMS = [
  { id: "equipes" as NavItem, label: "Equipes", icon: "👥" },
  { id: "atletas" as NavItem, label: "Atletas", icon: "🏃" },
  { id: "relatorios" as NavItem, label: "Relatórios", icon: "📊" },
  { id: "perfil" as NavItem, label: "Perfil", icon: "⚙️" },
];

const Sidebar = ({ activeNav }: { activeNav: NavItem }) => (
  <View style={styles.sidebar}>
    <View style={styles.sidebarLogo}>
      <Text style={styles.sidebarLogoTop}>CLINICAL</Text>
      <Text style={styles.sidebarLogoBottom}>ATHLETE</Text>
    </View>
    <View style={styles.sidebarNav}>
      {NAV_ITEMS.map(item => {
        const isActive = item.id === activeNav;
        return (
          <TouchableOpacity key={item.id} style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => { if (!isActive) router.push(NAV_ROUTES[item.id] as any); }} activeOpacity={0.7}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

type StatusHidrico = "desidratado" | "hidratado" | "alerta_leve";
interface Atleta { id: string; nome: string; posicao: string; categoria: string; massaAtual: number; deltaMassa: number; usg: number; statusHidrico: StatusHidrico; }
interface DiaGrafico { dia: string; massaBar: number; usgBar: number; }
interface Sugestao { id: string; tipo: "emergencial" | "ajuste"; titulo: string; descricao: string; }

const DIAS_SEMANA = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"];

const GraficoBarras = ({ dados }: { dados: DiaGrafico[] }) => {
  const ALTURA_MAX = 130;
  return (
    <View style={styles.graficoContainer}>
      {dados.map(item => (
        <View key={item.dia} style={styles.graficoGrupo}>
          <View style={styles.graficoBarras}>
            <View style={[styles.barra, styles.barraUsg, { height: ALTURA_MAX * Math.min(item.usgBar, 1) }]} />
            <View style={[styles.barra, styles.barraMassa, { height: ALTURA_MAX * Math.min(item.massaBar, 1) }]} />
          </View>
          <Text style={styles.graficoDia}>{item.dia.slice(0, 3)}</Text>
        </View>
      ))}
    </View>
  );
};

const BadgeStatus = ({ status }: { status: StatusHidrico }) => {
  if (status === "desidratado") return (
    <View style={[styles.badge, styles.badgeDesidratado]}>
      <View style={[styles.dot, styles.dotDesidratado]} />
      <Text style={[styles.badgeText, styles.badgeTextDesidratado]}>DESIDRATADO</Text>
    </View>
  );
  if (status === "hidratado") return (
    <View style={[styles.badge, styles.badgeHidratado]}>
      <View style={[styles.dot, styles.dotHidratado]} />
      <Text style={[styles.badgeText, styles.badgeTextHidratado]}>EU·HIDRATADO</Text>
    </View>
  );
  return (
    <View style={[styles.badge, styles.badgeAlerta]}>
      <View style={[styles.dot, styles.dotAlerta]} />
      <Text style={[styles.badgeText, styles.badgeTextAlerta]}>ALERTA LEVE</Text>
    </View>
  );
};

const AtletaRow = ({ atleta, isLast }: { atleta: Atleta; isLast: boolean }) => {
  const deltaPos = atleta.deltaMassa >= 0;
  return (
    <View style={[styles.atletaRow, !isLast && styles.atletaRowBorder]}>
      <TouchableOpacity style={styles.avatar} activeOpacity={0.7} onPress={() => router.push("/perfilProfissional")}>
        <Text style={styles.avatarText}>{atleta.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}</Text>
      </TouchableOpacity>
      <View style={styles.atletaInfo}>
        <Text style={styles.atletaNome}>{atleta.nome}</Text>
        <Text style={styles.atletaDetalhe}>{atleta.posicao.toUpperCase()} • {atleta.categoria.toUpperCase()}</Text>
      </View>
      <View style={styles.colStatus}><BadgeStatus status={atleta.statusHidrico} /></View>
      <View style={styles.colMassa}><Text style={styles.colValue}>{atleta.massaAtual.toFixed(1)} kg</Text></View>
      <View style={styles.colDelta}>
        <Text style={[styles.deltaText, deltaPos ? styles.deltaPos : styles.deltaNeg]}>
          {deltaPos ? "+" : ""}{atleta.deltaMassa.toFixed(1)}%
        </Text>
      </View>
      <View style={styles.colUsg}><Text style={styles.colValue}>{atleta.usg.toFixed(3)}</Text></View>
      <TouchableOpacity style={styles.acaoBtn} activeOpacity={0.6}>
        <Text style={styles.acaoDots}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};

const SugestaoCard = ({ sugestao }: { sugestao: Sugestao }) => (
  <View style={styles.sugestaoCard}>
    <View style={[styles.sugestaoLinha, sugestao.tipo === "emergencial" ? styles.sugestaoLinhaEmergencial : styles.sugestaoLinhaAjuste]} />
    <View style={styles.sugestaoTexto}>
      <Text style={styles.sugestaoTitulo}>{sugestao.titulo}</Text>
      <Text style={styles.sugestaoDesc}>{sugestao.descricao}</Text>
    </View>
  </View>
);

function calcularStatusHidrico(deltaMassa: number, usg: number): StatusHidrico {
  if (deltaMassa <= -2 || usg >= 1.025) return "desidratado";
  if (deltaMassa <= -1 || usg >= 1.020) return "alerta_leve";
  return "hidratado";
}

// Normaliza valores do backend para barras do gráfico (0..1)
function normalizarParaGrafico(sessoes: any[]): DiaGrafico[] {
  const hoje = new Date();
  return DIAS_SEMANA.map((dia, i) => {
    const dataAlvo = new Date(hoje);
    dataAlvo.setDate(hoje.getDate() - (hoje.getDay() - 1) + i); // segunda a domingo
    const dataStr = dataAlvo.toISOString().split('T')[0];
    const sessoesDoDia = sessoes.filter(s => (s.data_treino ?? '').slice(0, 10) === dataStr);
    if (sessoesDoDia.length === 0) return { dia, massaBar: 0, usgBar: 0 };
    const mediaPerdaMassa = sessoesDoDia.reduce((acc: number, s: any) => acc + Math.abs(s.perda_percentual_massa ?? 0), 0) / sessoesDoDia.length;
    const mediaUsg = sessoesDoDia.reduce((acc: number, s: any) => acc + (s.usg ?? 1.015), 0) / sessoesDoDia.length;
    return {
      dia,
      massaBar: Math.min(mediaPerdaMassa / 5, 1),       // normaliza até 5% de perda
      usgBar: Math.min((mediaUsg - 1.000) / 0.030, 1),  // normaliza de 1.000 a 1.030
    };
  });
}

export default function TelaEquipes() {
  const { state } = useAppStore();
  const [filtro, setFiltro] = useState("");
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [grafico, setGrafico] = useState<DiaGrafico[]>(DIAS_SEMANA.map(dia => ({ dia, massaBar: 0, usgBar: 0 })));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [atletasEmRisco, setAtletasEmRisco] = useState(0);
  const [mediaHidratacao, setMediaHidratacao] = useState(0);

  // ID da equipe — idealmente viria de navegação ou do perfil do nutricionista
  const EQUIPE_ID = 1;

  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      // Busca atletas da equipe
      const atletasRaw = await apiFetch<any[]>(`/equipes/${EQUIPE_ID}/atletas`);

      if (Array.isArray(atletasRaw)) {
        const atletasMapped: Atleta[] = atletasRaw.map((item: any) => {
          const deltaMassa = Number(item.deltaMassa ?? item.delta_massa ?? 0);
          const usg = Number(item.usg ?? 1.015);
          return {
            id: String(item.id ?? item.id_usuario),
            nome: item.nome ?? item.nome_completo ?? 'Atleta',
            posicao: item.posicao ?? 'Atleta',
            categoria: item.categoria ?? 'PRINCIPAL',
            massaAtual: Number(item.massaAtual ?? item.massa_atual ?? 0),
            deltaMassa,
            usg,
            statusHidrico: calcularStatusHidrico(deltaMassa, usg),
          };
        });
        setAtletas(atletasMapped);
        setAtletasEmRisco(atletasMapped.filter(a => a.statusHidrico === 'desidratado').length);
        const hidratados = atletasMapped.filter(a => a.statusHidrico === 'hidratado').length;
        setMediaHidratacao(atletasMapped.length > 0 ? Math.round((hidratados / atletasMapped.length) * 100) : 0);
      }

      // Busca sessões para o gráfico longitudinal
      try {
        const sessoes = await apiFetch<any[]>(`/sessoes-treino?id_equipe=${EQUIPE_ID}&limit=50`);
        if (Array.isArray(sessoes)) setGrafico(normalizarParaGrafico(sessoes));
      } catch { /* gráfico permanece zerado */ }

    } catch (err: any) {
      Alert.alert("Erro", err.message ?? "Não foi possível carregar os dados da equipe.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { carregar(); }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); carregar(true); }, [carregar]);

  const atletasFiltrados = atletas.filter(a => a.nome.toLowerCase().includes(filtro.toLowerCase()));

  const sugestoes: Sugestao[] = atletas.some(a => a.statusHidrico === 'desidratado')
    ? [{ id: "1", tipo: "emergencial", titulo: `Protocolo Emergencial: ${atletas.find(a => a.statusHidrico === 'desidratado')?.nome.split(' ')[0]}`, descricao: "Reposição de 1.200ml de solução isotônica (6% carb) em 90 min." }]
    : [{ id: "1", tipo: "ajuste", titulo: "Equipe dentro dos parâmetros", descricao: "Manter oferta hídrica atual e monitorar USG após o treino." }];

  const handleGerarRelatorio = async () => {
    if (gerandoRelatorio) return;
    setGerandoRelatorio(true);
    try {
      await apiFetch(`/equipes/${EQUIPE_ID}/relatorio/pdf`);
      Alert.alert("PDF gerado", "Relatório disponível para download.");
    } catch (err: any) {
      Alert.alert("Erro", err.message ?? "Não foi possível gerar o relatório.");
    } finally {
      setGerandoRelatorio(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
      <View style={styles.layout}>
        <Sidebar activeNav="equipes" />
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8f000a" />}
        >
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
                  <Text style={styles.graficoTitulo}>Status Hídrico Longitudinal</Text>
                  <Text style={styles.graficoSubtitulo}>VARIAÇÃO DE MASSA CORPORAL (%) VS. GRAVIDADE{"\n"}ESPECÍFICA URINÁRIA (USG)</Text>
                </View>
                <View style={styles.filtroBtns}>
                  <View style={styles.filtroBtn}><Text style={styles.filtroBtnText}>{"ÚLTIMOS\n7 DIAS"}</Text></View>
                </View>
              </View>
              {loading ? (
                <View style={{ height: 130, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator color="#8f000a" />
                </View>
              ) : (
                <GraficoBarras dados={grafico} />
              )}
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
                <Text style={styles.kpiNumero}>{String(atletasEmRisco).padStart(2, '0')}</Text>
                <Text style={styles.kpiSubLabel}>PERDA DE MASSA {"> "}2% DETECTADA</Text>
              </View>
              <View style={[styles.card, styles.cardKpiHid]}>
                <Text style={styles.kpiGota}>💧</Text>
                <Text style={styles.kpiLabelHid}>MÉDIA DE HIDRATAÇÃO</Text>
                <Text style={styles.kpiPorcentagem}>{mediaHidratacao}<Text style={styles.kpiPorcentagemSufixo}>%</Text></Text>
                <Text style={styles.kpiSubLabelHid}>
                  {mediaHidratacao >= 80 ? "EQUIPE DENTRO DA META IDEAL" : "ATENÇÃO: ABAIXO DA META"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>Monitoramento de Atletas</Text>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput style={styles.searchInput} placeholder="Filtrar atletas..." placeholderTextColor="#8F8880" value={filtro} onChangeText={setFiltro} />
              </View>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colAtleta]}>ATLETA</Text>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>STATUS HÍDRICO</Text>
              <Text style={[styles.tableHeaderText, styles.colMassa]}>MASSA ATUAL</Text>
              <Text style={[styles.tableHeaderText, styles.colDelta]}>Δ MASSA (%)</Text>
              <Text style={[styles.tableHeaderText, styles.colUsg]}>USG (G/ML)</Text>
              <Text style={[styles.tableHeaderText, styles.colAcoes]}>AÇÕES</Text>
            </View>
            {loading ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8f000a" />
                <Text style={{ marginTop: 12, color: "#5b403d" }}>Carregando atletas...</Text>
              </View>
            ) : atletasFiltrados.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: "#5b403d" }}>Nenhum atleta encontrado.</Text>
              </View>
            ) : (
              atletasFiltrados.map((atleta, index) => (
                <AtletaRow key={atleta.id} atleta={atleta} isLast={index === atletasFiltrados.length - 1} />
              ))
            )}
          </View>

          <View style={styles.rodape}>
            <View style={[styles.card, styles.cardSugestoes]}>
              <Text style={styles.cardTitulo}>Sugestões de Recomposição</Text>
              <View style={styles.sugestaoLista}>
                {sugestoes.map(s => <SugestaoCard key={s.id} sugestao={s} />)}
              </View>
            </View>
            <View style={[styles.card, styles.cardRelatorio]}>
              <Text style={styles.relatorioIcone}>✅</Text>
              <Text style={styles.cardTitulo}>Relatório Consolidado</Text>
              <Text style={styles.relatorioDesc}>
                {atletas.length} atletas monitorados. Desempenho hídrico: {mediaHidratacao}%.
              </Text>
              <TouchableOpacity style={[styles.pdfBtn, gerandoRelatorio && { opacity: 0.6 }]} activeOpacity={0.8} onPress={handleGerarRelatorio} disabled={gerandoRelatorio}>
                <Text style={styles.pdfBtnText}>{gerandoRelatorio ? "GERANDO..." : "GERAR PDF COMPLETO"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.nutricionistaBadge} activeOpacity={0.7} onPress={() => router.push("/perfilProfissional")}>
            <View style={styles.nutAvatar}>
              <Text style={styles.nutAvatarText}>{state.perfil.iniciais || "NR"}</Text>
            </View>
            <View>
              <Text style={styles.nutLabel}>NUTRICIONISTA</Text>
              <Text style={styles.nutNome}>{state.perfil.nome || "Profissional"}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}