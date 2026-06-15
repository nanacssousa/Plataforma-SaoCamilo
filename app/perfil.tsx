// app/perfil.tsx
// Tela de Perfil — totalmente funcional com estado global persistido
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AtletaAvatar,
  AtletaAvatarMini,
} from "../src/components/shared/AtletaAvatar";
import { EditModal } from "../src/components/shared/EditModal";
import { ToastContainer } from "../src/components/shared/Toast";
import { colors } from "../src/constants/theme";
import { usePerformance } from "../src/hooks/usePerformance";
import {
  cancelAllNotifications,
  requestNotificationPermissions,
  schedulePreTreinoNotification,
} from "../src/notifications/notificationService";
import { authAPI, perfilAPI, usuarioAPI } from "../src/services/api";
import {
  pickFromCamera,
  pickFromGallery,
  removeProfilePhoto,
} from "../src/services/imageService";
import { useAppStore } from "../src/store/useAppStore";
import { styles } from "../src/styles/ProfileStyle";

// ─── Sub-components ───────────────────────────────────────────────────────────
const Divider = () => <View style={styles.divider} />;
const SectionLabel = ({ label }: { label: string }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const BiometricCard = ({
  label,
  value,
  unit,
  accentColor = colors.primary,
  onPress,
}: {
  label: string;
  value: string;
  unit: string;
  accentColor?: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.biometricCard}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={[styles.biometricAccent, { backgroundColor: accentColor }]} />
    <View style={styles.biometricContent}>
      <Text style={styles.biometricLabel}>{label}</Text>
      <Text style={styles.biometricValue}>
        {value}
        <Text style={styles.biometricUnit}> {unit}</Text>
      </Text>
    </View>
    {onPress && (
      <Text style={{ color: colors.primary, fontSize: 18, paddingRight: 4 }}>
        ›
      </Text>
    )}
  </TouchableOpacity>
);

// ─── Slider de meta diária ────────────────────────────────────────────────────
const HydrationSlider = ({
  value,
  onChange,
  onDragging,
  min = 1,
  max = 5,
}: {
  value: number;
  onChange: (v: number) => void;
  onDragging: (v: boolean) => void;
  min?: number;
  max?: number;
}) => {
  const trackWidth = useRef(0);
  const percent = ((value - min) / (max - min)) * 100;

  const calcValue = (locationX: number) => {
    const ratio = Math.min(Math.max(locationX / trackWidth.current, 0), 1);
    return Math.round((ratio * (max - min) + min) * 10) / 10;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e) => {
        onDragging(true);
        if (trackWidth.current > 0)
          onChange(calcValue(e.nativeEvent.locationX));
      },
      onPanResponderMove: (e) => {
        if (trackWidth.current > 0)
          onChange(calcValue(e.nativeEvent.locationX));
      },
      onPanResponderRelease: () => onDragging(false),
      onPanResponderTerminate: () => onDragging(false),
    }),
  ).current;

  return (
    <View>
      <View style={styles.metaRow}>
        <Text style={styles.settingTitle}>Meta Diária de Hidratação</Text>
        <Text style={styles.metaValue}>{value.toFixed(1)}L</Text>
      </View>
      <View
        style={styles.sliderTrack}
        onLayout={(e) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.sliderFill, { width: `${percent}%` }]} />
        <View
          style={[
            styles.sliderThumb,
            { left: `${Math.max(0, percent - 1.5)}%` },
          ]}
        />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>1.0 LITRO</Text>
        <Text style={styles.sliderLabel}>5.0 LITROS</Text>
      </View>
    </View>
  );
};

// ─── Barra de progresso diário ────────────────────────────────────────────────
const DailyProgressBar = () => {
  const { state } = useAppStore();
  const { daily } = state;
  const pct = Math.min(
    100,
    Math.round((daily.consumidoML / daily.metaML) * 100),
  );
  const restante = Math.max(0, daily.metaML - daily.consumidoML);
  return (
    <View style={{ marginTop: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text style={styles.settingSubtitle}>
          Hoje: {(daily.consumidoML / 1000).toFixed(1)}L consumido
        </Text>
        <Text
          style={[
            styles.settingSubtitle,
            { color: pct >= 100 ? colors.success : colors.primary },
          ]}
        >
          {pct}%
        </Text>
      </View>
      <View
        style={{
          height: 6,
          backgroundColor: colors.outlineVariant,
          borderRadius: 3,
        }}
      >
        <View
          style={{
            height: 6,
            width: `${pct}%`,
            backgroundColor: pct >= 100 ? colors.success : colors.primary,
            borderRadius: 3,
          }}
        />
      </View>
      {pct < 100 && (
        <Text style={[styles.settingSubtitle, { marginTop: 4 }]}>
          Faltam {(restante / 1000).toFixed(1)}L para sua meta
        </Text>
      )}
    </View>
  );
};

// ─── Confirm Logout Modal ─────────────────────────────────────────────────────
const ConfirmLogoutModal = ({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!visible) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
      }}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
          width: "82%",
          maxWidth: 320,
          elevation: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "SourceSans3_700Bold",
            fontSize: 16,
            color: colors.onSurface,
            marginBottom: 8,
          }}
        >
          Encerrar sessão
        </Text>
        <Text
          style={{
            fontFamily: "SourceSans3_400Regular",
            fontSize: 14,
            color: colors.onSurfaceVariant,
            marginBottom: 24,
          }}
        >
          Deseja sair da conta?
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: colors.outlineVariant,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "SourceSans3_700Bold",
                fontSize: 13,
                color: colors.onSurface,
              }}
            >
              CANCELAR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 10,
              backgroundColor: colors.primary,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "SourceSans3_700Bold",
                fontSize: 13,
                color: colors.white,
              }}
            >
              SAIR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
type TabKey = "sessao" | "historico" | "perfil";
const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "sessao", label: "SESSÃO", icon: "⏱" },
  { key: "historico", label: "HISTÓRICO", icon: "📊" },
  { key: "perfil", label: "PERFIL", icon: "👤" },
];
const TAB_ROUTES: Record<TabKey, string> = {
  sessao: "/telaAtleta",
  historico: "/historico",
  perfil: "/perfil",
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
type EditField =
  | "nome"
  | "posicao"
  | "categoria"
  | "peso"
  | "altura"
  | "idade"
  | null;

export default function ProfileScreen() {
  const { state, setPerfil, setFotoUri, setSettings, showToast, logout } =
    useAppStore();
  const { perfil, settings, daily } = state;
  const performance = usePerformance();

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [editField, setEditField] = useState<EditField>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (state.isInitialized) {
      carregarPerfil();
    }
  }, [state.isInitialized]);

  const calcularIdade = (dataNascimento?: string | null) => {
    if (!dataNascimento) return perfil.idade;
    const nascimento = new Date(dataNascimento);
    if (isNaN(nascimento.getTime())) return perfil.idade;
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesDiff = hoje.getMonth() - nascimento.getMonth();
    if (
      mesDiff < 0 ||
      (mesDiff === 0 && hoje.getDate() < nascimento.getDate())
    ) {
      idade -= 1;
    }
    return idade;
  };

  const carregarPerfil = async () => {
    try {
      const usuarioLocal = await authAPI.getUsuarioLocal();
      if (!usuarioLocal) return;

      let usuarioCompleto = usuarioLocal;
      try {
        usuarioCompleto = await usuarioAPI.getById(usuarioLocal.id_usuario);
      } catch (error: any) {
        console.log("Não foi possível buscar usuário completo:", error.message ?? error);
      }

      const perfilBanco = await perfilAPI.buscarPorUsuario(usuarioLocal.id_usuario);
      console.log("carregarPerfil -> usuarioLocal", usuarioLocal);
      console.log("carregarPerfil -> usuarioCompleto", usuarioCompleto);
      console.log("carregarPerfil -> perfilBanco", perfilBanco);
      const idadeCalculada = calcularIdade(usuarioCompleto.data_nascimento);

      setPerfil({
        nome: usuarioCompleto.nome_completo,
        peso:
          perfilBanco?.peso_habitual_kg !== null &&
          perfilBanco?.peso_habitual_kg !== undefined
            ? Number(perfilBanco.peso_habitual_kg)
            : perfil.peso,
        altura:
          perfilBanco?.altura_cm !== null &&
          perfilBanco?.altura_cm !== undefined
            ? Number(perfilBanco.altura_cm)
            : perfil.altura,
        posicao: perfilBanco?.modalidade ?? perfil.posicao,
        categoria: perfilBanco?.nivel ?? perfil.categoria,
        idade: idadeCalculada,
      });
    } catch (error: any) {
      console.log("Erro ao carregar perfil:", error.message ?? error);
    }
  };

  // ─── Foto ─────────────────────────────────────────────────────────────────
  const handleFotoPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancelar",
            "Tirar foto",
            "Escolher da galeria",
            "Remover foto",
          ],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 3,
        },
        async (idx) => {
          if (idx === 1) await doPickCamera();
          if (idx === 2) await doPickGallery();
          if (idx === 3) {
            await removeProfilePhoto();
            setFotoUri(null);
            showToast("Foto removida");
          }
        },
      );
    } else {
      // Android: usa modal inline para evitar problemas com Alert
      // (mantido simples — pick direto da galeria)
      doPickGallery();
    }
  };

  const doPickGallery = async () => {
    setUploadingPhoto(true);
    const result = await pickFromGallery();
    setUploadingPhoto(false);
    if (result.success && result.uri) {
      setFotoUri(result.uri);
      showToast("Foto atualizada com sucesso!");
    } else if (result.error && result.error !== "Cancelado") {
      showToast(result.error, "error");
    }
  };

  const doPickCamera = async () => {
    setUploadingPhoto(true);
    const result = await pickFromCamera();
    setUploadingPhoto(false);
    if (result.success && result.uri) {
      setFotoUri(result.uri);
      showToast("Foto atualizada com sucesso!");
    } else if (result.error && result.error !== "Cancelado") {
      showToast(result.error, "error");
    }
  };

  // ─── Notificações ─────────────────────────────────────────────────────────
  const handleToggleLembretes = async (val: boolean) => {
    if (val) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        showToast("Permissão de notificações negada", "error");
        return;
      }
      await schedulePreTreinoNotification(settings.minutosAntesTreino);
      showToast("Lembretes ativados!");
    } else {
      await cancelAllNotifications();
      showToast("Lembretes desativados");
    }
    setSettings({ lembretesPreTreino: val });
  };

  const handleToggleDesidratacao = (val: boolean) => {
    setSettings({ notifDesidratacaoCritica: val });
    showToast(
      val ? "Alertas de desidratação ativados!" : "Alertas desativados",
    );
  };

  // ─── Meta diária ──────────────────────────────────────────────────────────
  const handleMetaChange = (val: number) => {
    setSettings({ metaDiariaL: val });
  };

  const handleMetaRelease = (val: number) => {
    setSettings({ metaDiariaL: val });
    showToast(`Meta atualizada: ${val.toFixed(1)}L`);
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const doLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    router.replace("/telaLogin");
  };

  // ─── Validações para campos ───────────────────────────────────────────────
  const validatePeso = (v: string) => {
    const n = parseFloat(v.replace(",", "."));
    if (isNaN(n) || n <= 0) return "Peso deve ser maior que 0";
    if (n > 300) return "Peso inválido";
    return null;
  };
  const validateAltura = (v: string) => {
    const n = parseFloat(v.replace(",", "."));
    if (isNaN(n) || n <= 0) return "Altura deve ser maior que 0";
    if (n < 50 || n > 250) return "Altura inválida (50–250 cm)";
    return null;
  };
  const validateIdade = (v: string) => {
    const n = parseInt(v);
    if (isNaN(n)) return "Idade inválida";
    if (n < 10 || n > 60) return "Idade deve estar entre 10 e 60 anos";
    return null;
  };
  const validateNome = (v: string) => {
    if (v.trim().length < 2) return "Nome muito curto";
    return null;
  };

  const handleSaveField = (field: EditField, value: string) => {
    if (!field) return;
    if (field === "nome") {
      setPerfil({ nome: value });
      showToast("Nome atualizado!");
    } else if (field === "posicao") {
      setPerfil({ posicao: value });
      showToast("Posição atualizada!");
    } else if (field === "categoria") {
      setPerfil({ categoria: value });
      showToast("Categoria atualizada!");
    } else if (field === "peso") {
      setPerfil({ peso: parseFloat(value.replace(",", ".")) });
      showToast("Peso atualizado!");
    } else if (field === "altura") {
      setPerfil({ altura: parseFloat(value.replace(",", ".")) });
      showToast("Altura atualizada!");
    } else if (field === "idade") {
      setPerfil({ idade: parseInt(value) });
      showToast("Idade atualizada!");
    }
    setEditField(null);
  };

  const getEditConfig = () => {
    if (!editField)
      return {
        title: "",
        value: "",
        placeholder: "",
        keyboardType: "default" as const,
      };
    const map: Record<string, any> = {
      nome: {
        title: "Editar Nome",
        value: perfil.nome,
        placeholder: "Nome completo",
        keyboardType: "default",
      },
      posicao: {
        title: "Editar Posição",
        value: perfil.posicao,
        placeholder: "Ex: Volante",
        keyboardType: "default",
      },
      categoria: {
        title: "Editar Categoria",
        value: perfil.categoria,
        placeholder: "Ex: Sub-20",
        keyboardType: "default",
      },
      peso: {
        title: "Editar Peso",
        value: String(perfil.peso),
        placeholder: "78.4",
        keyboardType: "numeric",
        unit: "kg",
        validate: validatePeso,
      },
      altura: {
        title: "Editar Altura",
        value: String(perfil.altura),
        placeholder: "182",
        keyboardType: "numeric",
        unit: "cm",
        validate: validateAltura,
      },
      idade: {
        title: "Editar Idade",
        value: String(perfil.idade),
        placeholder: "19",
        keyboardType: "numeric",
        unit: "anos",
        validate: validateIdade,
      },
    };
    return map[editField] ?? { title: "", value: "", placeholder: "" };
  };

  const editConfig = getEditConfig();

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ToastContainer />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>ATLETA</Text>
        <TouchableOpacity
          style={styles.headerAvatar}
          activeOpacity={0.7}
          onPress={() => router.push("/perfil")}
        >
          <AtletaAvatarMini size={36} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        {/* Avatar + Nome */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <AtletaAvatar size={90} borderRadius={12} fontSize={24} />
            <TouchableOpacity
              style={styles.avatarEditButton}
              onPress={handleFotoPress}
              activeOpacity={0.7}
            >
              {uploadingPhoto ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.avatarEditIcon}>✏️</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setEditField("nome")}
            activeOpacity={0.7}
          >
            <Text style={styles.playerName}>{perfil.nome}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEditField("posicao")}
            activeOpacity={0.7}
          >
            <Text style={styles.playerRole}>
              {perfil.posicao.toUpperCase()} • {perfil.categoria.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {/* Dados Biométricos */}
        <SectionLabel label="DADOS BIOMÉTRICOS" />
        <BiometricCard
          label="PESO DE REFERÊNCIA"
          value={Number(perfil.peso).toFixed(1)}
          unit="kg"
          accentColor={colors.primary}
          onPress={() => setEditField("peso")}
        />
        <BiometricCard
          label="IDADE"
          value={String(Number(perfil.idade) || 0)}
          unit="anos"
          accentColor={colors.secondary}
          onPress={() => setEditField("idade")}
        />
        <BiometricCard
          label="ALTURA"
          value={(Number(perfil.altura) / 100).toFixed(2)}
          unit="m"
          accentColor={colors.tertiary}
          onPress={() => setEditField("altura")}
        />

        <Divider />

        {/* Configurações de Hidratação */}
        <View style={styles.configSection}>
          <SectionLabel label="CONFIGURAÇÕES DE HIDRATAÇÃO" />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Lembretes Pré-Treino</Text>
              <Text style={styles.settingSubtitle}>
                Alertas {settings.minutosAntesTreino} min antes da atividade
              </Text>
            </View>
            <Switch
              value={settings.lembretesPreTreino}
              onValueChange={handleToggleLembretes}
              trackColor={{
                false: colors.outlineVariant,
                true: colors.primary,
              }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.outlineVariant}
            />
          </View>

          <View style={styles.settingRowSeparator} />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                Notificações de Desidratação Crítica
              </Text>
              <Text style={styles.settingSubtitle}>
                Alerta quando ≥{settings.limiteDesidratacaoPct}% perda de massa
              </Text>
            </View>
            <Switch
              value={settings.notifDesidratacaoCritica}
              onValueChange={handleToggleDesidratacao}
              trackColor={{
                false: colors.outlineVariant,
                true: colors.primary,
              }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.outlineVariant}
            />
          </View>

          <View style={styles.settingRowSeparator} />

          <HydrationSlider
            value={settings.metaDiariaL}
            onChange={handleMetaChange}
            onDragging={(dragging) => {
              setScrollEnabled(!dragging);
              if (!dragging) handleMetaRelease(settings.metaDiariaL);
            }}
          />

          <DailyProgressBar />
        </View>

        <Divider />

        {/* Performance Média */}
        <SectionLabel label="PERFORMANCE MÉDIA" />
        {performance.totalSessoes === 0 ? (
          <View
            style={{
              backgroundColor: colors.surfaceContainerLow,
              borderRadius: 10,
              padding: 16,
              marginBottom: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: "SourceSans3_400Regular",
                fontSize: 14,
              }}
            >
              Nenhuma sessão registrada ainda.{"\n"}Complete seu primeiro treino
              para ver sua performance.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.performanceCard}>
              <View style={styles.performanceIcon}>
                <Text style={styles.performanceEmoji}>💧</Text>
              </View>
              <View>
                <Text style={styles.performanceLabel}>TAXA SUDORESE MÉDIA</Text>
                <Text style={styles.performanceValue}>
                  {performance.taxaSudoroseMedia.toFixed(1)}
                  <Text style={styles.performanceUnit}> L/h</Text>
                </Text>
              </View>
            </View>
            <View style={styles.performanceCard}>
              <View style={styles.performanceIcon}>
                <Text style={styles.performanceEmoji}>⚡</Text>
              </View>
              <View>
                <Text style={styles.performanceLabel}>RECUPERAÇÃO MÉDIA</Text>
                <Text style={styles.performanceValue}>
                  {performance.recuperacaoMedia}
                  <Text style={styles.performanceUnit}>%</Text>
                </Text>
              </View>
            </View>
            <View style={[styles.performanceCard, { marginTop: 2 }]}>
              <View style={styles.performanceIcon}>
                <Text style={styles.performanceEmoji}>📊</Text>
              </View>
              <View>
                <Text style={styles.performanceLabel}>SESSÕES REGISTRADAS</Text>
                <Text style={styles.performanceValue}>
                  {performance.totalSessoes}
                  <Text style={styles.performanceUnit}> sessões</Text>
                </Text>
              </View>
            </View>
          </>
        )}

        <Divider />

        {/* Botões */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => setEditField("nome")}
        >
          <Text style={styles.btnPrimaryText}>
            👤 EDITAR DADOS PROFISSIONAIS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={handleLogout}>
          <Text style={styles.btnSecondaryText}>↩ ENCERRAR SESSÃO</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomTabBar active="perfil" />

      {/* Modal de edição */}
      <EditModal
        visible={editField !== null}
        title={editConfig.title}
        value={editConfig.value}
        placeholder={editConfig.placeholder}
        keyboardType={(editConfig as any).keyboardType}
        unit={(editConfig as any).unit}
        validate={(editConfig as any).validate}
        onSave={(val) => handleSaveField(editField, val)}
        onClose={() => setEditField(null)}
      />

      {/* Modal de confirmação de logout (substitui Alert nativo) */}
      <ConfirmLogoutModal
        visible={showLogoutConfirm}
        onConfirm={doLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </SafeAreaView>
  );
}
