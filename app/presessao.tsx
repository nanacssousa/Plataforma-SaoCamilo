// app/presessao.tsx
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/constants/theme";
import { styles } from "@/styles/PreSessaoStyle";

type TipoTreino = "alta" | "resistencia" | "forca" | "recuperacao";
type Sintoma = "caibras" | "tontura" | "fadiga";

const URINE_COLORS = [
  "#FFFFFF",
  "#FFF9C4",
  "#FFF176",
  "#FFD54F",
  "#FFB300",
  "#FB8C00",
];

const TRAINING_TYPES = [
  { key: "alta" as TipoTreino, icon: "⚡", label: "Alta Intensidade" },
  { key: "resistencia" as TipoTreino, icon: "⏱", label: "Resistência" },
  { key: "forca" as TipoTreino, icon: "🏋", label: "Força/Hipertrofia" },
  { key: "recuperacao" as TipoTreino, icon: "🚶", label: "Recuperação" },
];

const SYMPTOMS = [
  { key: "caibras" as Sintoma, icon: "⚡", label: "Câibras" },
  { key: "tontura" as Sintoma, icon: "🧍", label: "Tontura" },
  { key: "fadiga" as Sintoma, icon: "🔋", label: "Fadiga" },
];

const ThirstSlider = ({
  value,
  onChange,
  onDragging,
}: {
  value: number;
  onChange: (v: number) => void;
  onDragging: (v: boolean) => void;
}) => {
  const trackWidth = useRef(0);
  const min = 1;
  const max = 10;
  const percent = ((value - min) / (max - min)) * 100;

  const calcValue = (locationX: number) => {
    const ratio = Math.min(Math.max(locationX / trackWidth.current, 0), 1);
    return Math.round(ratio * (max - min) + min);
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
      onPanResponderRelease: () => onDragging(false),
      onPanResponderTerminate: () => onDragging(false),
    }),
  ).current;

  return (
    <>
      <View style={styles.symptomsHeader}>
        <View style={styles.thirstLabelRow}>
          <Text style={styles.thirstIcon}>💧</Text>
          <Text style={styles.thirstTitle}>NÍVEL DE SEDE</Text>
        </View>
        <Text style={styles.thirstValue}>{value}</Text>
      </View>
      <View
        style={styles.sliderTrack}
        onLayout={(e) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.sliderFill, { width: `${percent}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percent - 2}%` }]} />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>NULA</Text>
        <Text style={styles.sliderLabel}>MODERADA</Text>
        <Text style={styles.sliderLabel}>EXTREMA</Text>
      </View>
    </>
  );
};

export default function PreSessaoScreen() {
  const router = useRouter();

  const [peso, setPeso] = useState("");
  const [tipoTreino, setTipoTreino] = useState<TipoTreino>("alta");
  const [urineSelecionada, setUrineSelecionada] = useState(2);
  const [nivelSede, setNivelSede] = useState(7);
  const [sintomas, setSintomas] = useState<Sintoma[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const toggleSintoma = (s: Sintoma) => {
    setSintomas((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const handlePesoChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.,]/g, "");
    const separadores = (cleaned.match(/[.,]/g) || []).length;
    if (separadores > 1) return;
    const parts = cleaned.split(/[.,]/);
    if (parts.length > 1 && parts[1].length > 2) return;
    setPeso(cleaned);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>ATLETA</Text>
        {/* Avatar → navega para perfil */}
        <TouchableOpacity
          style={styles.headerAvatar}
          activeOpacity={0.7}
          onPress={() => router.push("/perfil")}
        >
          <Text style={styles.headerAvatarText}>GM</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.progressStep, i === 0 && styles.progressStepActive]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <Text style={styles.sectionTitle}>Pré-Sessão</Text>
        <Text style={styles.sectionSubtitle}>
          Configure seus biomarcadores iniciais para precisão técnica.
        </Text>

        <Text style={styles.sectionLabel}>PESO INICIAL</Text>
        <View style={styles.weightInputContainer}>
          <TextInput
            style={styles.weightInput}
            placeholder="00,00"
            placeholderTextColor={colors.outlineVariant}
            keyboardType="decimal-pad"
            value={peso}
            onChangeText={handlePesoChange}
          />
          <Text style={styles.weightUnit}>KG</Text>
        </View>
        <Text style={styles.weightHint}>
          Pesar-se com o mínimo de roupa e bexiga vazia.
        </Text>

        <Text style={styles.sectionLabel}>TIPO DE TREINO</Text>
        <View style={styles.trainingGrid}>
          {TRAINING_TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[
                styles.trainingCard,
                tipoTreino === t.key && styles.trainingCardActive,
              ]}
              onPress={() => setTipoTreino(t.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.trainingIcon}>{t.icon}</Text>
              <Text
                style={[
                  styles.trainingLabel,
                  tipoTreino === t.key && styles.trainingLabelActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>COLORAÇÃO DA URINA</Text>
        <View style={styles.urineContainer}>
          <View style={styles.urineRow}>
            {URINE_COLORS.map((cor, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.urineOption,
                  { backgroundColor: cor },
                  urineSelecionada === i && styles.urineOptionSelected,
                  i === 0 && {
                    borderColor: colors.outlineVariant,
                    borderWidth: 1,
                  },
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

        <ThirstSlider
          value={nivelSede}
          onChange={setNivelSede}
          onDragging={(dragging) => setScrollEnabled(!dragging)}
        />

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

      <TouchableOpacity
        style={styles.ctaButton}
        activeOpacity={0.85}
        onPress={() => router.push("/telaDuranteTreino")}
      >
        <Text style={styles.ctaButtonText}>PRÓXIMA SESSÃO</Text>
        <Text style={styles.ctaArrow}>→</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
