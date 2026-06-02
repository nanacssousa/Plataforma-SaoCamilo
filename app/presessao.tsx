// app/presessao.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, PanResponder, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/theme";
import { styles } from "@/styles/PreSessaoStyle";
import { AtletaAvatarMini } from "../src/components/shared/AtletaAvatar";
import { useAppStore } from "../src/store/useAppStore";
import { agenteIA, climaAPI, type AgenteIAContrato, type ClimaAtualAPI } from "../src/services/api";

type TipoTreino = "alta" | "resistencia" | "forca" | "recuperacao";
type Sintoma = "caibras" | "tontura" | "fadiga";

const URINE_COLORS = ["#FFFFFF", "#FFF9C4", "#FFF176", "#FFD54F", "#FFB300", "#FB8C00"];
const TRAINING_TYPES = [
  { key: "alta" as TipoTreino, icon: "⚡", label: "Alta Intensidade" },
  { key: "resistencia" as TipoTreino, icon: "⏱", label: "Resistência" },
  { key: "forca" as TipoTreino, icon: "🏋", label: "Força/Hipertrofia" },
  { key: "recuperacao" as TipoTreino, icon: "🚶", label: "Recuperação" },
];
const SYMPTOMS = [
  { key: "caibras" as Sintoma, icon: "⚡", label: "Câibras" },
  { key: "tontura" as Sintoma, icon: "🧍", label: "Tontura" },
  { key: "fadiga" as Sintoma, icon: "🔋", label: "Fadiga" },
];
const INTENSIDADE_MAP: Record<TipoTreino, string> = { alta: "ALTA INTENSIDADE", resistencia: "RESISTÊNCIA", forca: "FORÇA", recuperacao: "MODERADO" };
const TIPO_MAP: Record<TipoTreino, string> = { alta: "Corrida", resistencia: "Atletismo", forca: "Musculação", recuperacao: "Recuperação" };

const ThirstSlider = ({ value, onChange, onDragging }: { value: number; onChange: (v: number) => void; onDragging: (v: boolean) => void }) => {
  const trackWidth = useRef(0);
  const min = 1; const max = 10;
  const percent = ((value - min) / (max - min)) * 100;
  const calcValue = (locationX: number) => { const ratio = Math.min(Math.max(locationX / trackWidth.current, 0), 1); return Math.round(ratio * (max - min) + min); };
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true, onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true, onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: (e) => { onDragging(true); if (trackWidth.current === 0) return; onChange(calcValue(e.nativeEvent.locationX)); },
    onPanResponderMove: (e) => { if (trackWidth.current === 0) return; onChange(calcValue(e.nativeEvent.locationX)); },
    onPanResponderRelease: () => onDragging(false),
    onPanResponderTerminate: () => onDragging(false),
  })).current;
  return (
    <>
      <View style={styles.symptomsHeader}>
        <View style={styles.thirstLabelRow}><Text style={styles.thirstIcon}>💧</Text><Text style={styles.thirstTitle}>NÍVEL DE SEDE</Text></View>
        <Text style={styles.thirstValue}>{value}</Text>
      </View>
      <View style={styles.sliderTrack} onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }} {...panResponder.panHandlers}>
        <View style={[styles.sliderFill, { width: `${percent}%` as any }]} />
        <View style={[styles.sliderThumb, { left: `${percent - 2}%` as any }]} />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>NULA</Text>
        <Text style={styles.sliderLabel}>MODERADA</Text>
        <Text style={styles.sliderLabel}>EXTREMA</Text>
      </View>
    </>
  );
};

function ClimaCard({ clima, carregando }: { clima: ClimaAtualAPI | null; carregando: boolean }) {
  if (carregando) return (
    <View style={cardStyles.card}><ActivityIndicator color={colors.primaryContainer} size="small" /><Text style={cardStyles.sub}>Buscando dados climáticos...</Text></View>
  );
  if (!clima) return null;
  const cor = clima.condicao === 'CONFORTAVEL' ? colors.success : clima.condicao === 'ATENCAO' ? colors.warning : colors.error;
  return (
    <View style={[cardStyles.card, { borderLeftColor: cor }]}>
      <View style={cardStyles.row}>
        <Text style={cardStyles.titulo}>🌡️ Condições Ambientais</Text>
        <View style={[cardStyles.badge, { backgroundColor: cor + '22' }]}><Text style={[cardStyles.badgeText, { color: cor }]}>{clima.condicao}</Text></View>
      </View>
      <View style={cardStyles.grid}>
        <View style={cardStyles.gridItem}><Text style={cardStyles.gridVal}>{clima.temperatura_c.toFixed(1)}°C</Text><Text style={cardStyles.gridLabel}>Temperatura</Text></View>
        <View style={cardStyles.gridItem}><Text style={cardStyles.gridVal}>{clima.umidade_pct.toFixed(0)}%</Text><Text style={cardStyles.gridLabel}>Umidade</Text></View>
        <View style={cardStyles.gridItem}><Text style={[cardStyles.gridVal, { color: cor }]}>{clima.indice_calor_c.toFixed(1)}°C</Text><Text style={cardStyles.gridLabel}>Índice calor</Text></View>
      </View>
      <Text style={cardStyles.sub}>{clima.descricao_condicao} · {clima.fonte}</Text>
    </View>
  );
}

function AgenteCard({ analise, carregando }: { analise: AgenteIAContrato | null; carregando: boolean }) {
  if (carregando) return (
    <View style={cardStyles.card}><ActivityIndicator color={colors.primaryContainer} size="small" /><Text style={cardStyles.sub}>Agente IA analisando seus dados...</Text></View>
  );
  if (!analise) return null;
  const cor = analise.status_sessao === 'ESTÁVEL' ? colors.success : analise.status_sessao === 'ATENÇÃO' ? colors.warning : colors.error;
  return (
    <View style={[cardStyles.card, { borderLeftColor: cor }]}>
      <View style={cardStyles.row}>
        <Text style={cardStyles.titulo}>🤖 Análise do Agente IA</Text>
        <View style={[cardStyles.badge, { backgroundColor: cor + '22' }]}><Text style={[cardStyles.badgeText, { color: cor }]}>{analise.status_sessao}</Text></View>
      </View>
      {analise.disparar_alerta_push && (
        <View style={{ backgroundColor: '#FFF3CD', borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <Text style={{ color: '#856404', fontSize: 12 }}>⚠️ {analise.mensagem_notificacao}</Text>
        </View>
      )}
      <Text style={[cardStyles.sub, { fontWeight: '600', marginBottom: 4, color: colors.onSurface }]}>💧 Hidratação recomendada: {analise.recomendacao_hidratacao_ml} mL</Text>
      <Text style={cardStyles.sub}>{analise.analise_clinica_comentario}</Text>
    </View>
  );
}

export default function PreSessaoScreen() {
  const router = useRouter();
  const { iniciarSessao, showToast, state } = useAppStore();
  const [peso, setPeso] = useState("");
  const [tipoTreino, setTipoTreino] = useState<TipoTreino>("alta");
  const [urineSelecionada, setUrineSelecionada] = useState(2);
  const [nivelSede, setNivelSede] = useState(7);
  const [sintomas, setSintomas] = useState<Sintoma[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [clima, setClima] = useState<ClimaAtualAPI | null>(null);
  const [carregandoClima, setCarregandoClima] = useState(true);
  const [analiseIA, setAnaliseIA] = useState<AgenteIAContrato | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);

  useEffect(() => { climaAPI.buscarAtual(1).then(setClima).catch(() => {}).finally(() => setCarregandoClima(false)); }, []);

  const toggleSintoma = (s: Sintoma) => setSintomas((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const handlePesoChange = (text: string) => { const cleaned = text.replace(/[^0-9.,]/g, ""); if ((cleaned.match(/[.,]/g) || []).length > 1) return; const parts = cleaned.split(/[.,]/); if (parts.length > 1 && parts[1].length > 2) return; setPeso(cleaned); };

  const handleIniciar = async () => {
    const pesoNum = parseFloat(peso.replace(",", "."));
    if (!peso || isNaN(pesoNum) || pesoNum <= 0) { Alert.alert("Peso obrigatório", "Informe seu peso antes de iniciar a sessão."); return; }
    await iniciarSessao({ tipoTreino: TIPO_MAP[tipoTreino], intensidade: INTENSIDADE_MAP[tipoTreino], pesoPre: pesoNum, corUrinaPre: urineSelecionada, sintomasPre: sintomas, sede: nivelSede });
    showToast("Sessão iniciada! Boa treino 💪");
    router.push("/telaDuranteTreino");
    const idSessao = state.idSessaoBackend;
    const idUsuario = state.idUsuarioBackend;
    if (idSessao && idUsuario) {
      setCarregandoIA(true);
      agenteIA.analisarPre({ id_sessao: idSessao, id_usuario: idUsuario, id_local: 1, peso_pre_kg: pesoNum, cor_urina: urineSelecionada, sintomas, nivel_sede: nivelSede }).then(setAnaliseIA).catch(() => {}).finally(() => setCarregandoIA(false));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>ATLETA</Text>
        <TouchableOpacity style={styles.headerAvatar} activeOpacity={0.7} onPress={() => router.push("/perfil")}><AtletaAvatarMini size={36} /></TouchableOpacity>
      </View>
      <View style={styles.progressContainer}>{[0, 1, 2, 3].map((i) => (<View key={i} style={[styles.progressStep, i === 0 && styles.progressStepActive]} />))}</View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled}>
        <Text style={styles.sectionTitle}>Pré-Sessão</Text>
        <Text style={styles.sectionSubtitle}>Configure seus biomarcadores iniciais para precisão técnica.</Text>

        <ClimaCard clima={clima} carregando={carregandoClima} />
        <AgenteCard analise={analiseIA} carregando={carregandoIA} />

        <Text style={styles.sectionLabel}>PESO INICIAL</Text>
        <View style={styles.weightInputContainer}>
          <TextInput style={styles.weightInput} placeholder="00,00" placeholderTextColor={colors.outlineVariant} keyboardType="decimal-pad" value={peso} onChangeText={handlePesoChange} />
          <Text style={styles.weightUnit}>KG</Text>
        </View>
        <Text style={styles.weightHint}>Pesar-se com o mínimo de roupa e bexiga vazia.</Text>

        <Text style={styles.sectionLabel}>TIPO DE TREINO</Text>
        <View style={styles.trainingGrid}>
          {TRAINING_TYPES.map((t) => (
            <TouchableOpacity key={t.key} style={[styles.trainingCard, tipoTreino === t.key && styles.trainingCardActive]} onPress={() => setTipoTreino(t.key)} activeOpacity={0.8}>
              <Text style={styles.trainingIcon}>{t.icon}</Text>
              <Text style={[styles.trainingLabel, tipoTreino === t.key && styles.trainingLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>COLORAÇÃO DA URINA</Text>
        <View style={styles.urineContainer}>
          <View style={styles.urineRow}>
            {URINE_COLORS.map((cor, i) => (
              <TouchableOpacity key={i} style={[styles.urineOption, { backgroundColor: cor }, urineSelecionada === i && styles.urineOptionSelected, i === 0 && { borderColor: colors.outlineVariant, borderWidth: 1 }]} onPress={() => setUrineSelecionada(i)} activeOpacity={0.8} />
            ))}
          </View>
          <View style={styles.urineLabels}><Text style={styles.urineLabel}>EXCELENTE</Text><Text style={styles.urineLabel}>CRÍTICO</Text></View>
        </View>

        <ThirstSlider value={nivelSede} onChange={setNivelSede} onDragging={(dragging) => setScrollEnabled(!dragging)} />

        <View style={styles.symptomsHeader}><Text style={styles.symptomsTitle}>ESCALA DE SINTOMAS</Text><Text style={styles.symptomsBadge}>MÚLTIPLA ESCOLHA</Text></View>
        <View style={styles.symptomsGrid}>
          {SYMPTOMS.map((s) => (
            <TouchableOpacity key={s.key} style={[styles.symptomCard, sintomas.includes(s.key) && styles.symptomCardActive]} onPress={() => toggleSintoma(s.key)} activeOpacity={0.8}>
              <Text style={styles.symptomIcon}>{s.icon}</Text>
              <Text style={[styles.symptomLabel, sintomas.includes(s.key) && styles.symptomLabelActive]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85} onPress={handleIniciar}>
        <Text style={styles.ctaButtonText}>INICIAR SESSÃO</Text>
        <Text style={styles.ctaArrow}>→</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const cardStyles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: colors.outlineVariant, elevation: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titulo: { fontFamily: 'SourceSans3_700Bold', fontSize: 13, color: colors.onSurface },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontFamily: 'SourceSans3_700Bold', fontSize: 10 },
  grid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  gridItem: { alignItems: 'center' },
  gridVal: { fontFamily: 'Newsreader_700Bold', fontSize: 20, color: colors.onSurface },
  gridLabel: { fontFamily: 'SourceSans3_400Regular', fontSize: 10, color: colors.onSurfaceVariant, marginTop: 2 },
  sub: { fontFamily: 'SourceSans3_400Regular', fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 18 },
});
