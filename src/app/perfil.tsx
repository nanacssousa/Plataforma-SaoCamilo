// src/app/ProfileScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../constants/theme";
import { styles } from "../styles/ProfileStyle";

// ─── Sub-components ───────────────────────────────────────────────────────────

const Divider = () => <View style={styles.divider} />;

const SectionLabel = ({ label }: { label: string }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const BiometricCard = ({
  label,
  value,
  unit,
  accentColor = colors.primary,
}: {
  label: string;
  value: string;
  unit: string;
  accentColor?: string;
}) => (
  <View style={styles.biometricCard}>
    <View style={[styles.biometricAccent, { backgroundColor: accentColor }]} />
    <View style={styles.biometricContent}>
      <Text style={styles.biometricLabel}>{label}</Text>
      <Text style={styles.biometricValue}>
        {value}
        <Text style={styles.biometricUnit}> {unit}</Text>
      </Text>
    </View>
  </View>
);

const SettingRow = ({
  title,
  subtitle,
  value,
  onToggle,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) => (
  <View style={styles.settingRow}>
    <View style={styles.settingText}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.outlineVariant, true: colors.primary }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.outlineVariant}
    />
  </View>
);

const PerformanceCard = ({
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
  <View style={styles.performanceCard}>
    <View style={styles.performanceIcon}>
      <Text style={styles.performanceEmoji}>{icon}</Text>
    </View>
    <View>
      <Text style={styles.performanceLabel}>{label}</Text>
      <Text style={styles.performanceValue}>
        {value}
        <Text style={styles.performanceUnit}>{unit}</Text>
      </Text>
    </View>
  </View>
);

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
type TabKey = "sessao" | "historico" | "perfil";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "sessao", label: "SESSÃO", icon: "⏱" },
  { key: "historico", label: "HISTÓRICO", icon: "📊" },
  { key: "perfil", label: "PERFIL", icon: "👤" },
];

const BottomTabBar = ({ active }: { active: TabKey }) => (
  <View style={styles.tabBar}>
    {TABS.map((tab) => {
      const isActive = tab.key === active;
      return (
        <TouchableOpacity key={tab.key} style={styles.tabItem}>
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
export default function ProfileScreen() {
  const [lembretesPreTreino, setLembretesPreTreino] = useState<boolean>(true);
  const [notifDesidratacao, setNotifDesidratacao] = useState<boolean>(true);
  const metaDiaria = 3.5;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerMenu}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PERFIL</Text>
        <Text style={styles.headerBrand}>H2O-Elite</Text>
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
              <Text style={styles.avatarInitials}>GM</Text>
            </View>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Text style={styles.avatarEditIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.playerName}>Gabriel Mendonça</Text>
          <Text style={styles.playerRole}>VOLANTE • SUB-20</Text>
        </View>

        <Divider />

        {/* Dados Biométricos */}
        <SectionLabel label="DADOS BIOMÉTRICOS" />
        <BiometricCard
          label="PESO DE REFERÊNCIA"
          value="78.4"
          unit="kg"
          accentColor={colors.primary}
        />
        <BiometricCard
          label="IDADE"
          value="19"
          unit="anos"
          accentColor={colors.secondary}
        />
        <BiometricCard
          label="ALTURA"
          value="1.82"
          unit="m"
          accentColor={colors.tertiary}
        />

        <Divider />

        {/* Configurações de Hidratação */}
        <View style={styles.configSection}>
          <SectionLabel label="CONFIGURAÇÕES DE HIDRATAÇÃO" />

          <SettingRow
            title="Lembretes Pré-Treino"
            subtitle="Alertas 30 min antes da atividade"
            value={lembretesPreTreino}
            onToggle={setLembretesPreTreino}
          />

          <View style={styles.settingRowSeparator} />

          <SettingRow
            title="Notificações de Desidratação Crítica"
            subtitle="Baseado na taxa de sudorese recente"
            value={notifDesidratacao}
            onToggle={setNotifDesidratacao}
          />

          <View style={styles.settingRowSeparator} />

          {/* Meta Diária */}
          <View style={styles.metaRow}>
            <Text style={styles.settingTitle}>Meta Diária de Hidratação</Text>
            <Text style={styles.metaValue}>{metaDiaria}L</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                { width: `${((metaDiaria - 1) / 4) * 100}%` },
              ]}
            />
            <View
              style={[
                styles.sliderThumb,
                { left: `${((metaDiaria - 1) / 4) * 100 - 2}%` },
              ]}
            />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1.0 LITRO</Text>
            <Text style={styles.sliderLabel}>5.0 LITROS</Text>
          </View>
        </View>

        <Divider />

        {/* Performance Média */}
        <SectionLabel label="PERFORMANCE MÉDIA" />
        <PerformanceCard
          icon="💧"
          label="TAXA SUDORESE MÉDIA"
          value="1.4"
          unit=" L/h"
        />
        <PerformanceCard
          icon="⚡"
          label="RECUPERAÇÃO MÉDIA"
          value="82"
          unit="%"
        />

        <Divider />

        {/* Botões de Ação */}
        <TouchableOpacity style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>
            👤 EDITAR DADOS PROFISSIONAIS
          </Text>
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
