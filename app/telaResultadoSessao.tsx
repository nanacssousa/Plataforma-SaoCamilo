import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { styles } from "../src/styles/resultadoSessaoStyle";

export default function TelaResultadoSessao() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar sem ícone de configuração */}
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>ATLETA</Text>
        <View style={styles.avatarMini}>
          <Text style={{ color: "#fff", fontSize: 10 }}>IMG</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>RESUMO DE PERFORMANCE</Text>
        <Text style={styles.pageTitle}>Análise de Hidratação Individualizada</Text>
        <Text style={styles.pageDate}>📅 14 Fev, 2026   🕒 08:30 - 09:45</Text>

        {/* Taxa de Sudorese */}
        <View style={styles.cardLight}>
          <Text style={styles.cardLabel}>TAXA DE SUDORESE</Text>
          <View style={styles.rowAlign}>
            <Text style={styles.mainValue}>
              1,80<Text style={styles.unitText}> L/h</Text>
            </Text>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>⚠️ ZONA CRÍTICA</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Sua perda de líquidos excedeu a taxa de absorção recomendada para sua massa.
          </Text>
          {/* Mock Progress Bar */}
          <View style={styles.zonesBarRow}>
            <Text style={styles.zoneText}>SEGURA</Text>
            <Text style={styles.zoneText}>MODERADA</Text>
            <Text style={styles.zoneText}>CRÍTICA</Text>
          </View>
          <View style={styles.zoneColors}>
            <View style={[styles.zoneBox, { backgroundColor: "#7DB4FF" }]} />
            <View style={[styles.zoneBox, { backgroundColor: "#B0BEC5" }]} />
            <View style={[styles.zoneBox, { backgroundColor: "#D32F2F" }]} />
          </View>
        </View>

        {/* Déficit de Massa */}
        <View style={styles.cardWarm}>
          <View style={styles.rowBetween}>
            <Text style={styles.iconRed}>💧</Text>
            <View style={styles.badgeGray}>
              <Text style={styles.badgeGrayText}>ALERTA</Text>
            </View>
          </View>
          <Text style={styles.mainValue}>2,40%</Text>
          <Text style={styles.cardLabel}>DÉFICIT DE MASSA (%)</Text>
          <Text style={[styles.cardDesc, { marginTop: 12 }]}>
            Perda de massa corporal total. Acima de 2% compromete o desempenho cognitivo e motor.
          </Text>
        </View>

        {/* Recomendação de Reposição */}
        <View style={styles.cardDarkRed}>
          <Text style={styles.darkTitle}>Recomendação de Reposição</Text>
          <Text style={styles.darkDesc}>
            Para otimizar sua recuperação pós-treino, consuma 150% do peso perdido nas próximas 4 horas.
          </Text>
          <View style={styles.darkHighlightBox}>
            <Text style={styles.darkHighlightLabel}>VOLUME ALVO</Text>
            <Text style={styles.darkHighlightValue}>
              1,8<Text style={styles.darkHighlightUnit}> LITROS</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
