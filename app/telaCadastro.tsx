// app/telaCadastro.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { BotaoPrimario, CampoTexto, DropdownModalidade } from "../src/components/CadastroAtletaComponents";
import { colors } from "../src/constants/theme";
import { styles } from "../src/styles/cadastroAtletaStyle";
import { authAPI, perfilAPI } from "../src/services/api";

function validar(campos: { nome: string; idade: string; altura: string; peso: string; modalidade: string }) {
  const erros: Record<string, string> = {};
  if (!campos.nome.trim()) erros.nome = "Nome obrigatório";
  else if (campos.nome.trim().length < 3) erros.nome = "Mínimo 3 caracteres";
  const idade = Number(campos.idade);
  if (!campos.idade) erros.idade = "Idade obrigatória";
  else if (isNaN(idade) || idade < 10 || idade > 80) erros.idade = "Entre 10 e 80 anos";
  const altura = Number(campos.altura);
  if (!campos.altura) erros.altura = "Altura obrigatória";
  else if (isNaN(altura) || altura < 100 || altura > 250) erros.altura = "Entre 100 e 250 cm";
  const peso = Number(campos.peso.replace(",", "."));
  if (!campos.peso) erros.peso = "Peso obrigatório";
  else if (isNaN(peso) || peso < 30 || peso > 200) erros.peso = "Entre 30 e 200 kg";
  if (!campos.modalidade) erros.modalidade = "Selecione uma modalidade";
  return erros;
}

export default function TelaCadastroAtleta() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [idade, setIdade] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const formularioCompleto = nome.trim().length >= 3 && Number(idade) >= 10 && Number(altura) >= 100 && Number(peso.replace(",", ".")) >= 30 && modalidade !== "";

  const handleCampo = (campo: string, valor: string, setter: (v: string) => void) => {
    setter(valor);
    if (tentouEnviar) setErros(validar({ nome: campo === "nome" ? valor : nome, idade: campo === "idade" ? valor : idade, altura: campo === "altura" ? valor : altura, peso: campo === "peso" ? valor : peso, modalidade }));
  };

  const handleSubmit = async () => {
    setTentouEnviar(true);
    const novosErros = validar({ nome, idade, altura, peso, modalidade });
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) { Alert.alert("Campos incompletos", "Preencha todos os campos obrigatórios corretamente.", [{ text: "OK" }]); return; }
    if (!email.trim() || !senha.trim()) { Alert.alert("E-mail e senha obrigatórios", "Informe e-mail e senha para criar sua conta.", [{ text: "OK" }]); return; }
    setCarregando(true);
    try {
      const result = await authAPI.cadastrarAtleta({ nome_completo: nome.trim(), email: email.trim().toLowerCase(), senha, id_perfil: 1 });
      const id_usuario = (result as any).id_usuario ?? (result as any).usuario?.id_usuario;
      if (id_usuario) {
        await perfilAPI.criarOuAtualizar(id_usuario, { altura_cm: Number(altura), peso_habitual_kg: Number(peso.replace(",", ".")), modalidade, nivel: 'AMADOR' }).catch(() => {});
      }
      Alert.alert("✅ Conta criada!", "Seu cadastro foi realizado. Faça login para continuar.", [{ text: "Fazer login", onPress: () => router.replace("/telaLogin") }]);
    } catch (err: any) {
      Alert.alert("Erro no cadastro", err.message ?? "Tente novamente mais tarde.", [{ text: "OK" }]);
    } finally { setCarregando(false); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ATLETA</Text>
        <TouchableOpacity style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.tag}>PROTOCOLO DE REGISTRO</Text>
        <Text style={styles.title}>Cadastro de{"\n"}Atleta</Text>
        <Text style={styles.subtitle}>Inicie sua jornada de alto rendimento. O mapeamento biomecânico e fisiológico começa com a precisão dos seus dados base.</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}><Text style={styles.infoIcon}>🔬</Text><View style={styles.infoTextContainer}><Text style={styles.infoTitle}>PRECISÃO LAB</Text><Text style={styles.infoDesc}>Dados utilizados para cálculo de taxa metabólica e sudorese.</Text></View></View>
          <View style={styles.infoRow}><Text style={styles.infoIcon}>🛡️</Text><View style={styles.infoTextContainer}><Text style={styles.infoTitle}>PRIVACIDADE</Text><Text style={styles.infoDesc}>Criptografia de nível médico para proteção de métricas sensíveis.</Text></View></View>
        </View>
        <View style={styles.form}>
          <CampoTexto label="Nome Completo" placeholder="Ex: Julian Arredondo" value={nome} onChangeText={(v) => handleCampo("nome", v, setNome)} erro={erros.nome} />
          <CampoTexto label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} erro={undefined} />
          <CampoTexto label="Senha" placeholder="Mínimo 6 caracteres" value={senha} onChangeText={setSenha} erro={undefined} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}><CampoTexto label="Idade" placeholder="00" value={idade} onChangeText={(v) => handleCampo("idade", v, setIdade)} keyboardType="numeric" erro={erros.idade} /></View>
            <View style={{ flex: 1 }}><CampoTexto label="Altura" placeholder="180" value={altura} onChangeText={(v) => handleCampo("altura", v, setAltura)} keyboardType="numeric" erro={erros.altura} suffix="CM" /></View>
          </View>
          <CampoTexto label="Peso Base" placeholder="72,5" value={peso} onChangeText={(v) => handleCampo("peso", v, setPeso)} keyboardType="decimal-pad" erro={erros.peso} suffix="KG" />
          <DropdownModalidade value={modalidade} onChange={(v) => { setModalidade(v); if (tentouEnviar) setErros(validar({ nome, idade, altura, peso, modalidade: v })); }} erro={erros.modalidade} />
          <BotaoPrimario label={carregando ? "CADASTRANDO..." : formularioCompleto ? "FINALIZAR REGISTRO →" : "PREENCHA OS CAMPOS"} onPress={handleSubmit} disabled={carregando} />
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 16 }}>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 13, fontFamily: 'SourceSans3_400Regular' }}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => router.push("/telaLogin")}><Text style={{ color: colors.primary, fontSize: 13, fontFamily: 'SourceSans3_700Bold' }}>Fazer login</Text></TouchableOpacity>
          </View>
          <Text style={styles.footerText}>AO PROSSEGUIR, VOCÊ CONCORDA COM NOSSOS{"\n"}PROTOCOLOS DE DADOS.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
