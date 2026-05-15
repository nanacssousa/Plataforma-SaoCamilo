// src/app/TelaCadastroAtleta.tsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../src/constants/theme";
import { styles } from "../src/styles/cadastroAtletaStyle";

export default function TelaCadastroAtleta() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header — padrão pós-sessão */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ATLETA</Text>
        <TouchableOpacity style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>GM</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tag / Title / Subtitle */}
        <Text style={styles.tag}>PROTOCOLO DE REGISTRO</Text>
        <Text style={styles.title}>Cadastro de{"\n"}Atleta</Text>
        <Text style={styles.subtitle}>
          Inicie sua jornada de alto rendimento. O mapeamento biomecânico e fisiológico começa com a precisão dos seus dados base.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🔬</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>PRECISÃO LAB</Text>
              <Text style={styles.infoDesc}>
                Dados utilizados para cálculo de VO2 Max e Taxa Metabólica.
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>PRIVACIDADE</Text>
              <Text style={styles.infoDesc}>
                Criptografia de nível médico para proteção de métricas sensíveis.
              </Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME COMPLETO</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Julian Arredondo"
              placeholderTextColor={colors.onSurfaceVariant}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>IDADE</Text>
              <TextInput
                style={styles.input}
                placeholder="00"
                keyboardType="numeric"
                placeholderTextColor={colors.onSurfaceVariant}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>ALTURA (CM)</Text>
              <TextInput
                style={styles.input}
                placeholder="180"
                keyboardType="numeric"
                placeholderTextColor={colors.onSurfaceVariant}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PESO BASE (REFERÊNCIA)</Text>
            <View style={styles.inputWithSuffix}>
              <TextInput
                style={styles.inputNoBg}
                placeholder="72.5"
                keyboardType="numeric"
                placeholderTextColor={colors.onSurfaceVariant}
              />
              <Text style={styles.suffix}>KG</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ESPORTE / CATEGORIA</Text>
            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectText}>Selecione a modalidade</Text>
              <Text style={styles.selectIcon}>⌄</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>FINALIZAR REGISTRO →</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            AO PROSSEGUIR, VOCÊ CONCORDA COM NOSSOS{"\n"}PROTOCOLOS DE DADOS.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
