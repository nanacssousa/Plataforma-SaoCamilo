// src/store/useAppStore.ts
// Estado global — mantém dados do atleta padrão + adiciona suporte a auth

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useRef,
} from "react";
import {
    dailyDB,
    historicoDB,
    perfilDB,
    sessaoAtivaDB,
    settingsDB,
} from "../database/storage";
import {
    clearAuthToken,
    getAuthToken,
    getAuthUser,
    salvarToken,
} from "../services/apiService";
import {
    AtletaProfile,
    DailyHydration,
    HydrationEntry,
    HydrationSettings,
    LogFluido,
    SessaoAtiva,
    ToastMessage,
} from "../types";

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: HydrationSettings = {
  metaDiariaL: 3.5,
  lembretesPreTreino: true,
  minutosAntesTreino: 30,
  notifDesidratacaoCritica: true,
  limiteDesidratacaoPct: 2.0,
};

// Mantém o atleta padrão original do projeto
const DEFAULT_PERFIL: AtletaProfile = {
  id: "1",
  nome: "Gabriel Mendonça",
  email: "gabriel@saocamilo.com",
  posicao: "Volante",
  categoria: "Sub-20",
  peso: 78.4,
  altura: 182,
  idade: 19,
  fotoUri: null,
  iniciais: "GM",
  criadoEm: new Date().toISOString(),
  atualizadoEm: new Date().toISOString(),
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizePerfilData(p: Partial<AtletaProfile>): Partial<AtletaProfile> {
  const normalized: Partial<AtletaProfile> = { ...p };
  if (normalized.peso !== undefined && normalized.peso !== null) {
    normalized.peso = Number(normalized.peso) || 0;
  }
  if (normalized.altura !== undefined && normalized.altura !== null) {
    normalized.altura = Number(normalized.altura) || 0;
  }
  if (normalized.idade !== undefined && normalized.idade !== null) {
    normalized.idade = Number(normalized.idade) || 0;
  }
  return normalized;
}

function calcIniciais(nome: string): string {
  if (!nome || !nome.trim()) return "?";
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface State {
  // Auth — campos novos, não quebram nada que já existia
  token: string | null;
  idUsuario: number | null;
  idPerfil: number | null;
  isAuthenticated: boolean;

  // Campos originais — sem alteração
  perfil: AtletaProfile;
  idUsuarioBackend: number | null;
  idPerfilBackend: number | null;
  idSessaoBackend: number | null;
  settings: HydrationSettings;
  historico: HydrationEntry[];
  daily: DailyHydration;
  sessaoAtiva: SessaoAtiva | null;
  isLoading: boolean;
  isInitialized: boolean;
  toast: ToastMessage | null;
}

type Action =
  | { type: "INIT"; payload: Partial<State> }
  | {
      type: "LOGIN";
      payload: {
        token: string;
        idUsuario: number;
        idPerfil: number;
        nome: string;
        email: string;
      };
    }
  | { type: "LOGOUT" }
  | { type: "SET_PERFIL"; payload: Partial<AtletaProfile> }
  | { type: "SET_FOTO"; payload: string | null }
  | { type: "SET_SETTINGS"; payload: Partial<HydrationSettings> }
  | { type: "SET_HISTORICO"; payload: HydrationEntry[] }
  | { type: "ADD_ENTRY"; payload: HydrationEntry }
  | { type: "REMOVE_ENTRY"; payload: string }
  | { type: "ADD_AGUA_HOJE"; payload: number }
  | { type: "SET_DAILY_TOTAL"; payload: number }
  | { type: "RESET_DAILY"; payload: DailyHydration }
  | { type: "INICIAR_SESSAO"; payload: SessaoAtiva }
  | { type: "ADICIONAR_FLUIDO"; payload: LogFluido }
  | { type: "ENCERRAR_SESSAO" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SHOW_TOAST"; payload: ToastMessage }
  | { type: "CLEAR_TOAST" }
  | { type: "SET_IDS_BACKEND"; payload: { idUsuario: number; idPerfil: number; idSessao?: number } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { ...state, ...action.payload, isInitialized: true };

    case "LOGIN": {
      const { token, idUsuario, idPerfil, nome, email } = action.payload;
      const iniciais = calcIniciais(nome);
      const perfil: AtletaProfile = {
        ...state.perfil, // mantém campos existentes (posicao, peso, etc.)
        ...normalizePerfilData({ nome, email }),
        id: String(idUsuario),
        nome,
        email,
        iniciais,
        atualizadoEm: new Date().toISOString(),
      };
      perfilDB.save(perfil);
      return {
        ...state,
        token,
        idUsuario,
        idPerfil,
        isAuthenticated: true,
        perfil,
        // Propaga para os campos Backend usados pelo Agente IA
        idUsuarioBackend: idUsuario,
        idPerfilBackend: idPerfil,
      };
    }

    case "LOGOUT":
      return {
        ...state,
        token: null,
        idUsuario: null,
        idPerfil: null,
        isAuthenticated: false,
        // Restaura atleta padrão ao fazer logout
        perfil: DEFAULT_PERFIL,
        historico: [],
        sessaoAtiva: null,
      };

    case "SET_PERFIL": {
      const nome = action.payload.nome ?? state.perfil.nome;
      const updated: AtletaProfile = {
        ...state.perfil,
        ...normalizePerfilData(action.payload),
        iniciais: calcIniciais(nome),
        atualizadoEm: new Date().toISOString(),
      };
      perfilDB.save(updated);
      return { ...state, perfil: updated };
    }

    case "SET_FOTO": {
      const updated = {
        ...state.perfil,
        fotoUri: action.payload,
        atualizadoEm: new Date().toISOString(),
      };
      perfilDB.save(updated);
      return { ...state, perfil: updated };
    }

    case "SET_SETTINGS": {
      const updated = { ...state.settings, ...action.payload };
      settingsDB.save(updated);
      return { ...state, settings: updated };
    }

    case "SET_HISTORICO":
      return { ...state, historico: action.payload };

    case "ADD_ENTRY": {
      const updated = [action.payload, ...state.historico];
      historicoDB.save(updated);
      return { ...state, historico: updated };
    }

    case "REMOVE_ENTRY": {
      const updated = state.historico.filter((e) => e.id !== action.payload);
      historicoDB.save(updated);
      return { ...state, historico: updated };
    }

    case "ADD_AGUA_HOJE": {
      const updated: DailyHydration = {
        ...state.daily,
        consumidoML: state.daily.consumidoML + action.payload,
        ultimaAtualizacao: new Date().toISOString(),
      };
      dailyDB.save(updated);
      return { ...state, daily: updated };
    }

    case "SET_DAILY_TOTAL": {
      const updated: DailyHydration = {
        ...state.daily,
        consumidoML: action.payload,
        ultimaAtualizacao: new Date().toISOString(),
      };
      dailyDB.save(updated);
      return { ...state, daily: updated };
    }

    case "RESET_DAILY":
      dailyDB.save(action.payload);
      return { ...state, daily: action.payload };

    case "INICIAR_SESSAO":
      sessaoAtivaDB.save(action.payload);
      return { ...state, sessaoAtiva: action.payload };

    case "ADICIONAR_FLUIDO": {
      if (!state.sessaoAtiva) return state;
      const updated: SessaoAtiva = {
        ...state.sessaoAtiva,
        aguaML: state.sessaoAtiva.aguaML + action.payload.ml,
        logFluidos: [...state.sessaoAtiva.logFluidos, action.payload],
      };
      sessaoAtivaDB.save(updated);
      return { ...state, sessaoAtiva: updated };
    }

    case "ENCERRAR_SESSAO":
      sessaoAtivaDB.clear();
      return { ...state, sessaoAtiva: null, idSessaoBackend: null };

    case "SET_IDS_BACKEND":
      return {
        ...state,
        idUsuarioBackend: action.payload.idUsuario,
        idPerfilBackend: action.payload.idPerfil,
        idSessaoBackend: action.payload.idSessao ?? state.idSessaoBackend,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SHOW_TOAST":
      return { ...state, toast: action.payload };

    case "CLEAR_TOAST":
      return { ...state, toast: null };

    default:
      return state;
  }
}

interface AppContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  setPerfil: (p: Partial<AtletaProfile>) => void;
  setFotoUri: (uri: string | null) => void;
  setSettings: (s: Partial<HydrationSettings>) => void;
  addEntry: (e: Omit<HydrationEntry, "id" | "dataISO">) => void;
  removeEntry: (id: string) => void;
  addAguaHoje: (ml: number) => void;
  iniciarSessao: (
    dados: Omit<SessaoAtiva, "id" | "iniciadaEm" | "aguaML" | "logFluidos">,
  ) => void;
  adicionarFluido: (ml: number, tipo: string) => void;
  encerrarSessao: (
    pesoPos: number,
    corUrina: number,
    sintomas: string[],
  ) => Promise<HydrationEntry | null>;
  login: (
    token: string,
    usuario: {
      id_usuario: number;
      id_perfil: number;
      nome_completo: string;
      email: string;
    },
  ) => Promise<void>;
  logout: () => Promise<void>;
  showToast: (msg: string, tipo?: ToastMessage["tipo"]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initialState: State = {
    token: null,
    idUsuario: null,
    idPerfil: null,
    isAuthenticated: false,
    perfil: DEFAULT_PERFIL,
    settings: DEFAULT_SETTINGS,
    idUsuarioBackend: null,
    idPerfilBackend: null,
    idSessaoBackend: null,
    historico: [],
    daily: {
      data: todayStr(),
      consumidoML: 0,
      metaML: DEFAULT_SETTINGS.metaDiariaL * 1000,
      ultimaAtualizacao: new Date().toISOString(),
    },
    sessaoAtiva: null,
    isLoading: true,
    isInitialized: false,
    toast: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref sempre atualizada com o estado mais recente — evita closure stale nos useCallbacks
  const stateRef = useRef<State>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Inicialização: restaura auth + dados locais
  useEffect(() => {
    (async () => {
      const [perfil, settings, historico, dailySaved, sessao, token, usuario] =
        await Promise.all([
          perfilDB.load(),
          settingsDB.load(),
          historicoDB.load(),
          dailyDB.load(),
          sessaoAtivaDB.load(),
          getAuthToken(),
          getAuthUser(),
        ]);

      const today = todayStr();
      const metaDiariaL = settings?.metaDiariaL ?? DEFAULT_SETTINGS.metaDiariaL;
      let daily: DailyHydration;
      if (dailySaved && dailySaved.data === today) {
        daily = {
          ...dailySaved,
          metaML:
            (settings?.metaDiariaL ?? DEFAULT_SETTINGS.metaDiariaL) * 1000,
        };
      } else {
        daily = {
          data: today,
          consumidoML: 0,
          metaML:
            (settings?.metaDiariaL ?? DEFAULT_SETTINGS.metaDiariaL) * 1000,
          ultimaAtualizacao: new Date().toISOString(),
        };
        dailyDB.save(daily);
      }

      dispatch({
        type: "INIT",
        payload: {
          // Se há perfil salvo usa ele, senão usa o padrão Gabriel
          perfil: {
            ...DEFAULT_PERFIL,
            ...(perfil ?? DEFAULT_PERFIL),
            ...normalizePerfilData(perfil ?? DEFAULT_PERFIL),
          },
          settings: settings ?? DEFAULT_SETTINGS,
          historico,
          daily,
          sessaoAtiva: sessao,
          isLoading: false,
          token: token ?? null,
          idUsuario: usuario ? Number(usuario.id_usuario) : null,
          idPerfil: usuario ? Number(usuario.id_perfil) : null,
          isAuthenticated: !!token,
        },
      });
    })();
  }, []);

  // ─── Auth helpers ────────────────────────────────────────────────────────────
  const login = useCallback(
    async (
      token: string,
      usuario: {
        id_usuario: number;
        id_perfil: number;
        nome_completo: string;
        email: string;
      },
    ) => {
      await salvarToken(token, usuario);
      dispatch({
        type: "LOGIN",
        payload: {
          token,
          idUsuario: usuario.id_usuario,
          idPerfil: usuario.id_perfil,
          nome: usuario.nome_completo,
          email: usuario.email,
        },
      });
    },
    [],
  );

  const logout = useCallback(async () => {
    await clearAuthToken();
    await Promise.all([perfilDB.clear(), sessaoAtivaDB.clear()]);
    dispatch({ type: "LOGOUT" });
  }, []);

  // ─── Helpers originais — sem alteração ──────────────────────────────────────
  const setPerfil = useCallback(
    (p: Partial<AtletaProfile>) => dispatch({ type: "SET_PERFIL", payload: p }),
    [],
  );
  const setFotoUri = useCallback(
    (uri: string | null) => dispatch({ type: "SET_FOTO", payload: uri }),
    [],
  );
  const setSettings = useCallback(
    (s: Partial<HydrationSettings>) =>
      dispatch({ type: "SET_SETTINGS", payload: s }),
    [],
  );
  const addAguaHoje = useCallback(
    (ml: number) => dispatch({ type: "ADD_AGUA_HOJE", payload: ml }),
    [],
  );

  const addEntry = useCallback((e: Omit<HydrationEntry, "id" | "dataISO">) => {
    const entry: HydrationEntry = {
      ...e,
      id: generateId(),
      dataISO: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ENTRY", payload: entry });
  }, []);

  const removeEntry = useCallback(
    (id: string) => dispatch({ type: "REMOVE_ENTRY", payload: id }),
    [],
  );

  const iniciarSessao = useCallback(
    (
      dados: Omit<SessaoAtiva, "id" | "iniciadaEm" | "aguaML" | "logFluidos">,
    ) => {
      const sessao: SessaoAtiva = {
        ...dados,
        id: generateId(),
        iniciadaEm: new Date().toISOString(),
        aguaML: 0,
        logFluidos: [],
      };
      dispatch({ type: "INICIAR_SESSAO", payload: sessao });
    },
    [],
  );

  const adicionarFluido = useCallback((ml: number, tipo: string) => {
    const fluido: LogFluido = {
      id: Date.now(),
      ml,
      tipo,
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ts: Date.now(),
    };
    dispatch({ type: "ADICIONAR_FLUIDO", payload: fluido });
    dispatch({ type: "ADD_AGUA_HOJE", payload: ml });
  }, []);

  const encerrarSessao = useCallback(
    async (
      pesoPos: number,
      corUrina: number,
      sintomas: string[],
    ): Promise<HydrationEntry | null> => {
      // Usa stateRef para garantir o estado mais recente (evita closure stale)
      const { sessaoAtiva } = stateRef.current;
      if (!sessaoAtiva) return null;

      const inicio = new Date(sessaoAtiva.iniciadaEm);
      const fim = new Date();
      const duracaoMin = Math.round((fim.getTime() - inicio.getTime()) / 60000);
      const duracaoH = duracaoMin / 60 || 1;
      const pesoPre = sessaoAtiva.pesoPre;
      const variacaoKg = Math.max(0, pesoPre - pesoPos);
      const desidratacaoPct =
        variacaoKg > 0
          ? parseFloat(((variacaoKg / pesoPre) * 100).toFixed(2))
          : 0;
      const taxaSudorese = parseFloat(
        ((variacaoKg * 1000 + sessaoAtiva.aguaML) / (duracaoH * 1000)).toFixed(
          2,
        ),
      );
      const recuperacaoPct = Math.min(
        100,
        Math.round((1 - desidratacaoPct / 4) * 100),
      );

      const entry: HydrationEntry = {
        id: generateId(),
        data: new Date().toISOString().split("T")[0],
        dataISO: new Date().toISOString(),
        tipoTreino: sessaoAtiva.tipoTreino,
        intensidade: sessaoAtiva.intensidade as HydrationEntry["intensidade"],
        duracaoMin,
        aguaConsumidaML: sessaoAtiva.aguaML,
        taxaSudorese,
        desidratacaoPct,
        recuperacaoPct,
        pesoPreKg: pesoPre,
        pesoPosKg: pesoPos,
        // Preserva dados do check-in para análise no histórico
        sintomasPre: sessaoAtiva.sintomasPre,
        corUrinaPre: sessaoAtiva.corUrinaPre,
        sede: sessaoAtiva.sede,
        logFluidos: sessaoAtiva.logFluidos,
      };

      dispatch({ type: "ADD_ENTRY", payload: entry });
      dispatch({ type: "ENCERRAR_SESSAO" });
      return entry;
    },
    [], // stateRef sempre atualizado, sem necessidade de [state] como dependência
  );

  const showToast = useCallback(
    (msg: string, tipo: ToastMessage["tipo"] = "success") => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      dispatch({ type: "SHOW_TOAST", payload: { msg, tipo } });
      toastTimer.current = setTimeout(
        () => dispatch({ type: "CLEAR_TOAST" }),
        3000,
      );
    },
    [],
  );

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        state,
        dispatch,
        setPerfil,
        setFotoUri,
        setSettings,
        addEntry,
        removeEntry,
        addAguaHoje,
        iniciarSessao,
        adicionarFluido,
        encerrarSessao,
        login,
        logout,
        showToast,
      },
    },
    children,
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore deve ser usado dentro de AppProvider");
  return ctx;
}
