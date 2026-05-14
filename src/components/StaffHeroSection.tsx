// src/components/StaffHeroSection.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/landingStaffStyle";

interface Props {
  onSolicitarDemo: () => void;
  onExplorar: () => void;
}

export default function StaffHeroSection({ onSolicitarDemo, onExplorar }: Props) {
  // Animações de entrada
  const tagAnim  = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const btnAnim  = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(tagAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(btnAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(cardAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const fadeUp = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  return (
    <>
      <View style={styles.hero}>
        {/* Tag pill */}
        <Animated.View style={[styles.heroTag, fadeUp(tagAnim)]}>
          <Text style={styles.heroTagText}>✦ PLATAFORMA CLÍNICA DE ALTO RENDIMENTO</Text>
        </Animated.View>

        {/* Título */}
        <Animated.View style={fadeUp(textAnim)}>
          <Text style={styles.heroTitle}>
            Gestão Clínica{"\n"}
            <Text style={styles.heroTitleAccent}>Baseada em{"\n"}Dados</Text>
            {" "}para{"\n"}Elites.
          </Text>
          <Text style={styles.heroSubtitle}>
            Uma plataforma desenvolvida para treinadores, médicos e administradores
            que tomam decisões baseadas em evidências científicas e dados em tempo real.
          </Text>
        </Animated.View>

        {/* Botões */}
        <Animated.View style={[styles.heroBtnRow, fadeUp(btnAnim)]}>
          <TouchableOpacity style={styles.heroBtnPrimary} onPress={onSolicitarDemo} activeOpacity={0.85}>
            <Text style={styles.heroBtnPrimaryText}>SOLICITAR DEMONSTRAÇÃO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroBtnSecondary} onPress={onExplorar} activeOpacity={0.8}>
            <Text style={styles.heroBtnSecondaryText}>EXPLORAR TECNOLOGIA</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Live card */}
      <Animated.View style={[styles.liveCardWrapper, fadeUp(cardAnim)]}>
        <View style={styles.liveCard}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>LIVE PERFORMANCE</Text>
          </View>
          <Text style={styles.liveMetric}>94.2%</Text>
          <Text style={styles.liveDesc}>NÍVEL DE HIDRATAÇÃO ÓTIMO</Text>
        </View>
      </Animated.View>
    </>
  );
}