// src/database/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AtletaProfile, DailyHydration, HydrationEntry, HydrationSettings, SessaoAtiva } from '../types';

const KEYS = {
  PERFIL: '@saocamilo:perfil',
  SETTINGS: '@saocamilo:settings',
  HISTORICO: '@saocamilo:historico',
  DAILY: '@saocamilo:daily',
  SESSAO_ATIVA: '@saocamilo:sessao_ativa',
} as const;

async function get<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch { return null; }
}

async function set<T>(key: string, value: T): Promise<void> {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.error('[storage]', key, e); }
}

async function remove(key: string) { try { await AsyncStorage.removeItem(key); } catch {} }

export const perfilDB = {
  load: () => get<AtletaProfile>(KEYS.PERFIL),
  save: (p: AtletaProfile) => set(KEYS.PERFIL, p),
  clear: () => remove(KEYS.PERFIL),
};

export const settingsDB = {
  load: () => get<HydrationSettings>(KEYS.SETTINGS),
  save: (s: HydrationSettings) => set(KEYS.SETTINGS, s),
};

export const historicoDB = {
  async load(): Promise<HydrationEntry[]> {
    const d = await get<HydrationEntry[]>(KEYS.HISTORICO);
    return d ?? [];
  },
  async save(entries: HydrationEntry[]) { return set(KEYS.HISTORICO, entries); },
  async addEntry(entry: HydrationEntry) {
    const existing = await this.load();
    return set(KEYS.HISTORICO, [entry, ...existing]);
  },
  async removeEntry(id: string) {
    const existing = await this.load();
    return set(KEYS.HISTORICO, existing.filter(e => e.id !== id));
  },
  clear: () => remove(KEYS.HISTORICO),
};

export const dailyDB = {
  load: () => get<DailyHydration>(KEYS.DAILY),
  save: (d: DailyHydration) => set(KEYS.DAILY, d),
};

export const sessaoAtivaDB = {
  load: () => get<SessaoAtiva>(KEYS.SESSAO_ATIVA),
  save: (s: SessaoAtiva) => set(KEYS.SESSAO_ATIVA, s),
  clear: () => remove(KEYS.SESSAO_ATIVA),
};

export async function clearAllData() {
  await Promise.all(Object.values(KEYS).map(remove));
}
