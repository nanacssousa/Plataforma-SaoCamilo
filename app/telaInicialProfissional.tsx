// app/telaCadastroStaff.tsx
import React, { useState } from "react";
import {
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

export default function TelaCadastroStaff() {
  const [role, setRole] = useState<StaffRole>("treinador");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [registro, setRegistro] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
            <TextInput
              style={inputStyle("senha")}
              placeholder="Digite a senha de acesso"
              placeholderTextColor={colors.onSurfaceVariant}
              secureTextEntry
              autoCapitalize="none"
              value={senha}
              onChangeText={setSenha}
              onFocus={() => setFocusedField("senha")}
              onBlur={() => setFocusedField(null)}
            />
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
          <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>FINALIZAR REGISTRO →</Text>
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