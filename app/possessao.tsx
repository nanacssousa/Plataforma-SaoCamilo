// app/possessao.tsx
// Pós-sessão — integrada ao estado global, calcula e salva resultado real
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AtletaAvatarMini } from '../src/components/shared/AtletaAvatar';
import { ToastContainer } from '../src/components/shared/Toast';
import { colors } from '../src/constants/theme';
import { styles } from '../src/styles/PosSessaoStyle';
import { useAppStore } from '../src/store/useAppStore';

type Sintoma = 'caibras' | 'tontura' | 'fadiga';
const URINE_COLORS = ['#FFFFFF', '#FFF9C4', '#FFF176', '#FFD54F', '#FFB300', '#FB8C00'];
const SYMPTOMS = [
  { key: 'caibras' as Sintoma, icon: '⚡', label: 'Câibras' },
  { key: 'tontura' as Sintoma, icon: '🧍', label: 'Tontura' },
  { key: 'fadiga' as Sintoma, icon: '🔋', label: 'Fadiga' },
];

export default function PosSessaoScreen() {
  const { state, encerrarSessao, showToast } = useAppStore();
  const { sessaoAtiva } = state;

  const [peso, setPeso] = useState('');
  const [urineSelecionada, setUrineSelecionada] = useState(2);
  const [sintomas, setSintomas] = useState<Sintoma[]>([]);

  const toggleSintoma = (s: Sintoma) =>
    setSintomas(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handlePesoChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.,]/g, '');
    const seps = (cleaned.match(/[.,]/g) || []).length;
    if (seps > 1) return;
    const parts = cleaned.split(/[.,]/);
    if (parts.length > 1 && parts[1].length > 2) return;
    setPeso(cleaned);
  };

  const handleFinalizar = () => {
    const pesoNum = parseFloat(peso.replace(',', '.'));
    if (!peso || isNaN(pesoNum) || pesoNum <= 0) {
      Alert.alert('Peso obrigatório', 'Informe seu peso pós-treino para calcular a desidratação.');
      return;
    }
    if (!sessaoAtiva) {
      Alert.alert('Nenhuma sessão ativa', 'Inicie uma sessão antes de finalizar.');
      return;
    }
    const entry = encerrarSessao(pesoNum, urineSelecionada, sintomas);
    if (entry) {
      showToast('Sessão finalizada e salva! 🎉');
      router.replace('/telaResultadoSessao');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ToastContainer />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 22, color: colors.onSurface, paddingHorizontal: 4 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PÓS-SESSÃO</Text>
        <TouchableOpacity style={styles.headerAvatar} onPress={() => router.push('/perfil')}>
          <AtletaAvatarMini size={36} />
        </TouchableOpacity>
      </View>

      {/* Banner da sessão ativa */}
      {sessaoAtiva && (
        <View style={{ backgroundColor: colors.primaryTint, paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.outlineVariant }}>
          <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 11, letterSpacing: 1, color: colors.primary }}>
            SESSÃO ENCERRADA • {sessaoAtiva.tipoTreino} • {sessaoAtiva.aguaML}ml registrados
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll ?? { flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 18, color: colors.onSurface, marginBottom: 6 }}>
          Dados Finais
        </Text>
        <Text style={{ fontFamily: 'SourceSans3_400Regular', fontSize: 14, color: colors.onSurfaceVariant, marginBottom: 24 }}>
          Registre os dados pós-treino para calcular sua hidratação.
        </Text>

        {/* Peso pós */}
        <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginBottom: 8 }}>PESO PÓS-TREINO</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerLow, borderRadius: 10, paddingHorizontal: 16, marginBottom: 6 }}>
          <TextInput
            style={{ flex: 1, fontFamily: 'Newsreader_700Bold', fontSize: 32, color: colors.onSurface, paddingVertical: 14 }}
            placeholder="00,00"
            placeholderTextColor={colors.outlineVariant}
            keyboardType="decimal-pad"
            value={peso}
            onChangeText={handlePesoChange}
          />
          <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 13, color: colors.onSurfaceVariant }}>KG</Text>
        </View>
        {sessaoAtiva && (
          <Text style={{ fontFamily: 'SourceSans3_400Regular', fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 20 }}>
            Peso pré-treino: {sessaoAtiva.pesoPre.toFixed(1)}kg
          </Text>
        )}

        {/* Cor da urina */}
        <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginBottom: 12 }}>COLORAÇÃO DA URINA</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
          {URINE_COLORS.map((cor, i) => (
            <TouchableOpacity
              key={i}
              style={{
                width: 40, height: 40, borderRadius: 8,
                backgroundColor: cor,
                borderWidth: urineSelecionada === i ? 2.5 : 1,
                borderColor: urineSelecionada === i ? colors.primary : colors.outlineVariant,
              }}
              onPress={() => setUrineSelecionada(i)}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          <Text style={{ fontFamily: 'SourceSans3_400Regular', fontSize: 11, color: colors.onSurfaceVariant }}>EXCELENTE</Text>
          <Text style={{ fontFamily: 'SourceSans3_400Regular', fontSize: 11, color: colors.onSurfaceVariant }}>CRÍTICO</Text>
        </View>

        {/* Sintomas */}
        <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginBottom: 12 }}>SINTOMAS</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
          {SYMPTOMS.map(s => (
            <TouchableOpacity
              key={s.key}
              style={{
                flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
                backgroundColor: sintomas.includes(s.key) ? colors.primary : colors.surfaceContainerLow,
                borderWidth: 1.5,
                borderColor: sintomas.includes(s.key) ? colors.primary : colors.outlineVariant,
              }}
              onPress={() => toggleSintoma(s.key)}
            >
              <Text style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</Text>
              <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 11, letterSpacing: 0.5, color: sintomas.includes(s.key) ? colors.white : colors.onSurface }}>
                {s.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, padding: 20, borderTopWidth: 1, borderColor: colors.outlineVariant }}>
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          activeOpacity={0.85}
          onPress={handleFinalizar}
        >
          <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 13, letterSpacing: 1, color: colors.white }}>FINALIZAR E VER RESULTADO</Text>
          <Text style={{ color: colors.white, fontSize: 16 }}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
