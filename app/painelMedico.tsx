// app/painelMedico.tsx
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
import { colors, fontFamilies, spacing } from "../src/constants/theme";

function PainelMedicoConteudo() {
  const { state } = useAppStore();
  const primeiroNome = (state.perfil?.nome ?? "Médico").split(" ")[0];

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertas, setAlertas] = useState<any[]>([]);

  const carregar = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await apiFetch<any[]>("/alertas");
      setAlertas(Array.isArray(data) ? data : []);
    } catch {
      setAlertas([]);
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
        <StaffSidebar role="medico" activeNav="painel" />

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
              {" "}{TITULO_PAINEL.medico}
            </Text>
            <Text style={{ fontFamily: fontFamilies.bodyBold, fontSize: 13, color: colors.onSurfaceVariant }}>
              {primeiroNome}
            </Text>
          </View>

          {/* Título */}
          <View style={{ marginBottom: spacing.s6 }}>
            <Text style={{ fontFamily: fontFamilies.headlineBold, fontSize: 26, color: colors.onSurface, marginBottom: spacing.s2 }}>
              {TITULO_PAINEL.medico}
            </Text>
            <Text style={{ fontFamily: fontFamilies.body, fontSize: 14, color: colors.onSurfaceVariant, lineHeight: 20 }}>
              Monitore biomarcadores, alertas clínicos e o estado hídrico dos atletas
              com precisão laboratorial.
            </Text>
          </View>

          {/* Cards de acesso rápido */}
          <View style={{ flexDirection: "row", gap: spacing.s3, marginBottom: spacing.s4 }}>
            <TouchableOpacity
              style={[styles.card, { flex: 1 }]}
              activeOpacity={0.8}
              onPress={() => router.push("/biomarcadores" as any)}
            >
              <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 10, color: colors.gray400, letterSpacing: 0.8, marginBottom: spacing.s2 }}>
                DADOS MÉDICOS
              </Text>
              <Text style={styles.cardTitulo}>Biomarcadores</Text>
              <Text style={{ fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 18, marginTop: spacing.s2 }}>
                USG, marcadores laboratoriais, taxa de sudorese e análise clínica por atleta.
              </Text>
              <Text style={{ color: colors.primary, fontFamily: fontFamilies.technicalBold, fontSize: 12, marginTop: spacing.s3 }}>
                VER BIOMARCADORES →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { flex: 1 }]}
              activeOpacity={0.8}
              onPress={() => router.push("/painelnutricionista" as any)}
            >
              <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 10, color: colors.gray400, letterSpacing: 0.8, marginBottom: spacing.s2 }}>
                GESTÃO HÍDRICA
              </Text>
              <Text style={styles.cardTitulo}>Hidratação</Text>
              <Text style={{ fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 18, marginTop: spacing.s2 }}>
                Acompanhe o status hídrico da equipe, balanço de fluidos e recomendações individuais.
              </Text>
              <Text style={{ color: colors.primary, fontFamily: fontFamilies.technicalBold, fontSize: 12, marginTop: spacing.s3 }}>
                VER HIDRATAÇÃO →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Alertas clínicos */}
          <View style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.s4 }}>
              <View>
                <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 10, color: colors.gray400, letterSpacing: 0.8, marginBottom: spacing.s1 }}>
                  MONITORAMENTO
                </Text>
                <Text style={styles.cardTitulo}>Alertas Clínicos</Text>
              </View>
              {!loading && (
                <Text style={{ fontFamily: fontFamilies.headlineBold, fontSize: 28, color: colors.primary }}>
                  {alertas.length}
                </Text>
              )}
            </View>

            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.s6 }} />
            ) : alertas.length === 0 ? (
              <Text style={{ fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant, paddingVertical: spacing.s4 }}>
                Nenhum alerta ativo no momento.
              </Text>
            ) : (
              alertas.slice(0, 5).map((alerta: any, i: number) => (
                <View
                  key={alerta.id_alerta ?? i}
                  style={[
                    styles.atletaRow,
                    i < Math.min(alertas.length, 5) - 1 && styles.atletaRowBorder,
                  ]}
                >
                  <View style={[styles.avatar, { backgroundColor: colors.primaryTint }]}>
                    <Text style={{ fontSize: 16 }}>⚠️</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.atletaNome}>{alerta.tipo_alerta ?? "Alerta"}</Text>
                    <Text style={styles.atletaDetalhe}>{alerta.descricao ?? "—"}</Text>
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

export default function PainelMedico() {
  return (
    <StaffGuard rotaAtual="/painelMedico">
      <PainelMedicoConteudo />
    </StaffGuard>
  );
}
