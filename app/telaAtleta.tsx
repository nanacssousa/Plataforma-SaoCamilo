import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../src/styles/atletaStyle";

export default function TelaAtleta() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topIcon}>⚙️</Text>
        <Text style={styles.topTitle}>ATLETA</Text>
        <View style={styles.avatarMini}><Text style={{color: '#fff', fontSize: 10}}>IMG</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Alerta */}
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ DADOS DESATUALIZADOS</Text>
          <Text style={styles.alertText}>Sua última medição foi há 48 horas. Registre novos dados para manter a precisão do seu perfil fisiológico.</Text>
        </View>

        {/* Hero Action */}
        <View style={styles.heroCard}>
          <Text style={styles.heroSub}>PRONTO PARA TREINAR?</Text>
          <Text style={styles.heroTitle}>Iniciar Nova Sessão</Text>
          <Text style={styles.heroText}>Inicie o monitoramento em tempo real para calcular sua taxa de sudorese hoje.</Text>
          <TouchableOpacity style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>COMEÇAR MONITORAMENTO</Text>
          </TouchableOpacity>
        </View>

        {/* Status Grid */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>STATUS ATUAL</Text>
            <Text style={styles.gridValueBigger}>84<Text style={styles.gridUnit}>%</Text></Text>
            <Text style={styles.gridDesc}>NÍVEL DE HIDRATAÇÃO</Text>
            <View style={styles.progressBar}><View style={[styles.progressFill, {width: '84%'}]} /></View>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>ÚLTIMA TAXA</Text>
            <Text style={styles.gridValue}>1,2<Text style={styles.gridUnit}> L/h</Text></Text>
            <Text style={styles.gridDesc}>SUDORESE REGISTRADA</Text>
            <Text style={styles.gridSubDesc}>Sessão: 12 Out</Text>
          </View>
        </View>

        {/* Highlight */}
        <View style={styles.highlightCard}>
          <Text style={styles.highlightSub}>ÚLTIMA TAXA DE SUDORESE</Text>
          <Text style={styles.highlightTitle}>Sessão de Alta Intensidade</Text>
          <Text style={styles.highlightValue}>1,2<Text style={styles.highlightUnit}> L/H</Text></Text>
        </View>

        {/* Precision Metric */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>PRÓXIMA HIDRATAÇÃO</Text>
          <Text style={styles.metricValue}>🕒 15 min</Text>
          <Text style={[styles.metricLabel, {marginTop: 12}]}>VOLUME ALVO</Text>
          <Text style={styles.metricTarget}>350ml</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}