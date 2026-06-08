// app/telaAtleta.tsx
// Dashboard principal do atleta — dados reais do estado global
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AtletaAvatarMini } from '../src/components/shared/AtletaAvatar';
import { ToastContainer } from '../src/components/shared/Toast';
import { usePerformance } from '../src/hooks/usePerformance';
import { climaAPI, type ClimaAtualAPI } from '../src/services/api';
import { useAppStore } from '../src/store/useAppStore';
import { styles } from '../src/styles/atletaStyle';

export default function TelaAtleta() {
  const { state } = useAppStore();
  const { daily, historico, perfil } = state;
  const perf = usePerformance();
  const [clima, setClima] = useState<ClimaAtualAPI | null>(null);
  const [climaCarregando, setClimaCarregando] = useState(true);
  const [cidade, setCidade] = useState<string | null>(null);
  const [climaErro, setClimaErro] = useState<string | null>(null);

  // Coordenadas padrão: Santo André / São Paulo
  const LAT_DEFAULT = -23.6639;
  const LON_DEFAULT = -46.5383;

  useEffect(() => {
    (async () => {
      let lat = LAT_DEFAULT;
      let lon = LON_DEFAULT;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          lat = loc.coords.latitude;
          lon = loc.coords.longitude;
          const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
          if (geo[0]) setCidade(`${geo[0].city ?? geo[0].subregion ?? ''}, ${geo[0].region ?? ''}`);
        } else {
          setCidade('Santo André, SP');
        }
      } catch {
        setCidade('Santo André, SP');
      }
      try {
        const resultado = await climaAPI.buscarPorCoordenadas(lat, lon);
        setClima(resultado);
      } catch (e: any) {
        setClimaErro(e?.message ?? 'Erro ao buscar clima');
        setClima(null);
      } finally {
        setClimaCarregando(false);
      }
    })();
  }, []);

  const pctMeta = Math.min(100, Math.round((daily.consumidoML / daily.metaML) * 100));
  const ultimaSessao = historico[0];
  const taxaStr = ultimaSessao ? ultimaSessao.taxaSudorese.toFixed(1) : '—';
  const ultimaDataStr = ultimaSessao
    ? new Date(ultimaSessao.dataISO).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : 'Nenhuma';

  const dadosDesatualizados = !ultimaSessao ||
    (Date.now() - new Date(ultimaSessao.dataISO).getTime()) > 48 * 60 * 60 * 1000;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ToastContainer />
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>ATLETA</Text>
        <TouchableOpacity style={styles.headerAvatar} onPress={() => router.push('/perfil')}>
          <AtletaAvatarMini size={36} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {dadosDesatualizados && (
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>⚠️ DADOS DESATUALIZADOS</Text>
            <Text style={styles.alertText}>
              {ultimaSessao
                ? 'Sua última medição foi há mais de 48 horas. Registre novos dados para manter a precisão.'
                : 'Nenhuma sessão registrada ainda. Inicie seu primeiro monitoramento.'}
            </Text>
          </View>
        )}

        {/* Card Clima */}
        {climaCarregando ? (
          <View style={climaStyles.card}>
            <ActivityIndicator size="small" color="#8f000a" />
            <Text style={climaStyles.sub}>Buscando condições climáticas...</Text>
          </View>
        ) : clima ? (
          <View style={[climaStyles.card, {
            borderLeftColor: clima.condicao === 'CONFORTAVEL' ? '#22c55e'
              : clima.condicao === 'ATENCAO' ? '#f59e0b' : '#ef4444'
          }]}>
            <View style={climaStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={climaStyles.titulo}>Condições Ambientais</Text>
                {cidade && (
                  <Text style={{ fontFamily: 'SourceSans3_400Regular', fontSize: 11, color: '#5b403d', marginTop: 2 }}>
                   {cidade}
                  </Text>
                )}
              </View>
              <View style={[climaStyles.badge, {
                backgroundColor: clima.condicao === 'CONFORTAVEL' ? '#22c55e22'
                  : clima.condicao === 'ATENCAO' ? '#f59e0b22' : '#ef444422'
              }]}>
                <Text style={[climaStyles.badgeText, {
                  color: clima.condicao === 'CONFORTAVEL' ? '#22c55e'
                    : clima.condicao === 'ATENCAO' ? '#f59e0b' : '#ef4444'
                }]}>{clima.condicao}</Text>
              </View>
            </View>
            <View style={climaStyles.grid}>
              <View style={climaStyles.gi}><Text style={climaStyles.gv}>{clima.temperatura_c.toFixed(1)}°C</Text><Text style={climaStyles.gl}>Temp.</Text></View>
              <View style={climaStyles.gi}><Text style={climaStyles.gv}>{clima.umidade_pct.toFixed(0)}%</Text><Text style={climaStyles.gl}>Umidade</Text></View>
              <View style={climaStyles.gi}>
                <Text style={[climaStyles.gv, {
                  color: clima.condicao === 'CONFORTAVEL' ? '#22c55e'
                    : clima.condicao === 'ATENCAO' ? '#f59e0b' : '#ef4444'
                }]}>{clima.indice_calor_c.toFixed(1)}°C</Text>
                <Text style={climaStyles.gl}>Índice calor</Text>
              </View>
            </View>
            <Text style={climaStyles.sub}>{clima.descricao_condicao} · {clima.fonte}</Text>
          </View>
        ) : climaErro ? (
          <View style={[climaStyles.card, { borderLeftColor: '#94a3b8', flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
            <Text style={{ fontSize: 18 }}>🌡️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[climaStyles.titulo, { color: '#64748b' }]}>Clima indisponível</Text>
              <Text style={[climaStyles.sub, { textAlign: 'left', marginTop: 2 }]}>{climaErro}</Text>
            </View>
          </View>
        ) : null}

        {/* Hero iniciar sessão */}
        <View style={styles.heroCard}>
          <Text style={styles.heroSub}>
            {state.sessaoAtiva ? 'SESSÃO EM ANDAMENTO' : 'PRONTO PARA TREINAR?'}
          </Text>
          <Text style={styles.heroTitle}>
            {state.sessaoAtiva ? 'Continuar Sessão' : 'Iniciar Nova Sessão'}
          </Text>
          <Text style={styles.heroText}>
            {state.sessaoAtiva
              ? `Fluidos: ${state.sessaoAtiva.aguaML}ml registrados. Continue monitorando.`
              : 'Inicie o monitoramento em tempo real para calcular sua taxa de sudorese hoje.'}
          </Text>
          <TouchableOpacity
            style={styles.heroBtn}
            activeOpacity={0.85}
            onPress={() => router.push(state.sessaoAtiva ? '/telaDuranteTreino' : '/presessao')}
          >
            <Text style={styles.heroBtnText}>
              {state.sessaoAtiva ? 'VOLTAR À SESSÃO' : 'COMEÇAR MONITORAMENTO'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grid de status */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>META HOJE</Text>
            <Text style={styles.gridValueBigger}>
              {pctMeta}<Text style={styles.gridUnit}>%</Text>
            </Text>
            <Text style={styles.gridDesc}>HIDRATAÇÃO DIÁRIA</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${pctMeta}%` }]} />
            </View>
            <Text style={{ fontFamily: 'SourceSans3_400Regular', fontSize: 11, color: '#5b403d', marginTop: 4 }}>
              {(daily.consumidoML / 1000).toFixed(1)}L / {(daily.metaML / 1000).toFixed(1)}L
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>ÚLTIMA TAXA</Text>
            <Text style={styles.gridValue}>
              {taxaStr}<Text style={styles.gridUnit}> L/h</Text>
            </Text>
            <Text style={styles.gridDesc}>SUDORESE REGISTRADA</Text>
            <Text style={styles.gridSubDesc}>Sessão: {ultimaDataStr}</Text>
          </View>
        </View>

        {/* Highlight última sessão */}
        {ultimaSessao && (
          <View style={styles.highlightCard}>
            <Text style={styles.highlightSub}>ÚLTIMA TAXA DE SUDORESE</Text>
            <Text style={styles.highlightTitle}>{ultimaSessao.tipoTreino}</Text>
            <Text style={styles.highlightValue}>
              {ultimaSessao.taxaSudorese.toFixed(1)}<Text style={styles.highlightUnit}> L/H</Text>
            </Text>
          </View>
        )}

        {/* Próxima hidratação */}
        {state.settings.metaDiariaL > 0 && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>META DIÁRIA</Text>
            <Text style={styles.metricValue}>
              {pctMeta >= 100 ? '✅ Meta atingida!' : `${(daily.consumidoML / 1000).toFixed(1)}L de ${state.settings.metaDiariaL.toFixed(1)}L`}
            </Text>
            {perf.totalSessoes > 0 && (
              <>
                <Text style={[styles.metricLabel, { marginTop: 12 }]}>PERFORMANCE MÉDIA</Text>
                <Text style={styles.metricTarget}>{perf.taxaSudoroseMedia.toFixed(1)} L/h sudorese</Text>
              </>
            )}
          </View>
        )}

        {/* Nav para histórico */}
        <TouchableOpacity
          style={{ backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#e4beb9', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 }}
          onPress={() => router.push('/historico')}
        >
          <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 12, letterSpacing: 1, color: '#1c1c1a' }}>
            📊 VER HISTÓRICO COMPLETO
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab */}
      <View style={{ flexDirection: 'row', backgroundColor: '#f6f3ef', borderTopWidth: 1, borderTopColor: '#e4beb9', paddingVertical: 8, paddingBottom: 12 }}>
        {[{ key: 'sessao', label: 'SESSÃO', icon: '⏱', route: '/telaAtleta' },
          { key: 'historico', label: 'HISTÓRICO', icon: '📊', route: '/historico' },
          { key: 'perfil', label: 'PERFIL', icon: '👤', route: '/perfil' }
        ].map(tab => {
          const isActive = tab.key === 'sessao';
          return (
            <TouchableOpacity key={tab.key} style={{ flex: 1, alignItems: 'center' }} onPress={() => { if (!isActive) router.push(tab.route as any); }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 2, backgroundColor: isActive ? '#8f000a' : 'transparent' }}>
                <Text style={{ fontSize: 16 }}>{tab.icon}</Text>
              </View>
              <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: isActive ? '#8f000a' : '#5b403d' }}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const climaStyles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#e4beb9', elevation: 1, flexDirection: 'column', gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titulo: { fontFamily: 'SourceSans3_700Bold', fontSize: 13, color: '#1c1c1a' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontFamily: 'SourceSans3_700Bold', fontSize: 10 },
  grid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
  gi: { alignItems: 'center' },
  gv: { fontFamily: 'Newsreader_700Bold', fontSize: 18, color: '#1c1c1a' },
  gl: { fontFamily: 'SourceSans3_400Regular', fontSize: 10, color: '#5b403d', marginTop: 2 },
  sub: { fontFamily: 'SourceSans3_400Regular', fontSize: 11, color: '#5b403d', textAlign: 'center', marginTop: 2 },
});