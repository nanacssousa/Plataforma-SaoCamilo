// src/components/HomeComponents.tsx
// Componentes isolados da tela principal (index.tsx)

import React, { useEffect, useRef } from "react";
import {
    Animated,
    View
} from "react-native";
import { colors } from "../constants/theme";

// ─── Hook: animação de entrada (fade + slide up) ────────────────────────────────
export function useFadeInUp(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Barra de progresso animada ─────────────────────────────────────────────────
export function AnimatedProgressBar({
  percent,
  color,
  delay = 0,
}: {
  percent: number;
  color: string;
  delay?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: percent / 100,
      duration: 1500,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);
  return (
    <View
      style={{
        height: 10,
        backgroundColor: colors.outlineVariant,
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 8,
      }}
    >
      <Animated.View
        style={{
          height: "100%",
          borderRadius: 10,
          backgroundColor: color,
          width: anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
}

// ─── Mini gráfico de barras ─────────────────────────────────────────────────────
export function MiniChart() {
  const values = [30, 45, 25, 60, 40, 80, 55, 90, 70, 98];
  const anims = useRef(values.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      50,
      values.map((_, i) =>
        Animated.timing(anims[i], {
          toValue: 1,
          duration: 900,
          delay: 300,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, []);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        height: 56,
        gap: 3,
      }}
    >
      {values.map((v, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: "100%",
            backgroundColor: `${colors.primary}15`,
            borderRadius: 3,
            overflow: "hidden",
            justifyContent: "flex-end",
          }}
        >
          <Animated.View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 3,
              height: anims[i].interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", `${v}%`],
              }),
            }}
          />
        </View>
      ))}
    </View>
  );
}

// ─── Navegação inferior ─────────────────────────────────────────────────────────
