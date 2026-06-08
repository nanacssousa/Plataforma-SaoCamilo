// app/index.tsx
// Tela principal — Clinical Athlete
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AnimatedProgressBar,
  MiniChart,
  useFadeInUp
} from "../src/components/Homecomponents";
import { colors } from "../src/constants/theme";
import { styles } from "../src/styles/Homestyle";

const { width: W } = Dimensions.get("window");

export default function HomeScreen() {
  const [activeNav, setActiveNav] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tag = useFadeInUp(0);
  const title = useFadeInUp(150);
  const cta = useFadeInUp(300);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header com blur */}
      <BlurView
        intensity={70}
        tint="light"
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLogo}>
            <Ionicons
              name="medkit-outline"
              size={20}
              color={colors.primaryContainer}
            />
            <Text style={styles.headerBrand}>PLATAFORMA ATLETA</Text>
          </View>
          
        </View>
      </BlurView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Hero ── */}
        <ImageBackground
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrGYg3QwmXXOj678D3LTOzvX7h7weIR1fRI7Cn9WT5-kEKjhI5IHPCq-bVron2gxeqh6nCJhKbW1Pxh90PthzzaM6L8l5hDZheNGoBJYHTMr7o01eGpqug8NVslG_yTxIIVBYHvDPdJys0236QSo1VJz6ciD4Iz_qfgTtQ-_CCIOZ13VgmpY1La-9Jl_KqEQMpCxTKs4b58BBO0Aw7-jl4xFub70vT0r556wQ7g7r2iOP7ZdyDcztV0nliZfAHd4MxiZJnJblWa65P",
          }}
          style={styles.hero}
          imageStyle={{ opacity: 0.38 }}
        >
          <View style={StyleSheet.absoluteFillObject} />
          <View style={styles.heroContent}>
            <Animated.Text style={[styles.heroTitle, title]}>
              Potencialize sua{"\n"}
              <Text style={styles.heroTitleLight}>Performance{"\n"}</Text>
              com Precisão Hídrica
            </Animated.Text>
            <Animated.View style={[styles.heroActions, cta]}>
              <TouchableOpacity
                style={styles.heroPrimaryBtn}
                activeOpacity={0.85}
                onPress={() => router.push("/telaCadastro")}
              >
                <Text style={styles.heroPrimaryBtnText}>Começar Agora</Text>
              </TouchableOpacity>
              <View style={styles.heroMeta}>
                <Ionicons
                  name="flask-outline"
                  size={15}
                  color={colors.secondary}
                />
                <Text style={styles.heroMetaText}>
                  {" "}
                  Baseado em dados fisiológicos reais
                </Text>
              </View>
            </Animated.View>
          </View>
        </ImageBackground>

        {/* ── Benefícios ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            A Ciência por trás da Hidratação 
          </Text>
          <Text style={styles.sectionSub}>
            SCAM - Elite não é sobre beber água. É sobre o equilíbrio exato entre
            eletrólitos, volume e tempo metabólico.
          </Text>

          {/* Card branco — Monitoramento */}
          <View style={styles.cardWhite}>
            <View style={styles.cardTopRow}>
              <View style={styles.cardIconWrap}>
                <Ionicons name="pulse" size={26} color={colors.primary} />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Tempo Real</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Monitoramento Preditivo</Text>
            <Text style={styles.cardBody}>
              Antecipe a fadiga muscular através da análise de bioimpedância e
              taxas de sudorese capturadas via wearable.
            </Text>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statNum}>22%</Text>
                <Text style={styles.statLabel}>Aumento de Resistência</Text>
              </View>
              <View>
                <Text style={[styles.statNum, { color: colors.secondary }]}>
                  15min
                </Text>
                <Text style={styles.statLabel}>Recuperação Acelerada</Text>
              </View>
            </View>
          </View>

          {/* Card azul — Precisão */}
          <View style={styles.cardBlue}>
            <Ionicons name="water" size={34} color={colors.white} />
            <Text style={styles.cardBlueTitle}>Precisão{"\n"}SCAM-Elite</Text>
            <Text style={styles.cardBlueBody}>
              Nossa metodologia proprietária calcula a densidade de minerais
              necessária para cada mililitro de ingestão baseado no seu IMC e
              intensidade de treino.
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.cardBlueLink}>Ver Metodologia →</Text>
            </TouchableOpacity>
          </View>

          {/* Card escuro — Lab */}
          <View style={styles.cardDark}>
            <Ionicons name="flask" size={26} color={colors.primaryContainer} />
            <Text style={styles.cardDarkTitle}>Laboratório de Performance</Text>
            <View style={styles.cardDarkPanel}>
              <Text style={styles.cardDarkLabel}>Status Analítico</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <View
                  style={{
                    flex: 1,
                    height: 6,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                  }}
                />
                <View
                  style={{
                    flex: 0.6,
                    height: 6,
                    backgroundColor: `${colors.primary}50`,
                    borderRadius: 4,
                  }}
                />
                <View
                  style={{
                    flex: 1.4,
                    height: 6,
                    backgroundColor: colors.secondary,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Card imagem com quote */}
          <ImageBackground
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR-i8ckUIUgoDJ9RqkoZhustltl8b3zk4NK6BCFwCaPv3hBQ6sHzXgUfMvrjiKMjjSvP5pMF5QUX4UrrKati1wTyjW24yTLXKCX0Eua7lOqdghJNnHi8hyZ14ujm0tIi0IPVMM-XJDBooBPZhD3yiTSzgsDsUTn9kZntdv5DJNYoZ3wR1LmHJly8IwKRg3ca_nljSwCKCriXCIW6B5d3VXRUQz9enYWNwyU92-8SIUhvxa0koAuA7A5TpE92368EpAwhnLLcKz_nQa",
            }}
            style={styles.quoteCard}
            imageStyle={{ borderRadius: 18 }}
          >
            <View
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: "rgba(0,0,0,0.48)", borderRadius: 18 },
              ]}
            />
            <Text style={styles.quoteText}>
              "A hidratação é a base invisível de todo recorde mundial."
            </Text>
          </ImageBackground>
        </View>

        {/* ── Interface de Precisão ── */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.dataHeaderBar}>
            <Text style={styles.dataTag}>Arquitetura de Dados</Text>
            <Text style={styles.dataTitle}>
              Interface de{"\n"}
              <Text style={styles.dataTitleLight}>Precisão</Text>
            </Text>
          </View>

          {[
            {
              id: "01",
              title: "Algoritmos de Carga",
              body: "Cruzamos seus dados de estresse e nutricionais para gerar o plano de hidratação do dia.",
            },
            {
              id: "02",
              title: "Micro-Metodologia",
              body: "Sugestões de ingestão fracionada de 150ml a cada 20 minutos durante treinos de alta intensidade.",
            },
          ].map((item) => (
            <View key={item.id} style={styles.dataItem}>
              <Text style={styles.dataNum}>{item.id}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dataItemTitle}>{item.title}</Text>
                <Text style={styles.dataItemBody}>{item.body}</Text>
              </View>
            </View>
          ))}

          {/* Painel de dados */}
          <View style={styles.dataPanel}>
            <Text style={styles.panelSmallLabel}>Frequência Cardíaca Alvo</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                gap: 8,
                marginTop: 4,
              }}
            >
              <Text style={styles.panelBpm}>164</Text>
              <Text style={styles.panelBpmUnit}>BPM</Text>
            </View>
            <View style={{ marginTop: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <View>
                  <Text style={styles.panelSmallLabel}>
                    Eficiência Hidratante
                  </Text>
                  <Text style={styles.panelEff}>98.2%</Text>
                </View>
                <MiniChart />
              </View>
              <AnimatedProgressBar
                percent={98.2}
                color={colors.primary}
                delay={400}
              />
            </View>
          </View>
        </View>

        {/* ── CTA ── */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>
            Pronto para o{"\n"}
            <Text style={styles.ctaTitleItalic}>próximo nível?</Text>
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/telaCadastro")}
          >
            <Text style={styles.ctaBtnText}>Começar Jornada Clínica</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>APP ATLETA</Text>
          <Text style={styles.footerCopy}>
            © 2026 APP PARA A PERFORMA ATLETA. TODOS OS DIREITOS RESERVADOS.
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 20,
              marginTop: 12,
            }}
          >

          </View>
        </View>
      </ScrollView>

      
    </View>
  );
}