// app/painelTreinador.tsx
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StaffGuard from "../src/components/StaffGuard";
import StaffSidebar from "../src/components/StaffSidebar";
import { TITULO_PAINEL } from "../src/config/staffPermissions";
import { apiFetch } from "../src/services/apiService";
import { useAppStore } from "../src/store/useAppStore";
import { styles } from "../src/styles/PainelNutricionistaStyle";
import { colors, fontFamilies, radius, spacing } from "../src/constants/theme";

function PainelTreinadorConteudo() {
  const { state } = useAppStore();
  const primeiroNome = (state.perfil?.nome ?? "Treinador").split(" ")[0];

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [atletas, setAtletas] = useState<any[]>([]);

  const carregar = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await apiFetch<any[]>("/usuarios?id_perfil=1");
      setAtletas(Array.isArray(data) ? data : []);
    } catch {
      setAtletas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregar(true);
  }, [carregar]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.layout}>
        <StaffSidebar role="treinador" activeNav="painel" />

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerBreadcrumb}>
              Staff{" "}
              <Text style={styles.headerBreadcrumbSep}>/</Text>
              {" "}{TITULO_PAINEL.treinador}
            </Text>
            <Text style={{ fontFamily: fontFamilies.bodyBold, fontSize: 13, color: colors.onSurfaceVariant }}>
              {primeiroNome}
            </Text>
          </View>

          {/* Título */}
          <View style={{ marginBottom: spacing.s6 }}>
            <Text style={{ fontFamily: fontFamilies.headlineBold, fontSize: 26, color: colors.onSurface, marginBottom: spacing.s2 }}>
              {TITULO_PAINEL.treinador}
            </Text>
            <Text style={{ fontFamily: fontFamilies.body, fontSize: 14, color: colors.onSurfaceVariant, lineHeight: 20 }}>
              Gerencie sessões de treino, acompanhe a performance dos atletas e
              visualize o estado das equipes em tempo real.
            </Text>
          </View>

          {/* Cards de acesso rápido */}
          <View style={{ flexDirection: "row", gap: spacing.s3, marginBottom: spacing.s4 }}>
            <TouchableOpacity
              style={[styles.card, { flex: 1 }]}
              activeOpacity={0.8}
              onPress={() => router.push("/painelnutricionista" as any)}
            >
              <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 10, color: colors.gray400, letterSpacing: 0.8, marginBottom: spacing.s2 }}>
                ACESSO RÁPIDO
              </Text>
              <Text style={styles.cardTitulo}>{"Sessões de\nTreino"}</Text>
              <Text style={{ fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 18, marginTop: spacing.s2 }}>
                Visualize e gerencie sessões ativas, dados de hidratação e performance por atleta.
              </Text>
              <Text style={{ color: colors.primary, fontFamily: fontFamilies.technicalBold, fontSize: 12, marginTop: spacing.s3 }}>
                VER SESSÕES →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { flex: 1 }]}
              activeOpacity={0.8}
              onPress={() => router.push("/telaequipes" as any)}
            >
              <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 10, color: colors.gray400, letterSpacing: 0.8, marginBottom: spacing.s2 }}>
                ACESSO RÁPIDO
              </Text>
              <Text style={styles.cardTitulo}>Equipes</Text>
              <Text style={{ fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 18, marginTop: spacing.s2 }}>
                Visualize a composição das equipes, status hídrico por grupo e métricas coletivas.
              </Text>
              <Text style={{ color: colors.primary, fontFamily: fontFamilies.technicalBold, fontSize: 12, marginTop: spacing.s3 }}>
                VER EQUIPES →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Resumo de atletas */}
          <View style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.s4 }}>
              <View>
                <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 10, color: colors.gray400, letterSpacing: 0.8, marginBottom: spacing.s1 }}>
                  VISÃO GERAL
                </Text>
                <Text style={styles.cardTitulo}>Atletas Cadastrados</Text>
              </View>
              <Text style={{ fontFamily: fontFamilies.headlineBold, fontSize: 28, color: colors.primary }}>
                {loading ? "—" : atletas.length}
              </Text>
            </View>

            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.s6 }} />
            ) : atletas.length === 0 ? (
              <Text style={{ fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant, paddingVertical: spacing.s4 }}>
                Nenhum atleta encontrado.
              </Text>
            ) : (
              atletas.slice(0, 5).map((a: any, i: number) => (
                <View
                  key={a.id_usuario ?? i}
                  style={[
                    styles.atletaRow,
                    i < Math.min(atletas.length, 5) - 1 && styles.atletaRowBorder,
                  ]}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(a.nome_completo ?? "?").slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.atletaNome}>{a.nome_completo ?? "—"}</Text>
                    <Text style={styles.atletaDetalhe}>{a.email ?? "—"}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: spacing.s8 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function PainelTreinador() {
  return (
    <StaffGuard rotaAtual="/painelTreinador">
      <PainelTreinadorConteudo />
    </StaffGuard>
  );
}
