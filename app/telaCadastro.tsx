// app/telaCadastro.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BotaoPrimario,
  CampoTexto,
  DropdownModalidade,
} from "../src/components/CadastroAtletaComponents";
import { colors } from "../src/constants/theme";
import { styles } from "../src/styles/cadastroAtletaStyle";

// ─── Validações ───────────────────────────────────────────────────────────────
function validar(campos: {
  nome: string;
  idade: string;
  altura: string;
  peso: string;
  modalidade: string;
}) {
  const erros: Record<string, string> = {};

  if (!campos.nome.trim())
    erros.nome = "Nome obrigatório";
  else if (campos.nome.trim().length < 3)
    erros.nome = "Mínimo 3 caracteres";

  const idade = Number(campos.idade);
  if (!campos.idade)
    erros.idade = "Idade obrigatória";
  else if (isNaN(idade) || idade < 10 || idade > 80)
    erros.idade = "Entre 10 e 80 anos";

  const altura = Number(campos.altura);
  if (!campos.altura)
    erros.altura = "Altura obrigatória";
  else if (isNaN(altura) || altura < 100 || altura > 250)
    erros.altura = "Entre 100 e 250 cm";

  const peso = Number(campos.peso.replace(",", "."));
  if (!campos.peso)
    erros.peso = "Peso obrigatório";
  else if (isNaN(peso) || peso < 30 || peso > 200)
    erros.peso = "Entre 30 e 200 kg";

  if (!campos.modalidade)
    erros.modalidade = "Selecione uma modalidade";

  return erros;
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function TelaCadastroAtleta() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [modalidade, setModalidade] = useState("");

  const [erros, setErros] = useState<Record<string, string>>({});
  const [tentouEnviar, setTentouEnviar] = useState(false);

  const formularioCompleto =
    nome.trim().length >= 3 &&
    Number(idade) >= 10 &&
    Number(altura) >= 100 &&
    Number(peso.replace(",", ".")) >= 30 &&
    modalidade !== "";

  const handleCampo = (
    campo: string,
    valor: string,
    setter: (v: string) => void
  ) => {
    setter(valor);
    // Revalida em tempo real só se já tentou enviar
    if (tentouEnviar) {
      const novos = validar({
        nome: campo === "nome" ? valor : nome,
        idade: campo === "idade" ? valor : idade,
        altura: campo === "altura" ? valor : altura,
        peso: campo === "peso" ? valor : peso,
        modalidade: campo === "modalidade" ? valor : modalidade,
      });
      setErros(novos);
    }
  };

  const handleSubmit = () => {
    setTentouEnviar(true);
    const novosErros = validar({ nome, idade, altura, peso, modalidade });
    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      Alert.alert(
        "Campos incompletos",
        "Preencha todos os campos obrigatórios corretamente.",
        [{ text: "OK" }]
      );
      return;
    }

    // Aqui chamaria a API — por ora avança
    router.push("/telaAtleta");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ATLETA</Text>
        <TouchableOpacity style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>GM</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tag / Title / Subtitle */}
        <Text style={styles.tag}>PROTOCOLO DE REGISTRO</Text>
        <Text style={styles.title}>Cadastro de{"\n"}Atleta</Text>
        <Text style={styles.subtitle}>
          Inicie sua jornada de alto rendimento. O mapeamento biomecânico e
          fisiológico começa com a precisão dos seus dados base.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🔬</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>PRECISÃO LAB</Text>
              <Text style={styles.infoDesc}>
                Dados utilizados para cálculo de taxa metabólica e sudorese.
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>PRIVACIDADE</Text>
              <Text style={styles.infoDesc}>
                Criptografia de nível médico para proteção de métricas
                sensíveis.
              </Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <CampoTexto
            label="Nome Completo"
            placeholder="Ex: Julian Arredondo"
            value={nome}
            onChangeText={(v) => handleCampo("nome", v, setNome)}
            erro={erros.nome}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <CampoTexto
                label="Idade"
                placeholder="00"
                value={idade}
                onChangeText={(v) => handleCampo("idade", v, setIdade)}
                keyboardType="numeric"
                erro={erros.idade}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CampoTexto
                label="Altura"
                placeholder="180"
                value={altura}
                onChangeText={(v) => handleCampo("altura", v, setAltura)}
                keyboardType="numeric"
                erro={erros.altura}
                suffix="CM"
              />
            </View>
          </View>

          <CampoTexto
            label="Peso Base"
            placeholder="72,5"
            value={peso}
            onChangeText={(v) => handleCampo("peso", v, setPeso)}
            keyboardType="decimal-pad"
            erro={erros.peso}
            suffix="KG"
          />

          <DropdownModalidade
            value={modalidade}
            onChange={(v) => {
              setModalidade(v);
              if (tentouEnviar) {
                const novos = validar({ nome, idade, altura, peso, modalidade: v });
                setErros(novos);
              }
            }}
            erro={erros.modalidade}
          />

          <BotaoPrimario
            label={formularioCompleto ? "FINALIZAR REGISTRO →" : "PREENCHA OS CAMPOS"}
            onPress={handleSubmit}
            disabled={tentouEnviar && !formularioCompleto}
          />

          <Text style={styles.footerText}>
            AO PROSSEGUIR, VOCÊ CONCORDA COM NOSSOS{"\n"}PROTOCOLOS DE DADOS.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}