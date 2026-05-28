// app/perfilProfissional.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/constants/theme";
import { styles } from "@/styles/PerfilProfissionalStyle";

// ─── Sub-components ───────────────────────────────────────────────────────────
const Divider = () => <View style={styles.divider} />;

const SectionLabel = ({ label }: { label: string }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const InfoCard = ({
  label,
  value,
  sub,
  accentColor = colors.primary,
  editando,
  onChangeValue,
  onChangeSub,
}: {
  label: string;
  value: string;
  sub?: string;
  accentColor?: string;
  editando?: boolean;
  onChangeValue?: (v: string) => void;
  onChangeSub?: (v: string) => void;
}) => (
  <View style={styles.infoCard}>
    <View style={[styles.infoAccent, { backgroundColor: accentColor }]} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      {editando ? (
        <>
          <TextInput
            style={styles.infoInput}
            value={value}
            onChangeText={onChangeValue}
            placeholderTextColor={colors.onSurfaceVariant}
          />
          {sub !== undefined && (
            <TextInput
              style={styles.infoInputSub}
              value={sub}
              onChangeText={onChangeSub}
              placeholderTextColor={colors.onSurfaceVariant}
            />
          )}
        </>
      ) : (
        <>
          <Text style={styles.infoValue}>{value}</Text>
          {sub ? <Text style={styles.infoSub}>{sub}</Text> : null}
        </>
      )}
    </View>
  </View>
);

const StatCard = ({
  icon,
  label,
  value,
  unit,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
}) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      <Text style={styles.statEmoji}>{icon}</Text>
    </View>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}> {unit}</Text>
      </Text>
    </View>
  </View>
);

const SpecialtyTag = ({ label }: { label: string }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

const EspecialidadeRow = ({
  title,
  detail,
  editando,
  onChangeTitle,
  onChangeDetail,
}: {
  title: string;
  detail: string;
  editando?: boolean;
  onChangeTitle?: (v: string) => void;
  onChangeDetail?: (v: string) => void;
}) => (
  <View style={styles.especRow}>
    <View style={styles.especDot} />
    <View style={styles.especTexts}>
      {editando ? (
        <>
          <TextInput
            style={styles.infoInput}
            value={title}
            onChangeText={onChangeTitle}
            placeholderTextColor={colors.onSurfaceVariant}
          />
          <TextInput
            style={styles.infoInputSub}
            value={detail}
            onChangeText={onChangeDetail}
            multiline
            placeholderTextColor={colors.onSurfaceVariant}
          />
        </>
      ) : (
        <>
          <Text style={styles.especTitle}>{title}</Text>
          <Text style={styles.especDetail}>{detail}</Text>
        </>
      )}
    </View>
  </View>
);

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
type TabKey = "atletas" | "sessoes" | "perfil";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "atletas", label: "ATLETAS", icon: "🏃" },
  { key: "sessoes", label: "SESSÕES", icon: "📋" },
  { key: "perfil", label: "PERFIL", icon: "👤" },
];

const TAB_ROUTES: Record<TabKey, string> = {
  atletas: "/painelnutricionista",
  sessoes: "/biomarcadores",
  perfil: "/perfilProfissional",
};

const BottomTabBar = ({ active }: { active: TabKey }) => (
  <View style={styles.tabBar}>
    {TABS.map((tab) => {
      const isActive = tab.key === active;
      return (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabItem}
          onPress={() => {
            if (!isActive) router.push(TAB_ROUTES[tab.key] as any);
          }}
        >
          <View
            style={[styles.tabIconContainer, isActive && styles.tabIconActive]}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
          </View>
          <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PerfilProfissionalScreen() {
  const [editando, setEditando] = useState(false);

  // Dados Profissionais
  const [nome, setNome] = useState("Dra. Ana Lima");
  const [cargo, setCargo] = useState("NUTRICIONISTA ESPORTIVA");
  const [registro, setRegistro] = useState("CRN-3 45892");
  const [registroSub, setRegistroSub] = useState(
    "Conselho Regional de Nutricionistas — SP",
  );
  const [instituicao, setInstituicao] = useState("Clínica São Camilo");
  const [instituicaoSub, setInstituicaoSub] = useState(
    "Setor de Performance e Nutrição Esportiva",
  );
  const [formacao, setFormacao] = useState("Nutrição — USP");
  const [formacaoSub, setFormacaoSub] = useState(
    "Pós-graduação em Nutrição Esportiva · UNIFESP 2019",
  );
  const [experiencia, setExperiencia] = useState("11 anos");
  const [experienciaSub, setExperienciaSub] = useState(
    "Atuação com atletas de alto rendimento e futebol profissional",
  );

  // Áreas de Atuação
  const [area1Titulo, setArea1Titulo] = useState("Periodização Nutricional");
  const [area1Detalhe, setArea1Detalhe] = useState(
    "Planejamento nutricional integrado ao calendário de treinos e competições",
  );
  const [area2Titulo, setArea2Titulo] = useState("Hidratação e Eletrólitos");
  const [area2Detalhe, setArea2Detalhe] = useState(
    "Protocolos de reidratação e monitoramento da taxa de sudorese",
  );
  const [area3Titulo, setArea3Titulo] = useState("Suplementação Esportiva");
  const [area3Detalhe, setArea3Detalhe] = useState(
    "Prescrição baseada em evidências para performance e recuperação",
  );
  const [area4Titulo, setArea4Titulo] = useState("Composição Corporal");
  const [area4Detalhe, setArea4Detalhe] = useState(
    "Avaliação por DEXA e Bioimpedância com acompanhamento semanal",
  );

  // Contato
  const [email, setEmail] = useState("ana.lima@saocamilo.br");
  const [ramal, setRamal] = useState("3021-4488 · Ramal 214");
  const [ramalSub, setRamalSub] = useState("Seg – Sex · 08h às 18h");

  const handleSalvar = () => {
    setEditando(false);
    Alert.alert(
      "Perfil atualizado",
      "As alterações foram salvas com sucesso.",
      [{ text: "OK" }],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>PROFISSIONAL</Text>
        <TouchableOpacity
          style={styles.headerAvatar}
          onPress={() => router.push("/perfilProfissional")}
        >
          <Text style={styles.headerAvatarText}>AL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Nome */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>AL</Text>
            </View>
            <View style={styles.badgeOnline} />
          </View>

          {editando ? (
            <>
              <TextInput
                style={[
                  styles.infoInput,
                  { textAlign: "center", fontSize: 22, marginBottom: 4 },
                ]}
                value={nome}
                onChangeText={setNome}
                placeholderTextColor={colors.onSurfaceVariant}
              />
              <TextInput
                style={[
                  styles.infoInputSub,
                  { textAlign: "center", marginBottom: 14 },
                ]}
                value={cargo}
                onChangeText={setCargo}
                placeholderTextColor={colors.onSurfaceVariant}
              />
            </>
          ) : (
            <>
              <Text style={styles.playerName}>{nome}</Text>
              <Text style={styles.playerRole}>{cargo}</Text>
            </>
          )}

          <View style={styles.tagsRow}>
            <SpecialtyTag label="CRN-3 · 45892" />
            <SpecialtyTag label="CBNE Certificada" />
          </View>
        </View>

        <Divider />

        {/* Dados Profissionais */}
        <SectionLabel label="DADOS PROFISSIONAIS" />
        <InfoCard
          label="REGISTRO PROFISSIONAL"
          value={registro}
          sub={registroSub}
          accentColor={colors.primary}
          editando={editando}
          onChangeValue={setRegistro}
          onChangeSub={setRegistroSub}
        />
        <InfoCard
          label="INSTITUIÇÃO"
          value={instituicao}
          sub={instituicaoSub}
          accentColor={colors.secondary}
          editando={editando}
          onChangeValue={setInstituicao}
          onChangeSub={setInstituicaoSub}
        />
        <InfoCard
          label="FORMAÇÃO"
          value={formacao}
          sub={formacaoSub}
          accentColor={colors.tertiary}
          editando={editando}
          onChangeValue={setFormacao}
          onChangeSub={setFormacaoSub}
        />
        <InfoCard
          label="EXPERIÊNCIA"
          value={experiencia}
          sub={experienciaSub}
          accentColor={colors.primary}
          editando={editando}
          onChangeValue={setExperiencia}
          onChangeSub={setExperienciaSub}
        />

        <Divider />

        {/* Áreas de Atuação */}
        <SectionLabel label="ÁREAS DE ATUAÇÃO" />
        <View style={styles.configSection}>
          <EspecialidadeRow
            title={area1Titulo}
            detail={area1Detalhe}
            editando={editando}
            onChangeTitle={setArea1Titulo}
            onChangeDetail={setArea1Detalhe}
          />
          <View style={styles.rowSeparator} />
          <EspecialidadeRow
            title={area2Titulo}
            detail={area2Detalhe}
            editando={editando}
            onChangeTitle={setArea2Titulo}
            onChangeDetail={setArea2Detalhe}
          />
          <View style={styles.rowSeparator} />
          <EspecialidadeRow
            title={area3Titulo}
            detail={area3Detalhe}
            editando={editando}
            onChangeTitle={setArea3Titulo}
            onChangeDetail={setArea3Detalhe}
          />
          <View style={styles.rowSeparator} />
          <EspecialidadeRow
            title={area4Titulo}
            detail={area4Detalhe}
            editando={editando}
            onChangeTitle={setArea4Titulo}
            onChangeDetail={setArea4Detalhe}
          />
        </View>

        <Divider />

        {/* Estatísticas */}
        <SectionLabel label="ESTATÍSTICAS DE ATENDIMENTO" />
        <StatCard
          icon="🏃"
          label="ATLETAS ACOMPANHADOS"
          value="34"
          unit="ativos"
        />
        <StatCard
          icon="📋"
          label="SESSÕES ESTE MÊS"
          value="128"
          unit="sessões"
        />
        <StatCard icon="📈" label="TAXA DE ADESÃO" value="91" unit="%" />
        <StatCard
          icon="⏱"
          label="TEMPO MÉDIO ATENDIMENTO"
          value="48"
          unit="min"
        />

        <Divider />

        {/* Contato */}
        <SectionLabel label="CONTATO INSTITUCIONAL" />
        <InfoCard
          label="E-MAIL"
          value={email}
          accentColor={colors.secondary}
          editando={editando}
          onChangeValue={setEmail}
        />
        <InfoCard
          label="RAMAL"
          value={ramal}
          sub={ramalSub}
          accentColor={colors.tertiary}
          editando={editando}
          onChangeValue={setRamal}
          onChangeSub={setRamalSub}
        />

        <Divider />

        {/* Botões */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={editando ? handleSalvar : () => setEditando(true)}
        >
          <Text style={styles.btnPrimaryText}>
            {editando ? "💾 SALVAR ALTERAÇÕES" : "✏️ EDITAR PERFIL"}
          </Text>
        </TouchableOpacity>

        {editando && (
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => setEditando(false)}
          >
            <Text style={styles.btnSecondaryText}>✕ CANCELAR</Text>
          </TouchableOpacity>
        )}

        {!editando && (
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push("/telaLogin")}
          >
            <Text style={styles.btnSecondaryText}>↩ ENCERRAR SESSÃO</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomTabBar active="perfil" />
    </SafeAreaView>
  );
}
