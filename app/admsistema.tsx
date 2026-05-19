import { styles } from "@/styles/admSistemaStyle";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type NavItem = "equipes" | "atletas" | "relatorios" | "configuracoes";

const NAV_ITEMS: { id: NavItem; label: string; icon: string }[] = [
  { id: "equipes", label: "Equipes", icon: "👥" },
  { id: "atletas", label: "Atletas", icon: "🏃" },
  { id: "relatorios", label: "Relatórios", icon: "📊" },
  { id: "configuracoes", label: "Configurações", icon: "⚙️" },
];

const Sidebar = ({
  activeNav,
  onNavChange,
}: {
  activeNav: NavItem;
  onNavChange: (id: NavItem) => void;
}) => (
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
            onPress={() => onNavChange(item.id)}
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

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Profissional {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  cargoTipo: "medico" | "bioanalista" | "esp_recuperacao";
  acesso: string;
}

interface Equipe {
  id: string;
  nome: string;
  atletas: number;
  destaque?: boolean;
  tag?: string;
}

interface CardConfigData {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
  labelChave: string;
  labelValor: string;
  corValor?: "primaria" | "normal";
}

// ─── Dados mockados ───────────────────────────────────────────────────────────

const PROFISSIONAIS: Profissional[] = [
  {
    id: "1",
    nome: "Dra. Helena Thorne",
    email: "helena.t@athletelab.com",
    cargo: "MÉDICO\nCHEFE",
    cargoTipo: "medico",
    acesso: "Resistência A, Sprint Elite",
  },
  {
    id: "2",
    nome: "Marcus Vance",
    email: "m.vance@athletelab.com",
    cargo: "BIOANALISTA",
    cargoTipo: "bioanalista",
    acesso: "Global do Laboratório",
  },
  {
    id: "3",
    nome: "Sarah J. Miller",
    email: "s.miller@athletelab.com",
    cargo: "ESP.\nRECUPERAÇÃO",
    cargoTipo: "esp_recuperacao",
    acesso: "Sprint Elite",
  },
];

const EQUIPES: Equipe[] = [
  { id: "1", nome: "Resistência Alpha", atletas: 12 },
  { id: "2", nome: "Sprint Elite", atletas: 8 },
  {
    id: "3",
    nome: "Hidratação Beta",
    atletas: 0,
    destaque: true,
    tag: "Nova Unidade",
  },
];

const CARDS_CONFIG: CardConfigData[] = [
  {
    id: "1",
    icone: "🛡️",
    titulo: "Criptografia de Protocolos",
    descricao:
      "Gerencie a criptografia de ponta a ponta para transmissão de dados biométricos e resultados laboratoriais.",
    labelChave: "NÍVEL DE SEGURANÇA",
    labelValor: "ENTERPRISE",
    corValor: "primaria",
  },
  {
    id: "2",
    icone: "🗄️",
    titulo: "Retenção de Dados",
    descricao:
      "Configure políticas de arquivamento para telemetria fisiológica e imagens de alta resolução.",
    labelChave: "PERÍODO DE ARQUIVAMENTO",
    labelValor: "5 ANOS",
  },
  {
    id: "3",
    icone: "🔗",
    titulo: "Integração Externa",
    descricao:
      "Sincronize resultados com APIs de wearables e bancos de dados de pesquisa médica de terceiros.",
    labelChave: "HUBS CONECTADOS",
    labelValor: "04 ATIVOS",
  },
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const BadgeCargo = ({
  tipo,
  label,
}: {
  tipo: Profissional["cargoTipo"];
  label: string;
}) => {
  const estiloMap: Record<Profissional["cargoTipo"], object> = {
    medico: styles.badgeMedico,
    bioanalista: styles.badgeBioanalista,
    esp_recuperacao: styles.badgeEsp,
  };
  const textoMap: Record<Profissional["cargoTipo"], object> = {
    medico: styles.badgeMedicoText,
    bioanalista: styles.badgeBioanalistaText,
    esp_recuperacao: styles.badgeEspText,
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

const CardConfigItem = ({ card }: { card: CardConfigData }) => (
  <View style={[styles.card, styles.cardConfigItem]}>
    <Text style={styles.cardConfigIcone}>{card.icone}</Text>
    <Text style={styles.cardConfigTitulo}>{card.titulo}</Text>
    <Text style={styles.cardConfigDesc}>{card.descricao}</Text>
    <View style={styles.cardConfigRodape}>
      <Text style={styles.cardConfigChave}>{card.labelChave}</Text>
      <Text
        style={[
          styles.cardConfigValor,
          card.corValor === "primaria" && styles.cardConfigValorPrimario,
        ]}
      >
        {card.labelValor}
      </Text>
    </View>
  </View>
);

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function AdmSistema() {
  const [activeNav, setActiveNav] = useState<NavItem>("equipes");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf9f5" />
      <View style={styles.layout}>
        {/* ── Sidebar ── */}
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

        {/* ── Conteúdo ── */}
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerBreadcrumb}>
              Gestão do Sistema
              <Text style={styles.headerSep}> / </Text>
              <Text style={styles.headerSecao}>Adm. do Sistema</Text>
            </Text>
            <TouchableOpacity style={styles.syncBtn} activeOpacity={0.7}>
              <Text style={styles.syncText}>↻ Sincronizar</Text>
            </TouchableOpacity>
          </View>

          {/* Título da seção */}
          <View style={styles.secaoTitulo}>
            <Text style={styles.tituloPrincipal}>Gestão do Sistema</Text>
            <Text style={styles.tituloDesc}>
              Orquestre equipes clínicas, gerencie permissões granulares e
              configure os{"\n"}parâmetros globais do laboratório a partir deste
              nexo técnico central.
            </Text>
          </View>

          {/* ── Linha principal: Tabela + Matriz ── */}
          <View style={styles.linhaMain}>
            {/* Card — Lista de Profissionais */}
            <View style={[styles.card, styles.cardTabela]}>
              <View style={styles.cardTabelaHeader}>
                <View>
                  <Text style={styles.cardLabel}>STATUS OPERACIONAL</Text>
                  <Text style={styles.cardTitulo}>Lista de Atletas Ativos</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.linkGerenciar}>GERENCIAR USUÁRIOS →</Text>
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

              {PROFISSIONAIS.map((prof, index) => (
                <ProfissionalRow
                  key={prof.id}
                  prof={prof}
                  isLast={index === PROFISSIONAIS.length - 1}
                />
              ))}
            </View>

            {/* Card — Matriz de Equipes */}
            <View style={[styles.card, styles.cardMatriz]}>
              <Text style={styles.cardLabel}>ORGANIZAÇÃO</Text>
              <Text style={styles.cardTitulo}>{"Matriz de\nEquipes"}</Text>
              <Text style={styles.matrizDesc}>
                Agrupe atletas e equipe clínica em unidades de performance
                focadas para isolar variáveis.
              </Text>
              <View style={styles.equipeList}>
                {EQUIPES.map((equipe, index) => (
                  <EquipeItem
                    key={equipe.id}
                    equipe={equipe}
                    isLast={index === EQUIPES.length - 1}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={styles.btnCriarEquipe}
                activeOpacity={0.8}
              >
                <Text style={styles.btnCriarEquipeText}>
                  + CRIAR NOVA EQUIPE
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Rodapé de conformidade ── */}
          <View style={styles.rodapeConformidade}>
            <Text style={styles.rodapeText}>
              CONFORMIDADE DE NÍVEL INSTITUCIONAL • CERTIFICAÇÃO GDPR-S
            </Text>
            <Text style={styles.rodapeText}>
              LOG DO SISTEMA V4.2.1-CLINICAL
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
