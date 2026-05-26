// src/components/LoginComponents.tsx
// Componentes isolados da tela de login

import React, { useRef, useState } from "react";
import {
    Animated,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../constants/theme";
import { loginStyles } from "../styles/LoginStyle";

// ─── Campo de texto com animação de foco ─────────────────────────────────────
export function CampoLogin({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  erro,
  autoCapitalize = "none",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  erro?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  const [focado, setFocado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);
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
  const isSenha = secureTextEntry;

  const containerStyle = [
    loginStyles.inputContainer,
    focado && loginStyles.inputContainerFocused,
    erro && loginStyles.inputContainerError,
    preenchido && !focado && loginStyles.inputContainerFilled,
  ];

  return (
    <View style={loginStyles.inputGroup}>
      <Text style={loginStyles.label}>{label}</Text>

      <View style={containerStyle}>
        <TextInput
          style={loginStyles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSenha && !senhaVisivel}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {isSenha && (
          <TouchableOpacity
            onPress={() => setSenhaVisivel((v) => !v)}
            style={loginStyles.olhoBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={loginStyles.olhoIcon}>
              {senhaVisivel ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {erro ? <Text style={loginStyles.labelError}>{erro}</Text> : null}
    </View>
  );
}

// ─── Botão principal ──────────────────────────────────────────────────────────
export function BotaoLogin({
  label,
  onPress,
  disabled = false,
  carregando = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  carregando?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        loginStyles.btnPrimary,
        (disabled || carregando) && loginStyles.btnPrimaryDisabled,
      ]}
      activeOpacity={disabled || carregando ? 1 : 0.85}
      onPress={disabled || carregando ? undefined : onPress}
    >
      <Text
        style={[
          loginStyles.btnPrimaryText,
          (disabled || carregando) && loginStyles.btnPrimaryTextDisabled,
        ]}
      >
        {carregando ? "AUTENTICANDO..." : label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Divisor com texto ────────────────────────────────────────────────────────
export function Divisor({ texto = "OU" }: { texto?: string }) {
  return (
    <View style={loginStyles.divisorRow}>
      <View style={loginStyles.divisorLinha} />
      <Text style={loginStyles.divisorTexto}>{texto}</Text>
      <View style={loginStyles.divisorLinha} />
    </View>
  );
}

// ─── Card de info / aviso ─────────────────────────────────────────────────────
export function InfoCard({
  icone,
  titulo,
  descricao,
}: {
  icone: string;
  titulo: string;
  descricao: string;
}) {
  return (
    <View style={loginStyles.infoCard}>
      <Text style={loginStyles.infoIcon}>{icone}</Text>
      <View style={loginStyles.infoTextContainer}>
        <Text style={loginStyles.infoTitle}>{titulo}</Text>
        <Text style={loginStyles.infoDesc}>{descricao}</Text>
      </View>
    </View>
  );
}