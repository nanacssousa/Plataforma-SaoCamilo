// app/telaLogin.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { BotaoLogin, CampoLogin, Divisor, InfoCard } from "../src/components/LoginComponents";
import { colors } from "../src/constants/theme";
import { loginStyles } from "../src/styles/LoginStyle";
import { authAPI } from "../src/services/api";
import { useAppStore } from "../src/store/useAppStore";

function validar(campos: { email: string; senha: string }) {
  const erros: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!campos.email.trim()) erros.email = "E-mail obrigatório";
  else if (!emailRegex.test(campos.email.trim())) erros.email = "E-mail inválido";
  if (!campos.senha) erros.senha = "Senha obrigatória";
  else if (campos.senha.length < 6) erros.senha = "Mínimo 6 caracteres";
  return erros;
}

export default function TelaLogin() {
  const router = useRouter();
  const { dispatch, setPerfil, showToast } = useAppStore();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleCampo = (campo: "email" | "senha", valor: string, setter: (v: string) => void) => {
    setter(valor);
    if (tentouEnviar) setErros(validar({ email: campo === "email" ? valor : email, senha: campo === "senha" ? valor : senha }));
  };

  const handleSubmit = async () => {
    setTentouEnviar(true);
    const novosErros = validar({ email, senha });
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) { Alert.alert("Campos inválidos", "Verifique os campos e tente novamente.", [{ text: "OK" }]); return; }
    setCarregando(true);
    try {
      const data = await authAPI.login(email.trim().toLowerCase(), senha);
      await authAPI.salvarToken(data.token, data.usuario);
      dispatch({ type: 'SET_IDS_BACKEND', payload: { id: data.usuario.id_usuario, id_perfil: data.usuario.id_perfil } });
      setPerfil({ id: String(data.usuario.id_usuario), nome: data.usuario.nome_completo, email: data.usuario.email });
      showToast(`Bem-vindo, ${data.usuario.nome_completo.split(' ')[0]}! 👋`);
      const { id_perfil } = data.usuario;
      if (id_perfil === 1) router.replace("/telaAtleta");
      else if (id_perfil === 2) router.replace("/painelnutricionista");
      else if (id_perfil === 5) router.replace("/admsistema");
      else router.replace("/telaInicialProfissional");
    } catch (err: any) {
      Alert.alert("Falha na autenticação", err.message ?? "Verifique suas credenciais e tente novamente.", [{ text: "OK" }]);
    } finally { setCarregando(false); }
  };

  return (
    <SafeAreaView style={loginStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={loginStyles.header}>
        <TouchableOpacity style={loginStyles.headerVoltar} onPress={() => router.back()}>
          <Text style={loginStyles.headerVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={loginStyles.headerTitle}>PLATAFORMA</Text>
      </View>
      <ScrollView contentContainerStyle={loginStyles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={loginStyles.tag}>ACESSO SEGURO</Text>
        <Text style={loginStyles.title}>Entrar na{"\n"}Plataforma</Text>
        <Text style={loginStyles.subtitle}>Autentique-se para acessar seus dados clínicos, sessões de treino e métricas de hidratação em tempo real.</Text>
        <InfoCard icone="🔐" titulo="SESSÃO PROTEGIDA" descricao="Seus dados clínicos são criptografados e protegidos por protocolo de segurança médica." />
        <View style={loginStyles.form}>
          <CampoLogin label="E-mail" placeholder="seu@email.com" value={email} onChangeText={(v) => handleCampo("email", v, setEmail)} keyboardType="email-address" erro={erros.email} />
          <CampoLogin label="Senha" placeholder="••••••••" value={senha} onChangeText={(v) => handleCampo("senha", v, setSenha)} secureTextEntry erro={erros.senha} />
          <TouchableOpacity style={loginStyles.esqueciBtn} onPress={() => Alert.alert("Recuperar senha", "Em breve disponível. Contate o administrador do sistema.", [{ text: "OK" }])}>
            <Text style={loginStyles.esqueciTexto}>Esqueci minha senha</Text>
          </TouchableOpacity>
          <BotaoLogin label="ENTRAR →" onPress={handleSubmit} carregando={carregando} disabled={tentouEnviar && Object.keys(erros).length > 0} />
          <Divisor />
          <View style={loginStyles.cadastroRow}>
            <Text style={loginStyles.cadastroTexto}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push("/telaCadastro")}>
              <Text style={loginStyles.cadastroLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>
          <Text style={loginStyles.footerText}>AO ACESSAR, VOCÊ CONFIRMA QUE ESTÁ DE ACORDO COM OS{"\n"}PROTOCOLOS DE DADOS E PRIVACIDADE.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
