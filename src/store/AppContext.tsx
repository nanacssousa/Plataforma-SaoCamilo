// src/store/AppContext.tsx
// Estado global da aplicação via Context API

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AtletaProfile,
  DailyProgress,
  HydrationSettings,
  IngestaoRegistro,
  PerformanceStats,
  SessaoTreino,
  ToastMessage,
} from '../types';
import {
  addIngestaoHoje,
  calcularPerformanceMedia,
  clearAuthData,
  getDefaultProfile,
  loadAuthData,
  loadDailyProgress,
  loadHydrationSettings,
  loadProfile,
  loadSessoes,
  saveAuthData,
  saveHydrationSettings,
  saveProfile,
  saveSessao,
} from '../services/storageService';

// ─── Types do Context ─────────────────────────────────────────────────────────

interface AppState {
  // Auth
  token: string | null;
  authUser: Record<string, unknown> | null;
  isAuthenticated: boolean;

  // Perfil
  profile: AtletaProfile | null;
  profileLoading: boolean;

  // Configurações
  settings: HydrationSettings | null;

  // Hidratação diária
  dailyProgress: DailyProgress | null;

  // Sessões
  sessoes: SessaoTreino[];
  sessaoAtiva: SessaoTreino | null;

  // Performance
  performance: PerformanceStats | null;

  // UI
  toasts: ToastMessage[];
  appReady: boolean;
}

interface AppActions {
  // Auth
  login: (token: string, usuario: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;

  // Perfil
  updateProfile: (fields: Partial<AtletaProfile>) => Promise<void>;
  setProfilePhoto: (uri: string | null) => Promise<void>;

  // Configurações
  updateSettings: (fields: Partial<HydrationSettings>) => Promise<void>;

  // Hidratação
  adicionarIngestao: (registro: IngestaoRegistro) => Promise<void>;
  atualizarMetaDiaria: (litros: number) => Promise<void>;

  // Sessões
  iniciarSessao: (sessao: Omit<SessaoTreino, 'id' | 'concluida'>) => Promise<SessaoTreino>;
  atualizarSessaoAtiva: (fields: Partial<SessaoTreino>) => Promise<void>;
  concluirSessao: (campos: Partial<SessaoTreino>) => Promise<SessaoTreino | null>;
  carregarSessoes: () => Promise<void>;

  // UI
  showToast: (tipo: ToastMessage['tipo'], mensagem: string, duracao?: number) => void;
  dismissToast: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<(AppState & AppActions) | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    token: null,
    authUser: null,
    isAuthenticated: false,
    profile: null,
    profileLoading: true,
    settings: null,
    dailyProgress: null,
    sessoes: [],
    sessaoAtiva: null,
    performance: null,
    toasts: [],
    appReady: false,
  });

  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ─── Inicialização ──────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const [authData, profileData, settingsData, sessoesData, dailyData] =
          await Promise.all([
            loadAuthData(),
            loadProfile(),
            loadHydrationSettings(),
            loadSessoes(),
            loadDailyProgress(),
          ]);

        const profile = profileData ?? (await getDefaultProfile());
        const perf = calcularPerformanceMedia(sessoesData);

        setState((prev) => ({
          ...prev,
          token: authData.token,
          authUser: authData.usuario,
          isAuthenticated: !!authData.token,
          profile,
          profileLoading: false,
          settings: settingsData,
          sessoes: sessoesData,
          dailyProgress: dailyData,
          performance: { ...perf, calculadoEm: Date.now() },
          appReady: true,
        }));
      } catch (e) {
        console.warn('[AppContext] Erro na inicialização:', e);
        setState((prev) => ({ ...prev, appReady: true, profileLoading: false }));
      }
    })();
  }, []);

  // ─── Auth ───────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (token: string, usuario: Record<string, unknown>) => {
      await saveAuthData(token, usuario);

      // Sincronizar perfil com dados do backend
      const savedProfile = await loadProfile();
      const mergedProfile: AtletaProfile = savedProfile ?? {
        id: String(usuario.id_usuario ?? 'local'),
        nome: String(usuario.nome_completo ?? 'Atleta'),
        iniciais: getInitials(String(usuario.nome_completo ?? 'AT')),
        posicao: '',
        categoria: '',
        peso: 0,
        altura: 0,
        idade: 0,
        fotoUri: null,
        updatedAt: Date.now(),
      };

      if (!savedProfile) await saveProfile(mergedProfile);

      setState((prev) => ({
        ...prev,
        token,
        authUser: usuario,
        isAuthenticated: true,
        profile: mergedProfile,
      }));
    },
    []
  );

  const logout = useCallback(async () => {
    await clearAuthData();
    setState((prev) => ({
      ...prev,
      token: null,
      authUser: null,
      isAuthenticated: false,
    }));
  }, []);

  // ─── Perfil ──────────────────────────────────────────────────────────────────

  const updateProfile = useCallback(
    async (fields: Partial<AtletaProfile>) => {
      setState((prev) => {
        if (!prev.profile) return prev;
        const updated = { ...prev.profile, ...fields, updatedAt: Date.now() };
        // Recalcular iniciais se nome mudou
        if (fields.nome) updated.iniciais = getInitials(fields.nome);
        saveProfile(updated);
        return { ...prev, profile: updated };
      });
    },
    []
  );

  const setProfilePhoto = useCallback(async (uri: string | null) => {
    setState((prev) => {
      if (!prev.profile) return prev;
      const updated = { ...prev.profile, fotoUri: uri, updatedAt: Date.now() };
      saveProfile(updated);
      return { ...prev, profile: updated };
    });
  }, []);

  // ─── Configurações ───────────────────────────────────────────────────────────

  const updateSettings = useCallback(
    async (fields: Partial<HydrationSettings>) => {
      setState((prev) => {
        const current = prev.settings ?? {
          lembretesPreTreino: true,
          minutosAntesLembrete: 30,
          notifDesidratacao: true,
          limiteDesidratacaoCritica: 2.0,
          metaDiariaLitros: 3.5,
          updatedAt: Date.now(),
        };
        const updated = { ...current, ...fields, updatedAt: Date.now() };
        saveHydrationSettings(updated);
        return { ...prev, settings: updated };
      });
    },
    []
  );

  // ─── Hidratação Diária ───────────────────────────────────────────────────────

  const adicionarIngestao = useCallback(
    async (registro: IngestaoRegistro) => {
      const metaMl = (state.settings?.metaDiariaLitros ?? 3.5) * 1000;
      const updated = await addIngestaoHoje(registro, metaMl);
      setState((prev) => ({ ...prev, dailyProgress: updated }));
    },
    [state.settings?.metaDiariaLitros]
  );

  const atualizarMetaDiaria = useCallback(async (litros: number) => {
    await updateSettings({ metaDiariaLitros: litros });
    setState((prev) => {
      if (!prev.dailyProgress) return prev;
      const updated = { ...prev.dailyProgress, metaMl: litros * 1000 };
      return { ...prev, dailyProgress: updated };
    });
  }, [updateSettings]);

  // ─── Sessões ─────────────────────────────────────────────────────────────────

  const iniciarSessao = useCallback(
    async (dados: Omit<SessaoTreino, 'id' | 'concluida'>): Promise<SessaoTreino> => {
      const sessao: SessaoTreino = {
        ...dados,
        id: 'sessao-' + Date.now(),
        concluida: false,
      };
      await saveSessao(sessao);
      setState((prev) => ({
        ...prev,
        sessaoAtiva: sessao,
        sessoes: [sessao, ...prev.sessoes],
      }));
      return sessao;
    },
    []
  );

  const atualizarSessaoAtiva = useCallback(
    async (fields: Partial<SessaoTreino>) => {
      setState((prev) => {
        if (!prev.sessaoAtiva) return prev;
        const updated = { ...prev.sessaoAtiva, ...fields };
        saveSessao(updated);
        return { ...prev, sessaoAtiva: updated };
      });
    },
    []
  );

  const concluirSessao = useCallback(
    async (campos: Partial<SessaoTreino>): Promise<SessaoTreino | null> => {
      return new Promise((resolve) => {
        setState((prev) => {
          if (!prev.sessaoAtiva) { resolve(null); return prev; }
          const concluida = { ...prev.sessaoAtiva, ...campos, concluida: true };
          saveSessao(concluida);
          const sessoes = prev.sessoes.map((s) =>
            s.id === concluida.id ? concluida : s
          );
          const perf = calcularPerformanceMedia(sessoes);
          resolve(concluida);
          return {
            ...prev,
            sessaoAtiva: null,
            sessoes,
            performance: { ...perf, calculadoEm: Date.now() },
          };
        });
      });
    },
    []
  );

  const carregarSessoes = useCallback(async () => {
    const sessoes = await loadSessoes();
    const perf = calcularPerformanceMedia(sessoes);
    setState((prev) => ({
      ...prev,
      sessoes,
      performance: { ...perf, calculadoEm: Date.now() },
    }));
  }, []);

  // ─── Toasts ──────────────────────────────────────────────────────────────────

  const showToast = useCallback(
    (tipo: ToastMessage['tipo'], mensagem: string, duracao = 3000) => {
      const id = String(Date.now());
      setState((prev) => ({
        ...prev,
        toasts: [...prev.toasts, { id, tipo, mensagem, duracao }],
      }));

      const timer = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          toasts: prev.toasts.filter((t) => t.id !== id),
        }));
        toastTimers.current.delete(id);
      }, duracao);

      toastTimers.current.set(id, timer);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((t) => t.id !== id),
    }));
  }, []);

  // ─── Value ───────────────────────────────────────────────────────────────────

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    setProfilePhoto,
    updateSettings,
    adicionarIngestao,
    atualizarMetaDiaria,
    iniciarSessao,
    atualizarSessaoAtiva,
    concluirSessao,
    carregarSessoes,
    showToast,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
