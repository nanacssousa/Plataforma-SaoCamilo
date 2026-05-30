// app/telaResultadoSessao.tsx
// Resultado real calculado a partir da última sessão do histórico
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AtletaAvatarMini } from '../src/components/shared/AtletaAvatar';
import { ToastContainer } from '../src/components/shared/Toast';
import { styles } from '../src/styles/resultadoSessaoStyle';
import { useAppStore } from '../src/store/useAppStore';
import { colors } from '../src/constants/theme';

function getNivel(desPct: number): { label: string; color: string; zone: number } {
  if (desPct < 1) return { label: 'HIDRATADO', color: colors.success, zone: 0 };
  if (desPct < 2) return { label: 'LEVE', color: '#F59E0B', zone: 1 };
  if (desPct < 3) return { label: 'MODERADA', color: colors.warning, zone: 2 };
  return { label: 'CRÍTICA', color: colors.error, zone: 3 };
}

export default function TelaResultadoSessao() {
  const { state } = useAppStore();
  const entry = state.historico[0]; // a mais recente

  if (!entry) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
          <Text style={{ fontSize: 40, marginBottom: 16 }}>📭</Text>
          <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 13, color: colors.onSurfaceVariant, textAlign: 'center', letterSpacing: 1 }}>
            NENHUMA SESSÃO ENCONTRADA
          </Text>
          <TouchableOpacity
            style={{ marginTop: 24, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 28 }}
            onPress={() => router.replace('/telaAtleta')}
          >
            <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 12, letterSpacing: 1, color: colors.white }}>VOLTAR AO PAINEL</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const nivel = getNivel(entry.desidratacaoPct);
  const reposicaoL = ((entry.pesoPreKg - entry.pesoPosKg) * 1.5).toFixed(1);
  const horas = Math.floor(entry.duracaoMin / 60);
  const min = entry.duracaoMin % 60;
  const duracaoStr = horas > 0 ? `${horas}h ${min}m` : `${min}min`;
  const dataStr = new Date(entry.dataISO).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const horaInicio = new Date(entry.dataISO);
  horaInicio.setMinutes(horaInicio.getMinutes() - entry.duracaoMin);
  const horaStr = `${horaInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(entry.dataISO).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const isCritica = entry.desidratacaoPct >= 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ToastContainer />
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>ATLETA</Text>
        <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, overflow: 'hidden' }} onPress={() => router.push('/perfil')}>
          <AtletaAvatarMini size={36} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>RESUMO DE PERFORMANCE</Text>
        <Text style={styles.pageTitle}>Análise de Hidratação Individualizada</Text>
        <Text style={styles.pageDate}>📅 {dataStr} 🕒 {horaStr}</Text>

        {/* Taxa de Sudorese */}
        <View style={styles.cardLight}>
          <Text style={styles.cardLabel}>TAXA DE SUDORESE</Text>
          <View style={styles.rowAlign}>
            <Text style={styles.mainValue}>
              {entry.taxaSudorese.toFixed(2)}<Text style={styles.unitText}> L/h</Text>
            </Text>
            {isCritica && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>⚠️ ZONA CRÍTICA</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardDesc}>
            {isCritica
              ? 'Sua perda de líquidos excedeu a taxa de absorção recomendada para sua massa.'
              : 'Taxa dentro do esperado para este tipo de atividade.'}
          </Text>
          <View style={styles.zonesBarRow}>
            <Text style={styles.zoneText}>SEGURA</Text>
            <Text style={styles.zoneText}>MODERADA</Text>
            <Text style={styles.zoneText}>CRÍTICA</Text>
          </View>
          <View style={styles.zoneColors}>
            <View style={[styles.zoneBox, { backgroundColor: entry.taxaSudorese < 1 ? colors.secondary : '#B0BEC5' }]} />
            <View style={[styles.zoneBox, { backgroundColor: entry.taxaSudorese >= 1 && entry.taxaSudorese < 1.5 ? colors.warning : '#B0BEC5' }]} />
            <View style={[styles.zoneBox, { backgroundColor: entry.taxaSudorese >= 1.5 ? colors.error : '#B0BEC5' }]} />
          </View>
        </View>

        {/* Déficit de Massa */}
        <View style={styles.cardWarm}>
          <View style={styles.rowBetween}>
            <Text style={styles.iconRed}>💧</Text>
            <View style={[styles.badgeGray, { backgroundColor: nivel.color + '22' }]}>
              <Text style={[styles.badgeGrayText, { color: nivel.color }]}>{nivel.label}</Text>
            </View>
          </View>
          <Text style={styles.mainValue}>{entry.desidratacaoPct.toFixed(2)}%</Text>
          <Text style={styles.cardLabel}>DÉFICIT DE MASSA (%)</Text>
          <Text style={[styles.cardDesc, { marginTop: 12 }]}>
            {entry.desidratacaoPct >= 2
              ? 'Acima de 2% compromete o desempenho cognitivo e motor.'
              : 'Dentro da faixa aceitável. Bom trabalho de hidratação.'}
          </Text>
        </View>

        {/* Dados da sessão */}
        <View style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 11, letterSpacing: 1, color: colors.onSurfaceVariant, marginBottom: 12 }}>DETALHES DA SESSÃO</Text>
          {[
            ['Tipo', entry.tipoTreino],
            ['Intensidade', entry.intensidade],
            ['Duração', duracaoStr],
            ['Água consumida', `${entry.aguaConsumidaML}ml`],
            ['Peso pré', `${entry.pesoPreKg.toFixed(1)}kg`],
            ['Peso pós', `${entry.pesoPosKg.toFixed(1)}kg`],
            ['Recuperação', `${entry.recuperacaoPct}%`],
          ].map(([label, value]) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: colors.outlineVariant }}>
              <Text style={{ fontFamily: 'SourceSans3_400Regular', fontSize: 13, color: colors.onSurfaceVariant }}>{label}</Text>
              <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 13, color: colors.onSurface }}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Recomendação */}
        <View style={styles.cardDarkRed}>
          <Text style={styles.darkTitle}>Recomendação de Reposição</Text>
          <Text style={styles.darkDesc}>
            Para otimizar sua recuperação pós-treino, consuma 150% do peso perdido nas próximas 4 horas.
          </Text>
          <View style={styles.darkHighlightBox}>
            <Text style={styles.darkHighlightLabel}>VOLUME ALVO</Text>
            <Text style={styles.darkHighlightValue}>
              {reposicaoL}<Text style={styles.darkHighlightUnit}> LITROS</Text>
            </Text>
          </View>
        </View>

        {/* Ações */}
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginBottom: 12 }}
          onPress={() => router.replace('/telaAtleta')}
        >
          <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 13, letterSpacing: 1, color: colors.white }}>VOLTAR AO PAINEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ borderWidth: 1.5, borderColor: colors.outlineVariant, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginBottom: 24 }}
          onPress={() => router.push('/historico')}
        >
          <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 13, letterSpacing: 1, color: colors.onSurface }}>VER HISTÓRICO</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
