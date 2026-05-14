// src/components/StaffFeaturesSection.tsx
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/landingStaffStyle";

// Mini gráfico de barras estático
const CHART_BARS = [30, 50, 35, 65, 45, 80, 60, 90, 72, 98];

function MiniBarChart() {
  return (
    <View style={styles.featureChartRow}>
      {CHART_BARS.map((h, i) => (
        <View key={i} style={[styles.featureChartBar, { height: `${h}%` }]} />
      ))}
    </View>
  );
}

export default function StaffFeaturesSection() {
  return (
    <>
      {/* ── Infraestrutura Clínica ────────────────────────────────────────── */}
      <View style={[styles.section, styles.sectionBg]}>
        <Text style={styles.sectionLabel}>INFRAESTRUTURA</Text>
        <Text style={styles.sectionTitle}>
          Infraestrutura Clínica{"\n"}de Precisão
        </Text>
        <Text style={styles.sectionSubtitle}>
          Ferramentas avançadas que transformam biomarcadores brutos em
          inteligência clínica aplicável.
        </Text>

        {/* Card grande — Monitoramento */}
        <View style={styles.featureCard}>
          <Text style={styles.featureCardIcon}>📡</Text>
          <Text style={styles.featureCardTitle}>MONITORAMENTO EM TEMPO REAL</Text>
          <MiniBarChart />
          <Text style={styles.featureCardBody}>
            Acompanhamento instantâneo da taxa de sudorese e concentração
            eletrolítica através de sensores vestíveis integrados.
          </Text>
          <View style={styles.featureTagsRow}>
            <View style={styles.featureTagItem}>
              <View style={styles.featureTagDot} />
              <Text style={styles.featureTagText}>LIVE SWEAT RATE</Text>
            </View>
            <View style={styles.featureTagItem}>
              <View style={styles.featureTagDot} />
              <Text style={styles.featureTagText}>NA⁺ LOSS TRACKING</Text>
            </View>
          </View>
        </View>

        {/* Dois cards menores */}
        <View style={styles.featureRow}>
          {/* Advanced Analytics */}
          <View style={styles.featureCardSmall}>
            <Text style={styles.featureCardIcon}>📊</Text>
            <Text style={styles.featureCardTitle}>ADVANCED{"\n"}ANALYTICS</Text>
            <Text style={styles.featureCardBody}>
              Algoritmos preditivos que calculam a janela de hidratação ótima
              para prevenir quedas de rendimento.
            </Text>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeTitle}>⚠ PREDICTIVE ALERT</Text>
              <Text style={styles.alertBadgeText}>
                Potencial desidratação detectada em 12min baseada na intensidade atual.
              </Text>
            </View>
          </View>

          {/* Exportable Reports */}
          <View style={styles.featureCardSmall}>
            <Text style={styles.featureCardIcon}>📄</Text>
            <Text style={styles.featureCardTitle}>EXPORTABLE{"\n"}REPORTS</Text>
            <Text style={styles.featureCardBody}>
              Gere dossiês clínicos detalhados em segundos, formatos prontos
              para impressão ou integração.
            </Text>
            <View style={styles.exportRow}>
              <Text style={styles.exportText}>BAIXAR TEMPLATE</Text>
              <Text style={styles.featureTagText}>↓</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsLabel}>Resultados comprovados</Text>
        <Text style={styles.statsTitle}>
          O Padrão Ouro da{"\n"}Gestão Profissional
        </Text>
        <View style={styles.statsRow}>
          {[
            { n: "150+", d: "INSTITUIÇÕES DE ELITE" },
            { n: "98%",  d: "PRECISÃO BIOMÉTRICA"  },
            { n: "24/7", d: "SUPORTE ESPECIALIZADO" },
          ].map((s) => (
            <View key={s.n} style={styles.statItem}>
              <Text style={styles.statNumber}>{s.n}</Text>
              <Text style={styles.statDesc}>{s.d}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}