// src/components/CadastroAtletaComponents.tsx
// Componentes isolados da tela de cadastro do atleta

import { colors } from "@/constants/theme";
import { styles } from "@/styles/cadastroAtletaStyle";
import React, { useRef, useState } from "react";
import {
    Animated,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ─── Tipos ─────────────────────────────────────────────────────────────────────
export interface ModalidadeOption {
  key: string;
  label: string;
  icon: string;
}

// ─── Modalidades disponíveis ───────────────────────────────────────────────────
export const MODALIDADES: ModalidadeOption[] = [
  { key: "futebol", label: "Futebol", icon: "⚽" },
  { key: "basquete", label: "Basquete", icon: "🏀" },
  { key: "volei", label: "Vôlei", icon: "🏐" },
  { key: "natacao", label: "Natação", icon: "🏊" },
  { key: "atletismo", label: "Atletismo", icon: "🏃" },
  { key: "ciclismo", label: "Ciclismo", icon: "🚴" },
  { key: "tenis", label: "Tênis", icon: "🎾" },
  { key: "musculacao", label: "Musculação", icon: "🏋️" },
  { key: "artes_marciais", label: "Artes Marciais", icon: "🥋" },
  { key: "outro", label: "Outro", icon: "🏅" },
];

// ─── Campo de texto com estados visuais ───────────────────────────────────────
export function CampoTexto({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  erro,
  suffix,
  obrigatorio = true,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  erro?: string;
  suffix?: string;
  obrigatorio?: boolean;
}) {
  const [focado, setFocado] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocado(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const onBlur = () => {
    setFocado(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const preenchido = value.length > 0 && !erro;
  const inputStyle = [
    suffix ? null : styles.input,
    focado && (suffix ? null : styles.inputFocused),
    erro && (suffix ? null : styles.inputError),
    preenchido && !focado && (suffix ? null : styles.inputFilled),
  ];

  const suffixContainerStyle = [
    styles.inputWithSuffix,
    focado && styles.inputWithSuffixFocused,
    erro && styles.inputWithSuffixError,
    preenchido && !focado && styles.inputWithSuffixFilled,
  ];

  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {obrigatorio && <Text style={styles.labelRequired}>*</Text>}
      </View>

      {suffix ? (
        <View style={suffixContainerStyle}>
          <TextInput
            style={styles.inputNoBg}
            placeholder={placeholder}
            placeholderTextColor={colors.onSurfaceVariant}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <Text style={styles.suffix}>{suffix}</Text>
        </View>
      ) : (
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      )}

      {erro ? <Text style={styles.labelError}>{erro}</Text> : null}
    </View>
  );
}

// ─── Dropdown de modalidades ──────────────────────────────────────────────────
export function DropdownModalidade({
  value,
  onChange,
  erro,
}: {
  value: string;
  onChange: (v: string) => void;
  erro?: string;
}) {
  const [aberto, setAberto] = useState(false);

  const selecionada = MODALIDADES.find((m) => m.key === value);

  const selectStyle = [
    styles.selectInput,
    aberto && styles.selectInputOpen,
    value && !aberto && styles.selectInputFilled,
  ];

  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Esporte / Modalidade</Text>
        <Text style={styles.labelRequired}>*</Text>
      </View>

      <TouchableOpacity
        style={selectStyle}
        activeOpacity={0.8}
        onPress={() => setAberto((v) => !v)}
      >
        <Text style={selecionada ? styles.selectText : styles.selectPlaceholder}>
          {selecionada
            ? `${selecionada.icon}  ${selecionada.label}`
            : "Selecione a modalidade"}
        </Text>
        <Text style={styles.selectChevron}>{aberto ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {aberto && (
        <View style={styles.dropdownList}>
          {MODALIDADES.map((item, idx) => {
            const isSelected = item.key === value;
            const isLast = idx === MODALIDADES.length - 1;
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.dropdownItem,
                  isLast && styles.dropdownItemLast,
                  isSelected && styles.dropdownItemSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  onChange(item.key);
                  setAberto(false);
                }}
              >
                <Text style={styles.dropdownItemIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.dropdownItemText,
                    isSelected && styles.dropdownItemTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected && (
                  <Text style={styles.dropdownCheck}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {erro ? <Text style={styles.labelError}>{erro}</Text> : null}
    </View>
  );
}

// ─── Botão principal com estado disabled ─────────────────────────────────────
export function BotaoPrimario({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.btnPrimary, disabled && styles.btnPrimaryDisabled]}
      activeOpacity={disabled ? 1 : 0.85}
      onPress={disabled ? undefined : onPress}
    >
      <Text
        style={[
          styles.btnPrimaryText,
          disabled && styles.btnPrimaryTextDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}