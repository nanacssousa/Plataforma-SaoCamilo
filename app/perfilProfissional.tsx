// app/perfilProfissional.tsx
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/constants/theme";
import { styles } from "@/styles/PerfilProfissionalStyle";

// ─── Sub-components ───────────────────────────────────────────────────────────
const Divider = () => <View style={styles.divider} />;

const SectionLabel = ({ label }: { label: string }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const InfoCard = ({
  label,
  value,
  sub,
  accentColor = colors.primary,
}: {
  label: string;
  value: string;
  sub?: string;
  accentColor?: string;
}) => (
  <View style={styles.infoCard}>
    <View style={[styles.infoAccent, { backgroundColor: accentColor }]} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      {sub ? <Text style={styles.infoSub}>{sub}</Text> : null}
    </View>
  </View>
);

const StatCard = ({
  icon,
  label,
  value,
  unit,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
}) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      <Text style={styles.statEmoji}>{icon}</Text>
    </View>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}> {unit}</Text>
      </Text>
    </View>
  </View>
);

const SpecialtyTag = ({ label }: { label: string }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

const EspecialidadeRow = ({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) => (
  <View style={styles.especRow}>
    <View style={styles.especDot} />
    <View style={styles.especTexts}>
      <Text style={styles.especTitle}>{title}</Text>
      <Text style={styles.especDetail}>{detail}</Text>
    </View>
  </View>
);

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
type TabKey = "atletas" | "sessoes" | "perfil";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "atletas", label: "ATLETAS", icon: "🏃" },
  { key: "sessoes", label: "SESSÕES", icon: "📋" },
  { key: "perfil", label: "PERFIL", icon: "👤" },
];

const TAB_ROUTES: Record<TabKey, string> = {
  atletas: "/painelnutricionista",
  sessoes: "/presessao",
  perfil: "/perfilProfissional",
};

const BottomTabBar = ({ active }: { active: TabKey }) => (
  <View style={styles.tabBar}>
    {TABS.map((tab) => {
      const isActive = tab.key === active;
      return (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabItem}
          onPress={() => {
            if (!isActive) router.push(TAB_ROUTES[tab.key] as any);
          }}
        >
          <View
            style={[styles.tabIconContainer, isActive && styles.tabIconActive]}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
          </View>
          <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PerfilProfissionalScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>PROFISSIONAL</Text>
        <TouchableOpacity
          style={styles.headerAvatar}
          onPress={() => router.push("/perfilProfissional")}
        >
          <Text style={styles.headerAvatarText}>AL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Nome */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>AL</Text>
            </View>
            <View style={styles.badgeOnline} />
          </View>
          <Text style={styles.playerName}>Dra. Ana Lima</Text>
          <Text style={styles.playerRole}>NUTRICIONISTA ESPORTIVA</Text>

          {/* Tags de especialidade */}
          <View style={styles.tagsRow}>
            <SpecialtyTag label="CRN-3 · 45892" />
            <SpecialtyTag label="CBNE Certificada" />
          </View>
        </View>

        <Divider />

        {/* Dados Profissionais */}
        <SectionLabel label="DADOS PROFISSIONAIS" />
        <InfoCard
          label="REGISTRO PROFISSIONAL"
          value="CRN-3 45892"
          sub="Conselho Regional de Nutricionistas — SP"
          accentColor={colors.primary}
        />
        <InfoCard
          label="INSTITUIÇÃO"
          value="Clínica São Camilo"
          sub="Setor de Performance e Nutrição Esportiva"
          accentColor={colors.secondary}
        />
        <InfoCard
          label="FORMAÇÃO"
          value="Nutrição — USP"
          sub="Pós-graduação em Nutrição Esportiva · UNIFESP 2019"
          accentColor={colors.tertiary}
        />
        <InfoCard
          label="EXPERIÊNCIA"
          value="11 anos"
          sub="Atuação com atletas de alto rendimento e futebol profissional"
          accentColor={colors.primary}
        />

        <Divider />

        {/* Áreas de Atuação */}
        <SectionLabel label="ÁREAS DE ATUAÇÃO" />
        <View style={styles.configSection}>
          <EspecialidadeRow
            title="Periodização Nutricional"
            detail="Planejamento nutricional integrado ao calendário de treinos e competições"
          />
          <View style={styles.rowSeparator} />
          <EspecialidadeRow
            title="Hidratação e Eletrólitos"
            detail="Protocolos de reidratação e monitoramento da taxa de sudorese"
          />
          <View style={styles.rowSeparator} />
          <EspecialidadeRow
            title="Suplementação Esportiva"
            detail="Prescrição baseada em evidências para performance e recuperação"
          />
          <View style={styles.rowSeparator} />
          <EspecialidadeRow
            title="Composição Corporal"
            detail="Avaliação por DEXA e Bioimpedância com acompanhamento semanal"
          />
        </View>

        <Divider />

        {/* Estatísticas de Atendimento */}
        <SectionLabel label="ESTATÍSTICAS DE ATENDIMENTO" />
        <StatCard
          icon="🏃"
          label="ATLETAS ACOMPANHADOS"
          value="34"
          unit="ativos"
        />
        <StatCard
          icon="📋"
          label="SESSÕES ESTE MÊS"
          value="128"
          unit="sessões"
        />
        <StatCard icon="📈" label="TAXA DE ADESÃO" value="91" unit="%" />
        <StatCard
          icon="⏱"
          label="TEMPO MÉDIO ATENDIMENTO"
          value="48"
          unit="min"
        />

        <Divider />

        {/* Contato Institucional */}
        <SectionLabel label="CONTATO INSTITUCIONAL" />
        <InfoCard
          label="E-MAIL"
          value="ana.lima@saocamilo.br"
          accentColor={colors.secondary}
        />
        <InfoCard
          label="RAMAL"
          value="3021-4488 · Ramal 214"
          sub="Seg – Sex · 08h às 18h"
          accentColor={colors.tertiary}
        />

        <Divider />

        {/* Botões */}
        <TouchableOpacity style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>✏️ EDITAR PERFIL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>↩ ENCERRAR SESSÃO</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomTabBar active="perfil" />
    </SafeAreaView>
  );
}
