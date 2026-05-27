// app/perfil.tsx
import { colors } from "@/constants/theme";
import { styles } from "@/styles/ProfileStyle";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

// ─── Slider funcional ─────────────────────────────────────────────────────────
const HydrationSlider = ({
  value,
  onChange,
  onDragging,
  min = 1,
  max = 5,
}: {
  value: number;
  onChange: (v: number) => void;
  onDragging: (v: boolean) => void;
  min?: number;
  max?: number;
}) => {
  const trackWidth = useRef(0);
  const percent = ((value - min) / (max - min)) * 100;

  const calcValue = (locationX: number) => {
    const ratio = Math.min(Math.max(locationX / trackWidth.current, 0), 1);
    const raw = ratio * (max - min) + min;
    return Math.round(raw * 10) / 10;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e) => {
        onDragging(true);
        if (trackWidth.current === 0) return;
        onChange(calcValue(e.nativeEvent.locationX));
      },
      onPanResponderMove: (e) => {
        if (trackWidth.current === 0) return;
        onChange(calcValue(e.nativeEvent.locationX));
      },
      onPanResponderRelease: () => {
        onDragging(false);
      },
      onPanResponderTerminate: () => {
        onDragging(false);
      },
    }),
  ).current;

  return (
    <View>
      <View style={styles.metaRow}>
        <Text style={styles.settingTitle}>Meta Diária de Hidratação</Text>
        <Text style={styles.metaValue}>{value.toFixed(1)}L</Text>
      </View>
      <View
        style={styles.sliderTrack}
        onLayout={(e) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.sliderFill, { width: `${percent}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percent - 1.5}%` }]} />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>1.0 LITRO</Text>
        <Text style={styles.sliderLabel}>5.0 LITROS</Text>
      </View>
    </View>
  );
};

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
  const [metaDiaria, setMetaDiaria] = useState(3.5);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>ATLETA</Text>

        <TouchableOpacity
          style={styles.headerAvatar}
          activeOpacity={0.7}
          onPress={() => router.push("/perfil")}
        >
          <Text style={styles.headerAvatarText}>GM</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        {/* Avatar + Nome centralizados */}
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
          <HydrationSlider
            value={metaDiaria}
            onChange={setMetaDiaria}
            onDragging={(dragging) => setScrollEnabled(!dragging)}
            min={1}
            max={5}
          />
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
