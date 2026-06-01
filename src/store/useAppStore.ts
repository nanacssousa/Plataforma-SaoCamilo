// src/store/useAppStore.ts
import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { dailyDB, historicoDB, perfilDB, sessaoAtivaDB, settingsDB } from '../database/storage';
import { AtletaProfile, DailyHydration, HydrationEntry, HydrationSettings, LogFluido, SessaoAtiva, ToastMessage } from '../types';
import { authAPI, calculoAPI, fluidoAPI, pesagemAPI, sessaoAPI, triagemAPI, urinaAPI } from '../services/api';

const DEFAULT_SETTINGS: HydrationSettings = { metaDiariaL: 3.5, lembretesPreTreino: true, minutosAntesTreino: 30, notifDesidratacaoCritica: true, limiteDesidratacaoPct: 2.0 };
const DEFAULT_PERFIL: AtletaProfile = { id: '0', nome: '', email: '', posicao: '', categoria: '', peso: 0, altura: 0, idade: 0, fotoUri: null, iniciais: '?', criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() };

function todayStr() { return new Date().toISOString().split('T')[0]; }
function generateId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function calcIniciais(nome: string): string {
  const parts = (nome || '?').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface State {
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
  | { type: 'INIT'; payload: Partial<State> }
  | { type: 'SET_PERFIL'; payload: Partial<AtletaProfile> }
  | { type: 'SET_FOTO'; payload: string | null }
  | { type: 'SET_SETTINGS'; payload: Partial<HydrationSettings> }
  | { type: 'SET_HISTORICO'; payload: HydrationEntry[] }
  | { type: 'ADD_ENTRY'; payload: HydrationEntry }
  | { type: 'REMOVE_ENTRY'; payload: string }
  | { type: 'ADD_AGUA_HOJE'; payload: number }
  | { type: 'RESET_DAILY'; payload: DailyHydration }
  | { type: 'INICIAR_SESSAO'; payload: SessaoAtiva }
  | { type: 'SET_IDS_BACKEND'; payload: { id: number; id_perfil: number } }
  | { type: 'SET_ID_SESSAO_BACKEND'; payload: number }
  | { type: 'ADICIONAR_FLUIDO'; payload: LogFluido }
  | { type: 'ENCERRAR_SESSAO' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_TOAST'; payload: ToastMessage }
  | { type: 'CLEAR_TOAST' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT': return { ...state, ...action.payload, isInitialized: true };
    case 'SET_PERFIL': {
      const nome = action.payload.nome ?? state.perfil.nome;
      const updated: AtletaProfile = { ...state.perfil, ...action.payload, iniciais: calcIniciais(nome), atualizadoEm: new Date().toISOString() };
      perfilDB.save(updated);
      return { ...state, perfil: updated };
    }
    case 'SET_FOTO': {
      const updated = { ...state.perfil, fotoUri: action.payload, atualizadoEm: new Date().toISOString() };
      perfilDB.save(updated);
      return { ...state, perfil: updated };
    }
    case 'SET_SETTINGS': { const updated = { ...state.settings, ...action.payload }; settingsDB.save(updated); return { ...state, settings: updated }; }
    case 'SET_HISTORICO': return { ...state, historico: action.payload };
    case 'ADD_ENTRY': { const updated = [action.payload, ...state.historico]; historicoDB.save(updated); return { ...state, historico: updated }; }
    case 'REMOVE_ENTRY': { const updated = state.historico.filter(e => e.id !== action.payload); historicoDB.save(updated); return { ...state, historico: updated }; }
    case 'ADD_AGUA_HOJE': { const updated: DailyHydration = { ...state.daily, consumidoML: state.daily.consumidoML + action.payload, ultimaAtualizacao: new Date().toISOString() }; dailyDB.save(updated); return { ...state, daily: updated }; }
    case 'RESET_DAILY': dailyDB.save(action.payload); return { ...state, daily: action.payload };
    case 'INICIAR_SESSAO': sessaoAtivaDB.save(action.payload); return { ...state, sessaoAtiva: action.payload };
    case 'SET_IDS_BACKEND': return { ...state, idUsuarioBackend: action.payload.id, idPerfilBackend: action.payload.id_perfil };
    case 'SET_ID_SESSAO_BACKEND': return { ...state, idSessaoBackend: action.payload };
    case 'ADICIONAR_FLUIDO': {
      if (!state.sessaoAtiva) return state;
      const updated: SessaoAtiva = { ...state.sessaoAtiva, aguaML: state.sessaoAtiva.aguaML + action.payload.ml, logFluidos: [...state.sessaoAtiva.logFluidos, action.payload] };
      sessaoAtivaDB.save(updated);
      return { ...state, sessaoAtiva: updated };
    }
    case 'ENCERRAR_SESSAO': sessaoAtivaDB.clear(); return { ...state, sessaoAtiva: null, idSessaoBackend: null };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SHOW_TOAST': return { ...state, toast: action.payload };
    case 'CLEAR_TOAST': return { ...state, toast: null };
    default: return state;
  }
}

interface AppContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  setPerfil: (p: Partial<AtletaProfile>) => void;
  setFotoUri: (uri: string | null) => void;
  setSettings: (s: Partial<HydrationSettings>) => void;
  addEntry: (e: Omit<HydrationEntry, 'id' | 'dataISO'>) => void;
  removeEntry: (id: string) => void;
  addAguaHoje: (ml: number) => void;
  iniciarSessao: (dados: Omit<SessaoAtiva, 'id' | 'iniciadaEm' | 'aguaML' | 'logFluidos'>) => Promise<void>;
  adicionarFluido: (ml: number, tipo: string) => void;
  encerrarSessao: (pesoPos: number, corUrina: number, sintomas: string[]) => Promise<HydrationEntry | null>;
  showToast: (msg: string, tipo?: ToastMessage['tipo']) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initialState: State = {
    perfil: DEFAULT_PERFIL, idUsuarioBackend: null, idPerfilBackend: null, idSessaoBackend: null,
    settings: DEFAULT_SETTINGS, historico: [],
    daily: { data: todayStr(), consumidoML: 0, metaML: DEFAULT_SETTINGS.metaDiariaL * 1000, ultimaAtualizacao: new Date().toISOString() },
    sessaoAtiva: null, isLoading: true, isInitialized: false, toast: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const [perfil, settings, historico, dailySaved, sessao, usuarioLocal] = await Promise.all([
        perfilDB.load(), settingsDB.load(), historicoDB.load(), dailyDB.load(), sessaoAtivaDB.load(), authAPI.getUsuarioLocal(),
      ]);
      const today = todayStr();
      const metaDiariaL = settings?.metaDiariaL ?? DEFAULT_SETTINGS.metaDiariaL;
      let daily: DailyHydration;
      if (dailySaved && dailySaved.data === today) {
        daily = { ...dailySaved, metaML: metaDiariaL * 1000 };
      } else {
        daily = { data: today, consumidoML: 0, metaML: metaDiariaL * 1000, ultimaAtualizacao: new Date().toISOString() };
        dailyDB.save(daily);
      }
      const perfilFinal: AtletaProfile = usuarioLocal
        ? { ...(perfil ?? DEFAULT_PERFIL), id: String(usuarioLocal.id_usuario), nome: usuarioLocal.nome_completo, email: usuarioLocal.email, iniciais: calcIniciais(usuarioLocal.nome_completo) }
        : (perfil ?? DEFAULT_PERFIL);
      dispatch({ type: 'INIT', payload: { perfil: perfilFinal, settings: settings ?? DEFAULT_SETTINGS, historico, daily, sessaoAtiva: sessao, isLoading: false, idUsuarioBackend: usuarioLocal?.id_usuario ?? null, idPerfilBackend: usuarioLocal?.id_perfil ?? null } });
    })();
  }, []);

  const setPerfil = useCallback((p: Partial<AtletaProfile>) => dispatch({ type: 'SET_PERFIL', payload: p }), []);
  const setFotoUri = useCallback((uri: string | null) => dispatch({ type: 'SET_FOTO', payload: uri }), []);
  const setSettings = useCallback((s: Partial<HydrationSettings>) => dispatch({ type: 'SET_SETTINGS', payload: s }), []);
  const addAguaHoje = useCallback((ml: number) => dispatch({ type: 'ADD_AGUA_HOJE', payload: ml }), []);
  const addEntry = useCallback((e: Omit<HydrationEntry, 'id' | 'dataISO'>) => { dispatch({ type: 'ADD_ENTRY', payload: { ...e, id: generateId(), dataISO: new Date().toISOString() } }); }, []);
  const removeEntry = useCallback((id: string) => dispatch({ type: 'REMOVE_ENTRY', payload: id }), []);

  const adicionarFluido = useCallback((ml: number, tipo: string) => {
    const fluido: LogFluido = { id: Date.now(), ml, tipo, hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), ts: Date.now() };
    dispatch({ type: 'ADICIONAR_FLUIDO', payload: fluido });
    dispatch({ type: 'ADD_AGUA_HOJE', payload: ml });
    if (state.idSessaoBackend) fluidoAPI.registrar(state.idSessaoBackend, 'DURANTE', ml).catch(() => {});
  }, [state.idSessaoBackend]);

  const iniciarSessao = useCallback(async (dados: Omit<SessaoAtiva, 'id' | 'iniciadaEm' | 'aguaML' | 'logFluidos'>): Promise<void> => {
    const sessao: SessaoAtiva = { ...dados, id: generateId(), iniciadaEm: new Date().toISOString(), aguaML: 0, logFluidos: [] };
    dispatch({ type: 'INICIAR_SESSAO', payload: sessao });
    const idUsuario = state.idUsuarioBackend;
    if (!idUsuario) return;
    try {
      const agora = new Date();
      const TIPO_MAP: Record<string, number> = { 'Corrida': 1, 'Atletismo': 2, 'Musculação': 3, 'Recuperação': 4, 'Futebol': 5, 'Natação': 6, 'Ciclismo': 7, 'Basquete': 8 };
      const sessaoBack = await sessaoAPI.criar({ id_usuario: idUsuario, id_tipo_exercicio: TIPO_MAP[dados.tipoTreino] ?? 1, data_treino: agora.toISOString().split('T')[0], hora_inicio: agora.toTimeString().slice(0, 8), intensidade: dados.intensidade.replace(/ /g, '_').toUpperCase() });
      dispatch({ type: 'SET_ID_SESSAO_BACKEND', payload: sessaoBack.id_sessao });
      await Promise.allSettled([pesagemAPI.registrar(sessaoBack.id_sessao, 'PRE', dados.pesoPre), urinaAPI.registrar(sessaoBack.id_sessao, 'PRE', dados.corUrinaPre)]);
    } catch { /* sessão local continua */ }
  }, [state.idUsuarioBackend]);

  const encerrarSessao = useCallback(async (pesoPos: number, corUrina: number, sintomas: string[]): Promise<HydrationEntry | null> => {
    const { sessaoAtiva, idSessaoBackend } = state;
    if (!sessaoAtiva) return null;
    const inicio = new Date(sessaoAtiva.iniciadaEm);
    const fim = new Date();
    const duracaoMin = Math.round((fim.getTime() - inicio.getTime()) / 60000);
    const duracaoH = duracaoMin / 60 || 1;
    const pesoPre = sessaoAtiva.pesoPre;
    const variacaoKg = Math.max(0, pesoPre - pesoPos);
    const desidratacaoPct = variacaoKg > 0 ? parseFloat(((variacaoKg / pesoPre) * 100).toFixed(2)) : 0;
    const taxaSudorese = parseFloat(((variacaoKg * 1000 + sessaoAtiva.aguaML) / (duracaoH * 1000)).toFixed(2));
    const entry: HydrationEntry = { id: generateId(), data: fim.toISOString().split('T')[0], dataISO: fim.toISOString(), tipoTreino: sessaoAtiva.tipoTreino, intensidade: sessaoAtiva.intensidade as HydrationEntry['intensidade'], duracaoMin, aguaConsumidaML: sessaoAtiva.aguaML, taxaSudorese, desidratacaoPct, recuperacaoPct: Math.min(100, Math.round((1 - desidratacaoPct / 4) * 100)), pesoPreKg: pesoPre, pesoPosKg: pesoPos };
    dispatch({ type: 'ADD_ENTRY', payload: entry });
    dispatch({ type: 'ENCERRAR_SESSAO' });
    if (idSessaoBackend) {
      (async () => {
        try {
          await Promise.allSettled([pesagemAPI.registrar(idSessaoBackend, 'POS', pesoPos), urinaAPI.registrar(idSessaoBackend, 'POS', corUrina), sessaoAPI.atualizar(idSessaoBackend, { duracao_minutos: duracaoMin, hora_fim: fim.toTimeString().slice(0, 8) })]);
          if (sintomas.length > 0) await triagemAPI.registrar(idSessaoBackend, { caibras: sintomas.includes('caibras'), tontura: sintomas.includes('tontura'), cansaco_excessivo: sintomas.includes('fadiga'), sensacao_sede: sintomas.includes('sede') });
          await calculoAPI.calcular(idSessaoBackend);
        } catch { /* resultado local já salvo */ }
      })();
    }
    return entry;
  }, [state]);

  const showToast = useCallback((msg: string, tipo: ToastMessage['tipo'] = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    dispatch({ type: 'SHOW_TOAST', payload: { msg, tipo } });
    toastTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3000);
  }, []);

  return React.createElement(AppContext.Provider, { value: { state, dispatch, setPerfil, setFotoUri, setSettings, addEntry, removeEntry, addAguaHoje, iniciarSessao, adicionarFluido, encerrarSessao, showToast } }, children);
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore deve ser usado dentro de AppProvider');
  return ctx;
}
