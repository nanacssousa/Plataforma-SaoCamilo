// app/painelnutricionista.tsx
// Painel do nutricionista — busca atletas e seus dados hídricos do backend
import { apiFetch } from "../src/services/apiService";
import { styles } from "../src/styles/PainelNutricionistaStyle";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import StaffGuard from "../src/components/StaffGuard";
import StaffSidebar from "../src/components/StaffSidebar";
import { PERFIL_PARA_ROLE } from "../src/config/staffPermissions";
import { gerarECompartilharPDF } from "../src/services/pdfService";
import { useAppStore } from "../src/store/useAppStore";

type StatusHidrico = "desidratado" | "hidratado" | "alerta_leve";

interface Atleta {
  id: string;
  nome: string;
  posicao: string;
  categoria: string;
  massaAtual: number;
  deltaMassa: number;
  usg: number;
  statusHidrico: StatusHidrico;
}

interface Sugestao {
  id: string;
  tipo: "emergencial" | "ajuste";
  titulo: string;
  descricao: string;
}

const BadgeStatus = ({ status }: { status: StatusHidrico }) => {
  if (status === "desidratado")
    return (
      <View style={[styles.badge, styles.badgeDesidratado]}>
        <View style={[styles.dot, styles.dotDesidratado]} />
        <Text style={[styles.badgeText, styles.badgeTextDesidratado]}>
          DESIDRATADO
        </Text>
      </View>
    );
  if (status === "hidratado")
    return (
      <View style={[styles.badge, styles.badgeHidratado]}>
        <View style={[styles.dot, styles.dotHidratado]} />
        <Text style={[styles.badgeText, styles.badgeTextHidratado]}>
          HIDRATADO
        </Text>
      </View>
    );
  return (
    <View style={[styles.badge, styles.badgeAlerta]}>
      <View style={[styles.dot, styles.dotAlerta]} />
      <Text style={[styles.badgeText, styles.badgeTextAlerta]}>
        ALERTA LEVE
      </Text>
    </View>
  );
};

const AtletaRow = ({ atleta, isLast }: { key?: React.Key; atleta: Atleta; isLast: boolean }) => {
  const deltaPositivo = atleta.deltaMassa >= 0;
  return (
    <View style={[styles.atletaRow, !isLast && styles.atletaRowBorder]}>
      <TouchableOpacity
        style={styles.avatar}
        activeOpacity={0.7}
        onPress={() => router.push("/perfilProfissional")}
      >
        <Text style={styles.avatarText}>
          {atleta.nome
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </Text>
      </TouchableOpacity>
      <View style={styles.atletaInfo}>
        <Text style={styles.atletaNome}>{atleta.nome}</Text>
        <Text style={styles.atletaDetalhe}>
          {atleta.posicao.toUpperCase()} • {atleta.categoria.toUpperCase()}
        </Text>
      </View>
      <View style={styles.colStatus}>
        <BadgeStatus status={atleta.statusHidrico} />
      </View>
      <View style={styles.colMassa}>
        <Text style={styles.colValue}>{atleta.massaAtual.toFixed(1)} kg</Text>
      </View>
      <View style={styles.colDelta}>
        <Text
          style={[
            styles.deltaText,
            deltaPositivo ? styles.deltaPos : styles.deltaNeg,
          ]}
        >
          {deltaPositivo ? "+" : ""}
          {atleta.deltaMassa.toFixed(1)}%
        </Text>
      </View>
      <View style={styles.colUsg}>
        <Text style={styles.colValue}>{atleta.usg.toFixed(3)}</Text>
      </View>
      <TouchableOpacity style={styles.acaoBtn} activeOpacity={0.6}>
        <Text style={styles.acaoDots}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};

const SugestaoCard = ({ sugestao }: { key?: React.Key; sugestao: Sugestao }) => (
  <View style={styles.sugestaoCard}>
    <View
      style={[
        styles.sugestaoIcone,
        sugestao.tipo === "emergencial"
          ? styles.sugestaoIconeEmergencial
          : styles.sugestaoIconeAjuste,
      ]}
    >
      <Text style={styles.sugestaoIconeText}>
        {sugestao.tipo === "emergencial" ? "⚠" : "🧪"}
      </Text>
    </View>
    <View style={styles.sugestaoTexto}>
      <Text style={styles.sugestaoTitulo}>{sugestao.titulo}</Text>
      <Text style={styles.sugestaoDesc}>{sugestao.descricao}</Text>
    </View>
  </View>
);

function calcularStatusHidrico(deltaMassa: number, usg: number): StatusHidrico {
  if (deltaMassa <= -2 || usg >= 1.025) return "desidratado";
  if (deltaMassa <= -1 || usg >= 1.02) return "alerta_leve";
  return "hidratado";
}

function gerarSugestoes(atletas: Atleta[]): Sugestao[] {
  const sugestoes: Sugestao[] = [];
  const desidratados = atletas.filter((a) => a.statusHidrico === "desidratado");
  const alertas = atletas.filter((a) => a.statusHidrico === "alerta_leve");
  if (desidratados.length > 0) {
    sugestoes.push({
      id: "1",
      tipo: "emergencial",
      titulo: `Protocolo Emergencial: ${desidratados[0].nome.split(" ")[0]}`,
      descricao: `Reposição de 1.200ml de solução isotônica (6% carb) em 90 min. ${desidratados.length > 1 ? `+${desidratados.length - 1} atleta(s) em estado crítico.` : ""}`,
    });
  }
  if (alertas.length > 0) {
    sugestoes.push({
      id: "2",
      tipo: "ajuste",
      titulo: `Ajuste Hídrico: ${alertas.length} atleta(s) em alerta`,
      descricao:
        "Aumentar oferta de eletrólitos pré-treino e monitorar USG nas próximas 2 horas.",
    });
  }
  return sugestoes.length > 0
    ? sugestoes
    : [
        {
          id: "0",
          tipo: "ajuste",
          titulo: "Equipe em dia",
          descricao:
            "Todos os atletas estão dentro dos parâmetros ideais de hidratação.",
        },
      ];
}

function PainelNutricionistaConteudo() {
  const { state } = useAppStore();
  const staffRole = state.idPerfil ? PERFIL_PARA_ROLE[state.idPerfil] : undefined;
  const [filtro, setFiltro] = useState("");
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);

  const carregarAtletas = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      // Busca apenas atletas (perfil 1) — backend agora filtra de fato por id_perfil
      const usuarios = await apiFetch<any[]>("/usuarios?id_perfil=1");

      if (!Array.isArray(usuarios) || usuarios.length === 0) {
        setAtletas([]);
        return;
      }

      // Defesa extra: garante que só atletas (id_perfil === 1) entrem na lista,
      // mesmo se o backend algum dia voltar a ignorar o filtro.
      const apenasAtletas = usuarios.filter((u: any) => u.id_perfil === 1);

      if (apenasAtletas.length === 0) {
        setAtletas([]);
        return;
      }

      // Para cada atleta, busca o cálculo de hidratação mais recente (já pronto no backend)
      const atletasComDados = await Promise.all(
        apenasAtletas.map(async (u: any) => {
          let massaAtual = 0;
          let deltaMassa = 0;
          let usg = 1.015;

          try {
            const calculos = await apiFetch<any[]>(
              `/calculos-hidratacao/usuario/${u.id_usuario}?limit=2`,
            );
            if (Array.isArray(calculos) && calculos.length > 0) {
              const ultimo = calculos[0];
              massaAtual = Number(ultimo.massa_pos_kg ?? ultimo.massa_pre_kg ?? 0);

              if (calculos.length > 1) {
                const anterior = calculos[1];
                const massaAnterior = Number(
                  anterior.massa_pos_kg ?? anterior.massa_pre_kg ?? massaAtual,
                );
                deltaMassa =
                  massaAnterior > 0
                    ? parseFloat(
                        (
                          ((massaAtual - massaAnterior) / massaAnterior) *
                          100
                        ).toFixed(1),
                      )
                    : 0;
              }

              // escala_cor (1-8) vem de registros_cor_urina via join no backend;
              // convertida para uma faixa de USG aproximada (1.000 a 1.035)
              if (ultimo.escala_cor) {
                usg = parseFloat((1.0 + (Number(ultimo.escala_cor) * 0.005)).toFixed(3));
              }
            }
          } catch {
            /* mantém padrões caso o atleta ainda não tenha sessões registradas */
          }

          return {
            id: String(u.id_usuario),
            nome: u.nome_completo ?? "Atleta",
            posicao: u.posicao ?? "Atleta",
            categoria: u.categoria ?? "PRINCIPAL",
            massaAtual,
            deltaMassa,
            usg,
            statusHidrico: calcularStatusHidrico(deltaMassa, usg),
          } as Atleta;
        }),
      );

      setAtletas(atletasComDados);
    } catch (err: any) {
      Alert.alert(
        "Erro ao carregar atletas",
        err.message ?? "Verifique a conexão com o servidor.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarAtletas();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarAtletas(true);
  }, [carregarAtletas]);

  const atletasFiltrados = atletas.filter((a: Atleta) =>
    a.nome.toLowerCase().includes(filtro.toLowerCase()),
  );

  const sugestoes = gerarSugestoes(atletas);

  const handleGerarRelatorio = async () => {
    if (gerandoRelatorio) return;
    if (atletas.length === 0) {
      Alert.alert(
        "Sem dados",
        "Nenhum atleta carregado para gerar o relatório.",
      );
      return;
    }
    setGerandoRelatorio(true);
    try {
      const hidratados = atletas.filter(
        (a: Atleta) => a.statusHidrico === "hidratado",
      ).length;
      const mediaHidratacao = Math.round((hidratados / atletas.length) * 100);
      await gerarECompartilharPDF(
        atletas,
        "Painel de Atletas",
        "Monitoramento Hidrico",
        mediaHidratacao,
      );
    } catch (err: any) {
      Alert.alert("Erro", err.message ?? "Não foi possível gerar o relatório.");
    } finally {
      setGerandoRelatorio(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
      <View style={styles.layout}>
        <StaffSidebar role={staffRole ?? "medico"} activeNav="sessoes" />
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8f000a"
            />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBreadcrumb}>
                Visão Geral da Equipe
                <Text style={styles.headerBreadcrumbSep}> / </Text>
                <Text style={styles.headerEquipe}>Alta Performance A</Text>
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitulo}>Monitoramento de Atletas</Text>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Filtrar atletas..."
                  placeholderTextColor="#8F8880"
                  value={filtro}
                  onChangeText={setFiltro}
                />
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colAtleta]}>
                ATLETA
              </Text>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>
                STATUS HÍDRICO
              </Text>
              <Text style={[styles.tableHeaderText, styles.colMassa]}>
                MASSA ATUAL
              </Text>
              <Text style={[styles.tableHeaderText, styles.colDelta]}>
                Δ MASSA (%)
              </Text>
              <Text style={[styles.tableHeaderText, styles.colUsg]}>
                USG (G/ML)
              </Text>
            </View>

            {loading ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#8f000a" />
                <Text
                  style={{
                    marginTop: 12,
                    color: "#5b403d",
                    fontFamily: "SourceSans3_400Regular",
                  }}
                >
                  Carregando atletas...
                </Text>
              </View>
            ) : atletasFiltrados.length === 0 ? (
              <View style={{ padding: 24, alignItems: "center" }}>
                <Text style={{ color: "#5b403d" }}>
                  Nenhum atleta encontrado.
                </Text>
              </View>
            ) : (
              atletasFiltrados.map((atleta: Atleta, index: number) => (
                <AtletaRow
                  key={atleta.id}
                  atleta={atleta}
                  isLast={index === atletasFiltrados.length - 1}
                />
              ))
            )}
          </View>

          <View style={styles.rodape}>
            <View style={[styles.card, styles.cardSugestoes]}>
              <Text style={styles.cardTitulo}>Sugestões de Recomposição</Text>
              <View style={styles.sugestaoLista}>
                {sugestoes.map((s) => (
                  <SugestaoCard key={s.id} sugestao={s} />
                ))}
              </View>
            </View>

            <View style={[styles.card, styles.cardRelatorio]}>
              <Text style={styles.relatorioIcone}>📋</Text>
              <Text style={styles.cardTitulo}>Relatório Consolidado</Text>
              <Text style={styles.relatorioDesc}>
                {atletas.length} atletas monitorados.{" "}
                {
                  atletas.filter((a: Atleta) => a.statusHidrico === "desidratado")
                    .length
                }{" "}
                em estado crítico.
              </Text>
              <TouchableOpacity
                style={[styles.pdfBtn, gerandoRelatorio && { opacity: 0.6 }]}
                activeOpacity={0.8}
                onPress={handleGerarRelatorio}
                disabled={gerandoRelatorio}
              >
                <Text style={styles.pdfBtnText}>
                  {gerandoRelatorio ? "GERANDO..." : "GERAR PDF COMPLETO"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.nutricionistaBadge}
            activeOpacity={0.7}
            onPress={() => router.push("/perfilProfissional")}
          >
            <View style={styles.nutAvatar}>
              <Text style={styles.nutAvatarText}>
                {state.perfil.iniciais || "NR"}
              </Text>
            </View>
            <View>
              <Text style={styles.nutLabel}>NUTRICIONISTA</Text>
              <Text style={styles.nutNome}>
                {state.perfil.nome || "Profissional"}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function PainelNutricionista() {
  return (
    <StaffGuard rotaAtual="/painelnutricionista">
      <PainelNutricionistaConteudo />
    </StaffGuard>
  );
}
