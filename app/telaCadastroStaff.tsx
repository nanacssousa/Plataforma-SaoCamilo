// app/telaCadastroStaff.tsx
import { useRouter } from "expo-router";
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
import PermissionsCard from "../src/components/PermissionsCard";
import RolePicker, { StaffRole } from "../src/components/RolePicker";
import { colors } from "../src/constants/theme";
import { authAPI } from "../src/services/api";
import { styles } from "../src/styles/cadastroStaffStyle";

const ESPECIALIDADES = [
  "Futebol",
  "Basquete",
  "Atletismo",
  "Natação",
  "Voleibol",
  "Musculação",
  "CrossFit",
  "Outro",
];

const ESPECIALIDADES_MEDICA = [
  "Medicina Esportiva",
  "Fisiologia",
  "Nutrição Clínica",
  "Ortopedia",
  "Cardiologia",
  "Fisioterapia",
  "Outro",
];

function validarStaff(campos: {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  registro: string;
  especialidade: string;
  role: StaffRole;
}) {
  const erros: Record<string, string> = {};

  if (!campos.nome.trim()) erros.nome = "Nome obrigatório";
  else if (campos.nome.trim().length < 3) erros.nome = "Mínimo 3 caracteres";

  if (!campos.email.trim()) erros.email = "E-mail obrigatório";
  else if (!campos.email.includes("@")) erros.email = "E-mail inválido";

  if (!campos.senha.trim()) erros.senha = "Senha obrigatória";
  else if (campos.senha.length < 6) erros.senha = "Mínimo 6 caracteres";

  if (!campos.telefone.trim()) erros.telefone = "Telefone obrigatório";

  if (!campos.registro.trim())
    erros.registro = `${campos.role === "medico" ? "CRM" : campos.role === "administrador" ? "CPF" : "CREF"} obrigatório`;

  if (campos.role !== "administrador" && !campos.especialidade)
    erros.especialidade = "Especialidade obrigatória";

  return erros;
}

export default function TelaCadastroStaff() {
  const router = useRouter();
  const [role, setRole] = useState<StaffRole>("treinador");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [registro, setRegistro] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const isAdmin = role === "administrador";
  const isMedico = role === "medico";
  const opcoes = isMedico ? ESPECIALIDADES_MEDICA : ESPECIALIDADES;

  const registroLabel = isMedico ? "CRM" : isAdmin ? "CPF" : "CREF";
  const registroPlaceholder = isMedico
    ? "000000/SP"
    : isAdmin
    ? "000.000.000-00"
    : "000000-G/SP";

  function inputStyle(field: string) {
    return [styles.input, focusedField === field && styles.inputFocused];
  }

  const getIdPerfil = (role: StaffRole) => {
    const perfis: Record<StaffRole, number> = {
      treinador: 3,
      medico: 4,
      administrador: 5,
    };
    return perfis[role];
  };

  const handleSubmit = async () => {
    console.log("CLICOU NO BOTÃO CADASTRO STAFF");
    setTentouEnviar(true);

    const novosErros = validarStaff({
      nome,
      email,
      senha,
      telefone,
      registro,
      especialidade,
      role,
    });

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      Alert.alert(
        "Campos incompletos",
        "Preencha todos os campos obrigatórios corretamente.",
      );
      return;
    }

    setCarregando(true);

    try {
      console.log("Iniciando cadastro de staff...");

      const usuario = await authAPI.cadastrarStaff({
        nome_completo: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        id_perfil: getIdPerfil(role),
        telefone: telefone.trim(),
        registro_profissional: registro.trim(),
        especialidade: especialidade || null,
      });

      console.log("Usuário staff criado:", usuario);

      Alert.alert("Cadastro realizado", "O profissional foi registrado com sucesso.");

      router.replace("/telaLogin");
    } catch (error: any) {
      console.log("ERRO COMPLETO:", error);

      Alert.alert(
        "Erro no cadastro",
        error?.message || JSON.stringify(error) || "Erro desconhecido.",
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFCF8" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.tag}>PROTOCOLO DE REGISTRO</Text>
          <Text style={styles.title}>Cadastro do{"\n"}Profissional</Text>
          <Text style={styles.subtitle}>
            Registre treinadores, médicos e administradores com controle
            granular de permissões e acesso clínico.
          </Text>
        </View>

        {/* ── Seleção de cargo ────────────────────────────────────────────── */}
        <RolePicker selected={role} onSelect={setRole} />

        {/* ── Formulário ──────────────────────────────────────────────────── */}
        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME COMPLETO</Text>
            <TextInput
              style={inputStyle("nome")}
              placeholder="Ex: Dr. Rafael Souza"
              placeholderTextColor={colors.onSurfaceVariant}
              value={nome}
              onChangeText={setNome}
              onFocus={() => setFocusedField("nome")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* E-mail + Telefone */}
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={inputStyle("email")}
                placeholder="email@clinica.com"
                placeholderTextColor={colors.onSurfaceVariant}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>TELEFONE</Text>
              <TextInput
                style={inputStyle("telefone")}
                placeholder="(11) 99999-0000"
                placeholderTextColor={colors.onSurfaceVariant}
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
                onFocus={() => setFocusedField("telefone")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SENHA</Text>
            <View style={[styles.input, focusedField === "senha" && styles.inputFocused, { flexDirection: "row", alignItems: "center", paddingRight: 10 }]}>
              <TextInput
                style={{ flex: 1, color: colors.onSurface }}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.onSurfaceVariant}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                onFocus={() => setFocusedField("senha")}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Text style={{ fontSize: 18, color: colors.onSurfaceVariant }}>
                  {mostrarSenha ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Número de registro profissional */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{registroLabel}</Text>
            <TextInput
              style={inputStyle("registro")}
              placeholder={registroPlaceholder}
              placeholderTextColor={colors.onSurfaceVariant}
              value={registro}
              onChangeText={setRegistro}
              onFocus={() => setFocusedField("registro")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Especialidade (dropdown) — oculto para admin */}
          {!isAdmin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ESPECIALIDADE</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowDropdown((v) => !v)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.selectText,
                    !especialidade && styles.selectPlaceholder,
                  ]}
                >
                  {especialidade || "Selecione a especialidade"}
                </Text>
                <Text style={styles.selectIcon}>
                  {showDropdown ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
              {showDropdown && (
                <View style={styles.dropdownContainer}>
                  {opcoes.map((op, i) => (
                    <TouchableOpacity
                      key={op}
                      style={[
                        styles.dropdownItem,
                        i === opcoes.length - 1 && styles.dropdownItemLast,
                      ]}
                      onPress={() => {
                        setEspecialidade(op);
                        setShowDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          especialidade === op &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {op}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.divider} />

          {/* Permissões dinâmicas */}
          <PermissionsCard role={role} />

          {/* Botão */}
          <TouchableOpacity
            style={[styles.btnPrimary, carregando && styles.btnPrimaryDisabled]}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={carregando}
          >
            <Text
              style={[
                styles.btnPrimaryText,
                carregando && styles.btnPrimaryTextDisabled,
              ]}
            >
              {carregando ? "CADASTRANDO..." : "FINALIZAR REGISTRO →"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            AO PROSSEGUIR, VOCÊ CONCORDA COM OS{"\n"}PROTOCOLOS DE DADOS DA
            PLATAFORMA.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}