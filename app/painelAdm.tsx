// app/painelAdm.tsx
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { styles } from "../src/styles/admSistemaStyle";
import { colors, fontFamilies, spacing } from "../src/constants/theme";

interface Profissional {
  id: string;
  nome: string;
  email: string;
  cargoLabel: string;
  cargoBg: string;
  cargoColor: string;
}

interface Equipe {
  id: string;
  nome: string;
  totalAtletas: number;
  categoria: string;
}

const CARGO_MAP: Record<number, { label: string; bg: string; color: string }> = {
  3: { label: "TREINADOR",    bg: colors.primaryTint,              color: colors.primary },
  4: { label: "MÉDICO",       bg: "#E8F0FB",                       color: colors.secondary },
  5: { label: "ADM",          bg: colors.surfaceContainerHighest,  color: colors.onSurfaceVariant },
};

function PainelAdmConteudo() {
  const { state } = useAppStore();
  const primeiroNome = (state.perfil?.nome ?? "Admin").split(" ")[0];

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);

  const carregar = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [profs, eqs] = await Promise.all([
        apiFetch<any[]>("/usuarios?id_perfil=3,4,5").catch(() => []),
        apiFetch<any[]>("/equipes").catch(() => []),
      ]);

      setProfissionais(
        (Array.isArray(profs) ? profs : []).map((p: any) => {
          const cargo = CARGO_MAP[p.id_perfil] ?? CARGO_MAP[5];
          return {
            id: String(p.id_usuario),
            nome: p.nome_completo ?? "—",
            email: p.email ?? "—",
            cargoLabel: cargo.label,
            cargoBg: cargo.bg,
            cargoColor: cargo.color,
          };
        })
      );

      setEquipes(
        (Array.isArray(eqs) ? eqs : []).map((e: any) => ({
          id: String(e.id_equipe),
          nome: e.nome_equipe ?? "—",
          totalAtletas: e.total_atletas ?? 0,
          categoria: e.categoria ?? "—",
        }))
      );
    } catch {
      setProfissionais([]);
      setEquipes([]);
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
        <StaffSidebar role="administrador" activeNav="painel" />

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
              <Text style={styles.headerSep}>/</Text>
              {" "}<Text style={styles.headerSecao}>{TITULO_PAINEL.administrador}</Text>
            </Text>
            <Text style={{ fontFamily: fontFamilies.bodyBold, fontSize: 13, color: colors.onSurfaceVariant }}>
              {primeiroNome}
            </Text>
          </View>

          {/* Título */}
          <View style={styles.secaoTitulo}>
            <Text style={styles.tituloPrincipal}>{TITULO_PAINEL.administrador}</Text>
            <Text style={styles.tituloDesc}>
              Orquestre equipes clínicas, gerencie permissões granulares e
              configure os parâmetros globais do laboratório.
            </Text>
          </View>

          <View style={styles.linhaMain}>
            {/* Tabela de profissionais */}
            <View style={[styles.card, styles.cardTabela]}>
              <View style={styles.cardTabelaHeader}>
                <View>
                  <Text style={styles.cardLabel}>STATUS OPERACIONAL</Text>
                  <Text style={styles.cardTitulo}>Profissionais Ativos</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push("/telaCadastroStaff" as any)}
                >
                  <Text style={styles.linkGerenciar}>+ ADICIONAR →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colProfissional]}>PROFISSIONAL</Text>
                <Text style={[styles.tableHeaderText, styles.colCargo]}>{"CARGO\nDESIGNADO"}</Text>
                <Text style={[styles.tableHeaderText, styles.colAcoes]}>AÇÕES</Text>
              </View>

              {loading ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.s6 }} />
              ) : profissionais.length === 0 ? (
                <Text style={{ fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant, padding: spacing.s4 }}>
                  Nenhum profissional cadastrado.
                </Text>
              ) : (
                profissionais.map((prof: Profissional, i: number) => (
                  <View
                    key={prof.id}
                    style={[
                      styles.profRow,
                      i < profissionais.length - 1 && styles.profRowBorder,
                    ]}
                  >
                    <View style={[styles.colProfissional, { flexDirection: "row", alignItems: "center" }]}>
                      <View style={styles.profAvatar}>
                        <Text style={{ fontFamily: fontFamilies.bodyBold, fontSize: 13, color: colors.onSurfaceVariant }}>
                          {prof.nome.slice(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.profInfo}>
                        <Text style={styles.profNome} numberOfLines={1}>{prof.nome}</Text>
                        <Text style={styles.profEmail} numberOfLines={1}>{prof.email}</Text>
                      </View>
                    </View>

                    <View style={styles.colCargo}>
                      <View style={[styles.badgeCargo, { backgroundColor: prof.cargoBg }]}>
                        <Text style={[styles.badgeCargoText, { color: prof.cargoColor }]}>
                          {prof.cargoLabel}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.acaoBtn}
                      onPress={() => Alert.alert("Ações", `Gerenciar ${prof.nome}`)}
                    >
                      <Text style={styles.acaoIcon}>···</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Matriz de equipes */}
            <View style={[styles.card, styles.cardMatriz]}>
              <Text style={styles.cardLabel}>ORGANIZAÇÃO</Text>
              <Text style={styles.cardTitulo}>{"Matriz de\nEquipes"}</Text>
              <Text style={styles.matrizDesc}>
                Agrupe atletas e equipe clínica em unidades de performance focadas.
              </Text>
              <TouchableOpacity style={{ marginTop: spacing.s2, marginBottom: spacing.s3 }} onPress={() => router.push("/telaequipes" as any)}>
                <Text style={{ color: colors.primary, fontFamily: fontFamilies.technicalBold, fontSize: 12 }}>
                  GERENCIAR EQUIPES →
                </Text>
              </TouchableOpacity>

              {loading ? (
                <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.s4 }} />
              ) : equipes.length === 0 ? (
                <Text style={{ fontFamily: fontFamilies.technical, fontSize: 13, color: colors.onSurfaceVariant, marginTop: spacing.s3 }}>
                  Nenhuma equipe cadastrada.
                </Text>
              ) : (
                <View style={styles.equipeList}>
                  {equipes.map((equipe: Equipe, i: number) => (
                    <View
                      key={equipe.id}
                      style={[styles.equipeItem, i < equipes.length - 1 && styles.equipeItemBorder]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.equipeNome}>{equipe.nome}</Text>
                        <Text style={styles.equipeAtletas}>{equipe.categoria}</Text>
                      </View>
                      <View style={styles.equipeRight}>
                        <Text style={{ fontFamily: fontFamilies.headlineBold, fontSize: 18, color: colors.primary }}>
                          {equipe.totalAtletas}
                        </Text>
                        <Text style={styles.equipeAtletas}>atletas</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Atalhos rápidos */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>GESTÃO AVANÇADA</Text>
            <Text style={styles.cardTitulo}>Acesso Rápido</Text>
            <View style={{ flexDirection: "row", gap: spacing.s3, marginTop: spacing.s4, flexWrap: "wrap" }}>
              {[
                { label: "Biomarcadores", rota: "/biomarcadores",       icon: "🩻" },
                { label: "Hidratação",    rota: "/painelnutricionista", icon: "💧" },
                { label: "Sessões",       rota: "/painelnutricionista", icon: "🏃" },
                { label: "Config.",       rota: "/admsistema",          icon: "⚙️" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={{
                    backgroundColor: colors.surfaceContainerLow,
                    borderRadius: 10,
                    padding: spacing.s3,
                    alignItems: "center",
                    minWidth: 72,
                    gap: spacing.s1,
                  }}
                  onPress={() => router.push(item.rota as any)}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                  <Text style={{ fontFamily: fontFamilies.technicalBold, fontSize: 10, color: colors.onSurfaceVariant, textAlign: "center" }}>
                    {item.label.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: spacing.s8 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function PainelAdm() {
  return (
    <StaffGuard rotaAtual="/painelAdm">
      <PainelAdmConteudo />
    </StaffGuard>
  );
}
