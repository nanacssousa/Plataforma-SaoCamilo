// app/telaDuranteTreino.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AclimatacaoChart } from "../src/components/duranteTreino/Aclimatacaochart";
import { ConfirmSessionModal } from "../src/components/duranteTreino/ConfirmSessionModal";
import { CustomWaterModal } from "../src/components/duranteTreino/CustomWaterModal";
import { HydrationCards } from "../src/components/duranteTreino/HydrationCards";
import { QuickAddButtons } from "../src/components/duranteTreino/QuickAddButtons";
import { SessionLog } from "../src/components/duranteTreino/SessionLog";
import { SessionTimer } from "../src/components/duranteTreino/SessionTimer";
import { colors, fontFamilies, radius, spacing } from "../src/constants/theme";
import { useDuranteTreino } from "../src/hooks/useDuranteTreino";
import { useAppStore } from "../src/store/useAppStore";

export default function TelaDuranteTreino() {
  const router = useRouter();
  const { adicionarFluido, state } = useAppStore();

  // ── passa se há sessão ativa — timer só corre após check-in ──────────────
  const temSessao = !!state.sessaoAtiva;

  const {
    seconds,
    total,
    log,
    goalReached,
    flash,
    showCustom,
    showConfirm,
    setShowCustom,
    setShowConfirm,
    handleQuickAdd: _handleQuickAdd,
    handleCustomAdd: _handleCustomAdd,
    handleNewSession,
  } = useDuranteTreino(temSessao);

  function handleQuickAdd(ml: number) {
    const tipos: Record<number, string> = { 200: "INGESTÃO RÁPIDA", 500: "HIDRATAÇÃO PADRÃO" };
    adicionarFluido(ml, tipos[ml] ?? "HIDRATAÇÃO");
    _handleQuickAdd(ml);
  }

  function handleCustomAdd(ml: number) {
    adicionarFluido(ml, "VALOR PERSONALIZADO");
    _handleCustomAdd(ml);
  }

  function handleProximaSessao() {
    router.push("/possessao");
  }

  return (
    <SafeAreaView style={styles.safe}>
      {flash && (
        <View style={styles.flashBanner} pointerEvents="none">
          <Text style={styles.flashText}>💧 Água adicionada!</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>TREINO ATIVO</Text>
            <Text style={styles.headerTitle}>
              {state.sessaoAtiva?.tipoTreino ?? "Hidratação"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnNextSession}
            onPress={() => setShowConfirm(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnNextSessionText}>PRÓXIMA SESSÃO →</Text>
          </TouchableOpacity>
        </View>

        <SessionTimer seconds={seconds} />
        <HydrationCards total={total} goalReached={goalReached} />
        <QuickAddButtons onAdd={handleQuickAdd} onCustom={() => setShowCustom(true)} />

        {/* ── Gráfico de Aclimatação / Análise Avançada ── */}
        <AclimatacaoChart />

        <SessionLog log={log} />
      </ScrollView>

      <CustomWaterModal
        visible={showCustom}
        onClose={() => setShowCustom(false)}
        onConfirm={handleCustomAdd}
      />

      <ConfirmSessionModal
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          handleNewSession();
          handleProximaSessao();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: "#fdf5f5" },
  scroll:  { flex: 1 },
  content: { padding: spacing.s5, paddingBottom: spacing.s8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.s5,
  },
  headerEyebrow: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 11,
    letterSpacing: 2,
    color: "#c09090",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 22,
    color: "#2c1a1a",
    lineHeight: 26,
  },
  btnNextSession: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  btnNextSessionText: {
    color: colors.white,
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  flashBanner: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    zIndex: 90,
    backgroundColor: "#a40000",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: "#a40000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  flashText: {
    color: colors.white,
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
  },
});