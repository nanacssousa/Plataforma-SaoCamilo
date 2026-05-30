// app/historico.tsx
// Histórico real — dados do estado global, filtros funcionais, sem mocks
import { router } from 'expo-router';
import React from 'react';
import {
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
import { useHistoricoFiltrado, type FiltroHistorico } from '../src/hooks/useHistoricoFiltrado';
import { styles } from '../src/styles/HistoricoStyle';
import { type HydrationEntry } from '../src/types';

// ─── Card de sessão ───────────────────────────────────────────────────────────
function SessionCard({ entry }: { entry: HydrationEntry }) {
  const isAlta = entry.desidratacaoPct >= 2;
  const date = new Date(entry.dataISO);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = date.toLocaleString('pt-BR', { month: 'short' });
  const horas = Math.floor(entry.duracaoMin / 60);
  const min = entry.duracaoMin % 60;
  const duracaoStr = horas > 0 ? `${horas}h ${min}m` : `${min}m`;

  const badgeStyle = entry.intensidade === 'ALTA INTENSIDADE' ? styles.cardBadgeHigh
    : entry.intensidade === 'RESISTÊNCIA' ? styles.cardBadgeResist : {};

  return (
    <View style={styles.sessionCard}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardBadge, badgeStyle]}>{entry.intensidade}</Text>
        <View style={styles.cardDateContainer}>
          <Text style={styles.cardDateDay}>{dia} {mes}</Text>
          <Text style={styles.cardDateMonth}>{date.getFullYear()}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{entry.tipoTreino}</Text>
      <View style={styles.cardDivider} />
      <View style={styles.cardStats}>
        <View style={styles.cardStatsLeft}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DURAÇÃO</Text>
            <View style={styles.statValue}>
              <Text style={styles.statIcon}>⏱</Text>
              <Text style={styles.statText}>{duracaoStr}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TAXA DE SUDOSE</Text>
            <View style={styles.statValue}>
              <Text style={styles.statIcon}>💧</Text>
              <Text style={styles.statText}>{entry.taxaSudorese.toFixed(1)} L/h</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DESIDRATAÇÃO</Text>
            <View style={styles.statValue}>
              <Text style={styles.dehydrationIcon}>{isAlta ? '▲' : '✓'}</Text>
              <Text style={[styles.statText, isAlta ? styles.dehydrationHigh : styles.dehydrationNormal]}>
                {entry.desidratacaoPct.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center', paddingRight: 4 }}>
          <Text style={{ color: colors.primary, fontSize: 22 }}>→</Text>
        </View>
      </View>

      {/* Barra de recuperação */}
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={styles.statLabel}>RECUPERAÇÃO</Text>
          <Text style={[styles.statLabel, { color: entry.recuperacaoPct >= 80 ? colors.success : colors.warning }]}>
            {entry.recuperacaoPct}%
          </Text>
        </View>
        <View style={{ height: 4, backgroundColor: colors.outlineVariant, borderRadius: 2 }}>
          <View style={{
            height: 4,
            width: `${entry.recuperacaoPct}%`,
            backgroundColor: entry.recuperacaoPct >= 80 ? colors.success : colors.warning,
            borderRadius: 2,
          }} />
        </View>
      </View>
    </View>
  );
}

// ─── Filtro chips ─────────────────────────────────────────────────────────────
const FILTROS: { key: FiltroHistorico; label: string }[] = [
  { key: 'todos', label: 'TODOS' },
  { key: 'hoje', label: 'HOJE' },
  { key: 'semana', label: 'SEMANA' },
  { key: 'mes', label: 'MÊS' },
];

// ─── Bottom Tab ───────────────────────────────────────────────────────────────
type TabKey = 'sessao' | 'historico' | 'perfil';
const TABS = [
  { key: 'sessao' as TabKey, label: 'SESSÃO', icon: '⏱' },
  { key: 'historico' as TabKey, label: 'HISTÓRICO', icon: '📊' },
  { key: 'perfil' as TabKey, label: 'PERFIL', icon: '👤' },
];
const TAB_ROUTES: Record<TabKey, string> = { sessao: '/telaAtleta', historico: '/historico', perfil: '/perfil' };

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HistoricoScreen() {
  const { filtrado, filtro, setFiltro, search, setSearch } = useHistoricoFiltrado();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ToastContainer />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>ATLETA</Text>
        <TouchableOpacity style={styles.headerAvatar} activeOpacity={0.7} onPress={() => router.push('/perfil')}>
          <AtletaAvatarMini size={36} />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise por tipo ou intensidade"
            placeholderTextColor={colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20, marginBottom: 4, maxHeight: 44 }}>
        {FILTROS.map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFiltro(f.key)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
              backgroundColor: filtro === f.key ? colors.primary : colors.surfaceContainerLow,
            }}
          >
            <Text style={{
              fontFamily: 'SourceSans3_700Bold',
              fontSize: 11,
              letterSpacing: 1,
              color: filtro === f.key ? colors.white : colors.onSurfaceVariant,
            }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtrado.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 }}>
            <Text style={{ fontSize: 40, marginBottom: 16 }}>📭</Text>
            <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 13, letterSpacing: 1, color: colors.onSurfaceVariant, textAlign: 'center' }}>
              {search ? 'NENHUM RESULTADO ENCONTRADO' : 'NENHUMA SESSÃO REGISTRADA'}
            </Text>
            <Text style={{ fontFamily: 'SourceSans3_400Regular', fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
              {search ? 'Tente outro termo de busca.' : 'Complete uma sessão de treino para ver o histórico aqui.'}
            </Text>
            {!search && (
              <TouchableOpacity
                style={{ marginTop: 20, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 }}
                onPress={() => router.push('/presessao')}
              >
                <Text style={{ fontFamily: 'SourceSans3_700Bold', fontSize: 12, letterSpacing: 1, color: colors.white }}>INICIAR PRIMEIRA SESSÃO</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtrado.map(entry => <SessionCard key={entry.id} entry={entry} />)
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Tab */}
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = tab.key === 'historico';
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => { if (!isActive) router.push(TAB_ROUTES[tab.key] as any); }}>
              <View style={[styles.tabIconContainer, isActive && styles.tabIconActive]}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
