import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "@/styles/PosSessaoStyle";
import { colors } from "@/constants/theme";

// ─── Types ────────────────────────────────────────────────────────────────────
type Sintoma = "caibras" | "tontura" | "fadiga";

// ─── Urine Colors ─────────────────────────────────────────────────────────────
const URINE_COLORS = [
  "#FFFFFF",
  "#FFF9C4",
  "#FFF176",
  "#FFD54F",
  "#FFB300",
  "#FB8C00",
];

// ─── Symptoms ─────────────────────────────────────────────────────────────────
const SYMPTOMS = [
  { key: "caibras" as Sintoma, icon: "⚡", label: "Câibras" },
  { key: "tontura" as Sintoma, icon: "🧍", label: "Tontura" },
  { key: "fadiga" as Sintoma, icon: "🔋", label: "Fadiga" },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PosSessaoScreen() {
  const [peso, setPeso] = useState("");
  const [urineSelecionada, setUrineSelecionada] = useState(2);
  const [sintomas, setSintomas] = useState<Sintoma[]>([]);

  const toggleSintoma = (s: Sintoma) => {
    setSintomas((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerSettings}>⚙</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ATLETA</Text>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>GM</Text>
        </View>
      </View>

      {/* Progress Steps — segundo passo ativo */}
      <View style={styles.progressContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.progressStep, i <= 1 && styles.progressStepActive]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.sectionTitle}>Pós - Sessão</Text>
        <Text style={styles.sectionSubtitle}>
          Configure seus biomarcadores iniciais para precisão técnica.
        </Text>

        {/* Peso Final */}
        <Text style={styles.sectionLabel}>PESO FINAL</Text>
        <View style={styles.weightInputContainer}>
          <TextInput
            style={styles.weightInput}
            placeholder="00,00"
            placeholderTextColor={colors.outlineVariant}
            keyboardType="decimal-pad"
            value={peso}
            onChangeText={setPeso}
          />
          <Text style={styles.weightUnit}>KG</Text>
        </View>
        <Text style={styles.weightHint}>
          Pesar-se com o mínimo de roupa e bexiga vazia.
        </Text>

        {/* Coloração da Urina */}
        <Text style={styles.sectionLabel}>COLORAÇÃO DA URINA</Text>
        <View style={styles.urineContainer}>
          <View style={styles.urineRow}>
            {URINE_COLORS.map((cor, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.urineOption,
                  { backgroundColor: cor },
                  i === 0 && {
                    borderColor: colors.outlineVariant,
                    borderWidth: 1,
                  },
                  urineSelecionada === i && styles.urineOptionSelected,
                ]}
                onPress={() => setUrineSelecionada(i)}
                activeOpacity={0.8}
              />
            ))}
          </View>
          <View style={styles.urineLabels}>
            <Text style={styles.urineLabel}>EXCELENTE</Text>
            <Text style={styles.urineLabel}>CRÍTICO</Text>
          </View>
        </View>

        {/* Escala de Sintomas */}
        <View style={styles.symptomsHeader}>
          <Text style={styles.symptomsTitle}>ESCALA DE SINTOMAS</Text>
          <Text style={styles.symptomsBadge}>MÚLTIPLA ESCOLHA</Text>
        </View>
        <View style={styles.symptomsGrid}>
          {SYMPTOMS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[
                styles.symptomCard,
                sintomas.includes(s.key) && styles.symptomCardActive,
              ]}
              onPress={() => toggleSintoma(s.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.symptomIcon}>{s.icon}</Text>
              <Text
                style={[
                  styles.symptomLabel,
                  sintomas.includes(s.key) && styles.symptomLabelActive,
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* CTA Button */}
      <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
        <Text style={styles.ctaButtonText}>PRÓXIMA SESSÃO</Text>
        <Text style={styles.ctaArrow}>→</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
