import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../src/styles/duranteTreinoStyle";

export default function TelaDuranteTreino() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar ajustada */}
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>ATLETA</Text>
        <View style={styles.avatarMini}>
          <Text style={{ color: "#fff", fontSize: 10 }}>IMG</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Timer Card */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>DURAÇÃO TOTAL</Text>
          <Text style={styles.timerValue}>01:42:15</Text>
          <Text style={styles.statusActive}>⚡ ATIVO</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>INGESTÃO TOTAL</Text>
            <Text style={styles.statValue}>
              1,2<Text style={styles.statUnit}> L</Text>
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>META RESTANTE</Text>
            <Text style={styles.statValue}>
              800<Text style={styles.statUnit}> ML</Text>
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>REGISTRO RÁPIDO DE ÁGUA</Text>
        <View style={styles.quickLogGrid}>
          <TouchableOpacity style={styles.quickLogBtnLight}>
            <Text style={styles.quickLogIcon}>🥛</Text>
            <Text style={styles.quickLogValueDark}>+200ml</Text>
            <Text style={styles.quickLogDescDark}>COPO MÉDIO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLogBtnDark}>
            <Text style={styles.quickLogIcon}>🍼</Text>
            <Text style={styles.quickLogValueLight}>+500ml</Text>
            <Text style={styles.quickLogDescLight}>GARRAFA PADRÃO</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.customLogBtn}>
          <Text style={styles.customLogText}>⊕ VALOR PERSONALIZADO</Text>
        </TouchableOpacity>

        <View style={styles.logHeader}>
          <Text style={styles.sectionTitle}>LOG DA SESSÃO</Text>
          <Text style={styles.logCount}>3 ENTRADAS</Text>
        </View>

        <View style={styles.logItem}>
          <View style={styles.logIconWrapperRed}><Text>💧</Text></View>
          <View style={styles.logTextWrapper}>
            <Text style={styles.logItemTitle}>500ml Ingeridos</Text>
            <Text style={styles.logItemSub}>11:45 • HIDRATAÇÃO PADRÃO</Text>
          </View>
          <Text style={styles.logOptions}>⋮</Text>
        </View>

        <View style={styles.logItem}>
          <View style={styles.logIconWrapperRed}><Text>💧</Text></View>
          <View style={styles.logTextWrapper}>
            <Text style={styles.logItemTitle}>200ml Ingeridos</Text>
            <Text style={styles.logItemSub}>11:20 • INGESTÃO RÁPIDA</Text>
          </View>
          <Text style={styles.logOptions}>⋮</Text>
        </View>

        <TouchableOpacity style={styles.endSessionBtn}>
          <Text style={styles.endSessionText}>PRÓXIMA SESSÃO →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
