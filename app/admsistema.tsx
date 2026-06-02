// app/admsistema.tsx
// Painel do administrador — busca profissionais e equipes do backend
import { styles } from "@/styles/admSistemaStyle";
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
import { apiFetch } from "../src/services/apiService";
import { useAppStore } from "../src/store/useAppStore";

type NavItem = "equipes" | "atletas" | "relatorios" | "perfil";
const NAV_ROUTES: Record<NavItem, string> = {
  equipes: "/telaequipes",
  atletas: "/painelnutricionista",
  relatorios: "/biomarcadores",
  perfil: "/perfilProfissional",
};
const NAV_ITEMS = [
  { id: "equipes" as NavItem, label: "Equipes", icon: "👥" },
  { id: "atletas" as NavItem, label: "Atletas", icon: "🏃" },
  { id: "relatorios" as NavItem, label: "Relatórios", icon: "📊" },
  { id: "perfil" as NavItem, label: "Perfil", icon: "⚙️" },
];

const Sidebar = ({ activeNav }: { activeNav: NavItem }) => (
  <View style={styles.sidebar}>
    <View style={styles.sidebarLogo}>
      <Text style={styles.sidebarLogoTop}>CLINICAL</Text>
      <Text style={styles.sidebarLogoBottom}>ATHLETE</Text>
    </View>
    <View style={styles.sidebarNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === activeNav;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => {
              if (!isActive) router.push(NAV_ROUTES[item.id] as any);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

type CargoTipo =
  | "medico"
  | "bioanalista"
  | "esp_recuperacao"
  | "nutricionista"
  | "treinador"
  | "administrador";

interface Profissional {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  cargoTipo: CargoTipo;
  acesso: string;
}

interface Equipe {
  id: string;
  nome: string;
  atletas: number;
  destaque?: boolean;
  tag?: string;
}

const PERFIL_LABEL: Record<number, { label: string; tipo: CargoTipo }> = {
  1: { label: "ATLETA", tipo: "bioanalista" },
  2: { label: "NUTRICIONISTA", tipo: "nutricionista" },
  3: { label: "TREINADOR", tipo: "treinador" },
  4: { label: "MÉDICO", tipo: "medico" },
  5: { label: "ADMIN", tipo: "administrador" },
};

const BadgeCargo = ({ tipo, label }: { tipo: CargoTipo; label: string }) => {
  const estiloMap: Record<CargoTipo, object> = {
    medico: styles.badgeMedico,
    bioanalista: styles.badgeBioanalista,
    esp_recuperacao: styles.badgeEsp,
    nutricionista: styles.badgeMedico,
    treinador: styles.badgeBioanalista,
    administrador: styles.badgeEsp,
  };
  const textoMap: Record<CargoTipo, object> = {
    medico: styles.badgeMedicoText,
    bioanalista: styles.badgeBioanalistaText,
    esp_recuperacao: styles.badgeEspText,
    nutricionista: styles.badgeMedicoText,
    treinador: styles.badgeBioanalistaText,
    administrador: styles.badgeEspText,
  };
  return (
    <View style={[styles.badgeCargo, estiloMap[tipo]]}>
      <Text style={[styles.badgeCargoText, textoMap[tipo]]}>{label}</Text>
    </View>
  );
};

const ProfissionalRow = ({
  prof,
  isLast,
}: {
  prof: Profissional;
  isLast: boolean;
}) => (
  <View style={[styles.profRow, !isLast && styles.profRowBorder]}>
    <View style={styles.profAvatar}>
      <Text style={styles.profAvatarIcon}>👤</Text>
    </View>
    <View style={styles.profInfo}>
      <Text style={styles.profNome}>{prof.nome}</Text>
      <Text style={styles.profEmail}>{prof.email}</Text>
    </View>
    <View style={styles.colCargo}>
      <BadgeCargo tipo={prof.cargoTipo} label={prof.cargo} />
    </View>
    <View style={styles.colAcesso}>
      <Text style={styles.colValue}>{prof.acesso}</Text>
    </View>
    <TouchableOpacity style={styles.acaoBtn} activeOpacity={0.6}>
      <Text style={styles.acaoIcon}>✏️</Text>
    </TouchableOpacity>
  </View>
);

const EquipeItem = ({
  equipe,
  isLast,
}: {
  equipe: Equipe;
  isLast: boolean;
}) => (
  <View
    style={[
      styles.equipeItem,
      !isLast && styles.equipeItemBorder,
      equipe.destaque && styles.equipeItemDestaque,
    ]}
  >
    <Text
      style={[styles.equipeNome, equipe.destaque && styles.equipeNomeDestaque]}
    >
      {equipe.nome}
    </Text>
    <View style={styles.equipeRight}>
      {equipe.tag ? (
        <View style={styles.equipeTag}>
          <Text style={styles.equipeTagText}>{equipe.tag}</Text>
        </View>
      ) : (
        <Text style={styles.equipeAtletas}>{equipe.atletas} Atletas</Text>
      )}
    </View>
  </View>
);

export default function AdmSistema() {
  const { state } = useAppStore();
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      // Busca todos os usuários não-atletas
      const [usuarios, equipesRaw] = await Promise.all([
        apiFetch<any[]>("/usuarios").catch(() => []),
        apiFetch<any[]>("/equipes").catch(() => []),
      ]);

      if (Array.isArray(usuarios)) {
        const profs: Profissional[] = usuarios
          .filter((u: any) => u.id_perfil !== 1) // exclui atletas
          .map((u: any) => {
            const perfilInfo = PERFIL_LABEL[u.id_perfil] ?? {
              label: "USUÁRIO",
              tipo: "bioanalista" as CargoTipo,
            };
            return {
              id: String(u.id_usuario),
              nome: u.nome_completo ?? "Profissional",
              email: u.email ?? "",
              cargo: perfilInfo.label,
              cargoTipo: perfilInfo.tipo,
              acesso: u.equipe ?? "Global",
            };
          });
        setProfissionais(profs);
      }

      if (Array.isArray(equipesRaw)) {
        const equipesMapped: Equipe[] = equipesRaw.map((e: any) => ({
          id: String(e.id_equipe ?? e.id),
          nome: e.nome ?? "Equipe",
          atletas: e.total_atletas ?? e.atletas ?? 0,
        }));
        setEquipes(equipesMapped);
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message ?? "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregar(true);
  }, [carregar]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
      <View style={styles.layout}>
        <Sidebar activeNav="equipes" />
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
            <Text style={styles.headerBreadcrumb}>
              Gestão do Sistema
              <Text style={styles.headerSep}> / </Text>
              <Text style={styles.headerSecao}>Adm. do Sistema</Text>
            </Text>
          </View>

          <View style={styles.secaoTitulo}>
            <Text style={styles.tituloPrincipal}>Gestão do Sistema</Text>
            <Text style={styles.tituloDesc}>
              Orquestre equipes clínicas, gerencie permissões granulares e
              configure os{"\n"}parâmetros globais do laboratório.
            </Text>
          </View>

          <View style={styles.linhaMain}>
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
                <Text style={[styles.tableHeaderText, styles.colProfissional]}>
                  PROFISSIONAL
                </Text>
                <Text style={[styles.tableHeaderText, styles.colCargo]}>
                  {"CARGO\nDESIGNADO"}
                </Text>
                <Text style={[styles.tableHeaderText, styles.colAcesso]}>
                  {"ACESSO\nÀS UNIDADES"}
                </Text>
                <Text style={[styles.tableHeaderText, styles.colAcoes]}>
                  AÇÕES
                </Text>
              </View>

              {loading ? (
                <View style={{ padding: 32, alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#8f000a" />
                  <Text style={{ marginTop: 12, color: "#5b403d" }}>
                    Carregando...
                  </Text>
                </View>
              ) : profissionais.length === 0 ? (
                <View style={{ padding: 24, alignItems: "center" }}>
                  <Text style={{ color: "#5b403d" }}>
                    Nenhum profissional cadastrado.
                  </Text>
                </View>
              ) : (
                profissionais.map((prof, index) => (
                  <ProfissionalRow
                    key={prof.id}
                    prof={prof}
                    isLast={index === profissionais.length - 1}
                  />
                ))
              )}
            </View>

            <View style={[styles.card, styles.cardMatriz]}>
              <Text style={styles.cardLabel}>ORGANIZAÇÃO</Text>
              <Text style={styles.cardTitulo}>{"Matriz de\nEquipes"}</Text>
              <Text style={styles.matrizDesc}>
                Agrupe atletas e equipe clínica em unidades de performance
                focadas.
              </Text>
              {loading ? (
                <ActivityIndicator color="#8f000a" style={{ marginTop: 16 }} />
              ) : equipes.length === 0 ? (
                <Text style={{ color: "#5b403d", marginTop: 12 }}>
                  Nenhuma equipe cadastrada.
                </Text>
              ) : (
                <View style={styles.equipeList}>
                  {equipes.map((equipe, index) => (
                    <EquipeItem
                      key={equipe.id}
                      equipe={equipe}
                      isLast={index === equipes.length - 1}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
