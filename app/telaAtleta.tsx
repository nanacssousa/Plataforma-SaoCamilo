// app/telaAtleta.tsx
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AlertaDesatualizado,
  HeroIniciarSessao,
  HighlightSudorese,
  ProximaHidratacao,
  StatusGrid,
} from "../src/components/Telaatletacomponents";
import { styles } from "../src/styles/atletaStyle";

export default function TelaAtleta() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>ATLETA</Text>
        <TouchableOpacity
          style={styles.headerAvatar}
          onPress={() => router.push("/perfil")}
        >
          <Text style={styles.headerAvatarText}>GM</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AlertaDesatualizado mensagem="Sua última medição foi há 48 horas. Registre novos dados para manter a precisão do seu perfil fisiológico." />

        <HeroIniciarSessao />

        <StatusGrid hidratacao={84} sudorese="1,2" ultimaSessao="12 Out" />

        <HighlightSudorese
          titulo="Sessão de Alta Intensidade"
          valor="1,2"
          unidade="L/H"
        />

        <ProximaHidratacao tempo="15 min" volume="350ml" />
      </ScrollView>
    </SafeAreaView>
  );
}
