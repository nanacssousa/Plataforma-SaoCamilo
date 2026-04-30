// Coloque em: app/index.tsx
// Tela principal — Clinical Athlete convertida para React Native + Expo Router

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { fontFamilies } from '../constants/typoraphy';

const { width: W } = Dimensions.get('window');

// ─── Animação de entrada ────────────────────────────────────────────────────────
function useFadeInUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 800, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Barra de progresso animada ─────────────────────────────────────────────────
function AnimatedProgressBar({ percent, color, delay = 0 }: { percent: number; color: string; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: percent / 100, duration: 1500, delay, useNativeDriver: false }).start();
  }, []);
  return (
    <View style={{ height: 10, backgroundColor: colors.outlineVariant, borderRadius: 10, overflow: 'hidden', marginTop: 8 }}>
      <Animated.View style={{ height: '100%', borderRadius: 10, backgroundColor: color, width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
    </View>
  );
}

// ─── Mini gráfico de barras ─────────────────────────────────────────────────────
function MiniChart() {
  const values = [30, 45, 25, 60, 40, 80, 55, 90, 70, 98];
  const anims = useRef(values.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(50, values.map((_, i) =>
      Animated.timing(anims[i], { toValue: 1, duration: 900, delay: 300, useNativeDriver: false })
    )).start();
  }, []);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 56, gap: 3 }}>
      {values.map((v, i) => (
        <View key={i} style={{ flex: 1, height: '100%', backgroundColor: `${colors.primary}15`, borderRadius: 3, overflow: 'hidden', justifyContent: 'flex-end' }}>
          <Animated.View style={{ backgroundColor: colors.primary, borderRadius: 3, height: anims[i].interpolate({ inputRange: [0, 1], outputRange: ['0%', `${v}%`] }) }} />
        </View>
      ))}
    </View>
  );
}

// ─── Navegação inferior ─────────────────────────────────────────────────────────
function BottomNav({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const insets = useSafeAreaInsets();
  const items = [
    { icon: 'pulse' as const, label: 'Performance' },
    { icon: 'restaurant-outline' as const, label: 'Nutrition' },
    { icon: 'flask-outline' as const, label: 'Science' },
    { icon: 'person-outline' as const, label: 'Profile' },
  ];
  return (
    <BlurView intensity={80} tint="light" style={[styles.bottomNav, { paddingBottom: insets.bottom + 6 }]}>
      {items.map((item, idx) => (
        <TouchableOpacity key={idx} style={styles.navItem} onPress={() => setActive(idx)} activeOpacity={0.7}>
          {active === idx && <View style={styles.navDot} />}
          <Ionicons name={item.icon} size={24} color={active === idx ? colors.primary : `${colors.onSurfaceVariant}80`} />
          <Text style={[styles.navLabel, active === idx && { color: colors.primary }]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </BlurView>
  );
}

// ─── Tela principal ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [activeNav, setActiveNav] = useState(0);
  const insets = useSafeAreaInsets();

  const tag = useFadeInUp(0);
  const title = useFadeInUp(150);
  const cta = useFadeInUp(300);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>

      {/* Header com blur */}
      <BlurView intensity={70} tint="light" style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLogo}>
            <Ionicons name="medkit-outline" size={20} color={colors.primaryContainer} />
            <Text style={styles.headerBrand}>CLINICAL ATHLETE</Text>
          </View>
          <View style={styles.headerLinks}>
            {['Performance', 'Science', 'Method'].map(l => (
              <Text key={l} style={styles.headerLink}>{l}</Text>
            ))}
          </View>
        </View>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Hero ── */}
        <ImageBackground
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrGYg3QwmXXOj678D3LTOzvX7h7weIR1fRI7Cn9WT5-kEKjhI5IHPCq-bVron2gxeqh6nCJhKbW1Pxh90PthzzaM6L8l5hDZheNGoBJYHTMr7o01eGpqug8NVslG_yTxIIVBYHvDPdJys0236QSo1VJz6ciD4Iz_qfgTtQ-_CCIOZ13VgmpY1La-9Jl_KqEQMpCxTKs4b58BBO0Aw7-jl4xFub70vT0r556wQ7g7r2iOP7ZdyDcztV0nliZfAHd4MxiZJnJblWa65P' }}
          style={styles.hero}
          imageStyle={{ opacity: 0.38 }}
        >
          <View style={StyleSheet.absoluteFillObject} />
          <View style={styles.heroContent}>
            <Animated.Text style={[styles.heroTag, tag]}>Protocolo Elite H2O</Animated.Text>
            <Animated.Text style={[styles.heroTitle, title]}>
              Potencialize sua{'\n'}
              <Text style={styles.heroTitleLight}>Performance{'\n'}</Text>
              com Precisão Hídrica
            </Animated.Text>
            <Animated.View style={[styles.heroActions, cta]}>
              <TouchableOpacity style={styles.heroPrimaryBtn} activeOpacity={0.85}>
                <Text style={styles.heroPrimaryBtnText}>Começar Agora</Text>
              </TouchableOpacity>
              <View style={styles.heroMeta}>
                <Ionicons name="flask-outline" size={15} color={colors.secondary} />
                <Text style={styles.heroMetaText}>  Baseado em dados fisiológicos reais</Text>
              </View>
            </Animated.View>
          </View>
        </ImageBackground>

        {/* ── Benefícios ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A Ciência por trás da Hidratação</Text>
          <Text style={styles.sectionSub}>H2O-Elite não é sobre beber água. É sobre o equilíbrio exato entre eletrólitos, volume e tempo metabólico.</Text>

          {/* Card branco — Monitoramento */}
          <View style={styles.cardWhite}>
            <View style={styles.cardTopRow}>
              <View style={styles.cardIconWrap}><Ionicons name="pulse" size={26} color={colors.primary} /></View>
              <View style={styles.badge}><Text style={styles.badgeText}>Tempo Real</Text></View>
            </View>
            <Text style={styles.cardTitle}>Monitoramento Preditivo</Text>
            <Text style={styles.cardBody}>Antecipe a fadiga muscular através da análise de bioimpedância e taxas de sudorese capturadas via wearable.</Text>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statNum}>22%</Text>
                <Text style={styles.statLabel}>Aumento de Resistência</Text>
              </View>
              <View>
                <Text style={[styles.statNum, { color: colors.secondary }]}>15min</Text>
                <Text style={styles.statLabel}>Recuperação Acelerada</Text>
              </View>
            </View>
          </View>

          {/* Card azul — Precisão */}
          <View style={styles.cardBlue}>
            <Ionicons name="water" size={34} color={colors.white} />
            <Text style={styles.cardBlueTitle}>Precisão{'\n'}H2O-Elite</Text>
            <Text style={styles.cardBlueBody}>Nossa metodologia proprietária calcula a densidade de minerais necessária para cada mililitro de ingestão baseado no seu IMC e intensidade de treino.</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.cardBlueLink}>Ver Metodologia  →</Text>
            </TouchableOpacity>
          </View>

          {/* Card escuro — Lab */}
          <View style={styles.cardDark}>
            <Ionicons name="flask" size={26} color={colors.primaryContainer} />
            <Text style={styles.cardDarkTitle}>Laboratório de Performance</Text>
            <View style={styles.cardDarkPanel}>
              <Text style={styles.cardDarkLabel}>Status Analítico</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <View style={{ flex: 1, height: 6, backgroundColor: colors.primary, borderRadius: 4 }} />
                <View style={{ flex: 0.6, height: 6, backgroundColor: `${colors.primary}50`, borderRadius: 4 }} />
                <View style={{ flex: 1.4, height: 6, backgroundColor: colors.secondary, borderRadius: 4 }} />
              </View>
            </View>
          </View>

          {/* Card imagem com quote */}
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR-i8ckUIUgoDJ9RqkoZhustltl8b3zk4NK6BCFwCaPv3hBQ6sHzXgUfMvrjiKMjjSvP5pMF5QUX4UrrKati1wTyjW24yTLXKCX0Eua7lOqdghJNnHi8hyZ14ujm0tIi0IPVMM-XJDBooBPZhD3yiTSzgsDsUTn9kZntdv5DJNYoZ3wR1LmHJly8IwKRg3ca_nljSwCKCriXCIW6B5d3VXRUQz9enYWNwyU92-8SIUhvxa0koAuA7A5TpE92368EpAwhnLLcKz_nQa' }}
            style={styles.quoteCard}
            imageStyle={{ borderRadius: 18 }}
          >
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.48)', borderRadius: 18 }]} />
            <Text style={styles.quoteText}>"A hidratação é a base invisível de todo recorde mundial."</Text>
          </ImageBackground>
        </View>

        {/* ── Interface de Precisão ── */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.dataHeaderBar}>
            <Text style={styles.dataTag}>Arquitetura de Dados</Text>
            <Text style={styles.dataTitle}>Interface de{'\n'}<Text style={styles.dataTitleLight}>Precisão</Text></Text>
          </View>

          {[
            { id: '01', title: 'Algoritmos de Carga', body: 'Cruzamos seus dados de sono, estresse e nutricionais para gerar o plano de hidratação do dia.' },
            { id: '02', title: 'Micro-Metodologia', body: 'Sugestões de ingestão fracionada de 150ml a cada 20 minutos durante treinos de alta intensidade.' },
          ].map(item => (
            <View key={item.id} style={styles.dataItem}>
              <Text style={styles.dataNum}>{item.id}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dataItemTitle}>{item.title}</Text>
                <Text style={styles.dataItemBody}>{item.body}</Text>
              </View>
            </View>
          ))}

          {/* Painel de dados */}
          <View style={styles.dataPanel}>
            <Text style={styles.panelSmallLabel}>Frequência Cardíaca Alvo</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <Text style={styles.panelBpm}>164</Text>
              <Text style={styles.panelBpmUnit}>BPM</Text>
            </View>
            <View style={{ marginTop: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <View>
                  <Text style={styles.panelSmallLabel}>Eficiência Hidratante</Text>
                  <Text style={styles.panelEff}>98.2%</Text>
                </View>
                <MiniChart />
              </View>
              <AnimatedProgressBar percent={98.2} color={colors.primary} delay={400} />
            </View>
          </View>
        </View>

        {/* ── CTA ── */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Pronto para o{'\n'}<Text style={styles.ctaTitleItalic}>próximo nível?</Text></Text>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>Começar Jornada Clínica</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>CLINICAL ATHLETE</Text>
          <Text style={styles.footerCopy}>© 2024 CLINICAL ATHLETE PERFORMANCE LABS</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 12 }}>
            {['Privacy', 'Terms', 'Methodology', 'Support'].map(l => (
              <TouchableOpacity key={l}><Text style={styles.footerLink}>{l}</Text></TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Navegação inferior */}
      <BottomNav active={activeNav} setActive={setActiveNav} />
    </View>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
    borderBottomWidth: 1, borderBottomColor: `${colors.outlineVariant}30`,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerBrand: { fontFamily: fontFamilies.headline, letterSpacing: 3, color: colors.onSurface, fontSize: 13, fontWeight: '300' },
  headerLinks: { flexDirection: 'row', gap: 14 },
  headerLink: { fontFamily: fontFamilies.technicalBold, fontSize: 9, fontWeight: '700', letterSpacing: 2, color: colors.onSurfaceVariant, textTransform: 'uppercase' },

  // Hero
  hero: { height: 620, backgroundColor: '#111', justifyContent: 'flex-end' },
  heroContent: { padding: 28, paddingBottom: 48, gap: 0 },
  heroTag: { fontFamily: fontFamilies.technicalBold, fontSize: 10, fontWeight: '700', letterSpacing: 4, color: colors.primaryContainer, textTransform: 'uppercase', marginBottom: 12 },
  heroTitle: { fontFamily: fontFamilies.headlineBold, fontSize: 38, fontWeight: '900', color: colors.white, lineHeight: 44, marginBottom: 28 },
  heroTitleLight: { fontFamily: fontFamilies.headlineItalic, fontStyle: 'italic', fontWeight: '300', color: 'rgba(252,249,245,0.85)' },
  heroActions: { gap: 16 },
  heroPrimaryBtn: { backgroundColor: colors.primary, borderRadius: 50, paddingHorizontal: 32, paddingVertical: 18, alignSelf: 'flex-start' },
  heroPrimaryBtnText: { fontFamily: fontFamilies.technicalBold, color: colors.white, fontWeight: '700', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' },
  heroMeta: { flexDirection: 'row', alignItems: 'center' },
  heroMetaText: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: fontFamilies.body },

  // Seção
  section: { backgroundColor: colors.surfaceContainerLow, paddingHorizontal: 20, paddingVertical: 36, gap: 18 },
  sectionTitle: { fontFamily: fontFamilies.headline, fontSize: 28, color: colors.onSurface, lineHeight: 34 },
  sectionSub: { fontFamily: fontFamilies.body, fontSize: 14, color: colors.onSurfaceVariant, lineHeight: 21 },

  // Card branco
  cardWhite: { backgroundColor: colors.white, borderRadius: 20, padding: 22, gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIconWrap: { backgroundColor: colors.surfaceContainerLow, padding: 10, borderRadius: 12 },
  badge: { backgroundColor: colors.surfaceContainerLow, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontFamily: fontFamilies.technicalBold, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: colors.onSurfaceVariant, textTransform: 'uppercase' },
  cardTitle: { fontFamily: fontFamilies.headline, fontSize: 21, color: colors.onSurface },
  cardBody: { fontFamily: fontFamilies.body, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 19 },
  statsRow: { flexDirection: 'row', gap: 28, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.outlineVariant, marginTop: 4 },
  statNum: { fontFamily: fontFamilies.headlineBold, fontSize: 26, fontWeight: '700', color: colors.primary },
  statLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 8, fontWeight: '700', letterSpacing: 1.5, color: `${colors.onSurfaceVariant}80`, textTransform: 'uppercase', marginTop: 2 },

  // Card azul
  cardBlue: { backgroundColor: colors.secondary, borderRadius: 20, padding: 22, gap: 12 },
  cardBlueTitle: { fontFamily: fontFamilies.headline, fontSize: 24, color: colors.white, lineHeight: 30 },
  cardBlueBody: { fontFamily: fontFamilies.body, fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 19 },
  cardBlueLink: { fontFamily: fontFamilies.technicalBold, fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.white, textTransform: 'uppercase', marginTop: 4 },

  // Card escuro
  cardDark: { backgroundColor: colors.onSurface, borderRadius: 20, padding: 22, gap: 12 },
  cardDarkTitle: { fontFamily: fontFamilies.headline, fontSize: 19, color: colors.white },
  cardDarkPanel: { backgroundColor: 'rgba(255,255,255,0.06)', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 4 },
  cardDarkLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 8, fontWeight: '700', letterSpacing: 2, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' },

  // Quote
  quoteCard: { height: 240, borderRadius: 18, overflow: 'hidden', justifyContent: 'flex-end', padding: 22 },
  quoteText: { fontFamily: fontFamilies.headlineItalic, fontSize: 18, fontStyle: 'italic', color: colors.white, lineHeight: 26 },

  // Dados
  dataHeaderBar: { borderLeftWidth: 2, borderLeftColor: `${colors.primary}35`, paddingLeft: 14, marginBottom: 4 },
  dataTag: { fontFamily: fontFamilies.technicalBold, fontSize: 9, fontWeight: '700', letterSpacing: 3, color: colors.primary, textTransform: 'uppercase' },
  dataTitle: { fontFamily: fontFamilies.headline, fontSize: 32, color: colors.onSurface, lineHeight: 38, marginTop: 6 },
  dataTitleLight: { fontStyle: 'italic', fontWeight: '300' },
  dataItem: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', paddingVertical: 6 },
  dataNum: { fontFamily: fontFamilies.headlineItalic, fontSize: 36, fontStyle: 'italic', color: `${colors.onSurface}14`, width: 52 },
  dataItemTitle: { fontFamily: fontFamilies.headline, fontSize: 19, color: colors.onSurface, marginBottom: 5 },
  dataItemBody: { fontFamily: fontFamilies.body, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 19 },
  dataPanel: { backgroundColor: colors.surfaceContainerHigh, borderRadius: 22, padding: 24, marginTop: 4 },
  panelSmallLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: `${colors.onSurfaceVariant}80`, fontWeight: '700' },
  panelBpm: { fontFamily: fontFamilies.headlineBold, fontSize: 64, fontWeight: '900', color: colors.onSurface },
  panelBpmUnit: { fontFamily: fontFamilies.technical, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: `${colors.onSurface}45` },
  panelEff: { fontFamily: fontFamilies.technicalBold, fontSize: 17, fontWeight: '700', color: colors.primary, marginTop: 2 },

  // CTA
  ctaSection: { backgroundColor: colors.surfaceContainerHighest, paddingVertical: 60, paddingHorizontal: 28, alignItems: 'center', gap: 28 },
  ctaTitle: { fontFamily: fontFamilies.headline, fontSize: 34, color: colors.onSurface, textAlign: 'center', lineHeight: 42 },
  ctaTitleItalic: { fontStyle: 'italic' },
  ctaBtn: { backgroundColor: colors.onSurface, borderRadius: 50, paddingHorizontal: 32, paddingVertical: 18 },
  ctaBtnText: { fontFamily: fontFamilies.technicalBold, color: colors.surface, fontWeight: '700', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' },

  // Footer
  footer: { backgroundColor: colors.surfaceContainerLow, borderTopWidth: 1, borderTopColor: `${colors.outlineVariant}25`, padding: 28 },
  footerBrand: { fontFamily: fontFamilies.headlineItalic, fontSize: 16, fontStyle: 'italic', fontWeight: '600', color: colors.onSurface, textTransform: 'uppercase', letterSpacing: 1 },
  footerCopy: { fontFamily: fontFamilies.technicalBold, fontSize: 8, letterSpacing: 2, color: `${colors.onSurfaceVariant}70`, textTransform: 'uppercase', fontWeight: '700', marginTop: 4 },
  footerLink: { fontFamily: fontFamilies.technicalBold, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '700', color: colors.onSurfaceVariant },

  // Bottom Nav
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: `${colors.primary}10`, paddingTop: 10, zIndex: 60 },
  navItem: { alignItems: 'center', gap: 3, paddingHorizontal: 10, position: 'relative' },
  navDot: { position: 'absolute', top: -10, width: 28, height: 3, backgroundColor: colors.primary, borderRadius: 4 },
  navLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, color: `${colors.onSurfaceVariant}70` },
});