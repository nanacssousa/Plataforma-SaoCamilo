// src/hooks/useDuranteTreino.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = '@saocamilo:durante_treino_v1';
export const META_ML = 2000;

export interface LogEntry {
  id: number;
  title: string;
  subtitle: string;
  ml: number;
  ts: number;
}

export interface SessionState {
  seconds: number;
  total: number;
  log: LogEntry[];
}

function timeNow(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

async function loadState(): Promise<SessionState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

async function saveState(s: SessionState): Promise<void> {
  try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export function useDuranteTreino(sessaoAtiva: boolean = false) {
  const [seconds, setSeconds]     = useState<number>(0);
  const [total, setTotal]         = useState<number>(0);
  const [log, setLog]             = useState<LogEntry[]>([]);
  const [showCustom, setShowCustom]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [flash, setFlash]         = useState(false);
  const [initialized, setInitialized] = useState(false);

  const logIdRef   = useRef<number>(1);
  // Ref para o intervalo — controlado pelo sessaoAtiva
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Carrega estado salvo ──────────────────────────────────────────────────
  useEffect(() => {
    loadState().then(saved => {
      if (saved) {
        setSeconds(saved.seconds);
        setTotal(saved.total);
        setLog(saved.log);
        logIdRef.current = (saved.log?.length ?? 0) + 1;
      }
      setInitialized(true);
    });
  }, []);

  // ── Timer só roda se há sessão ativa (check-in feito) ─────────────────────
  useEffect(() => {
    if (!sessaoAtiva) {
      // Sem check-in: garante que o timer está parado
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    // Com check-in: inicia o timer
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessaoAtiva]);

  // ── Persiste no storage ───────────────────────────────────────────────────
  useEffect(() => {
    if (initialized) saveState({ seconds, total, log });
  }, [seconds, total, log, initialized]);

  const goalReached = total >= META_ML;

  // ── Adicionar água ────────────────────────────────────────────────────────
  const addWater = useCallback((ml: number, type: string) => {
    const entry: LogEntry = {
      id: logIdRef.current++,
      title: `${ml}ml ingeridos`,
      subtitle: `${timeNow()} • ${type}`,
      ml,
      ts: Date.now(),
    };
    setTotal(prev => prev + ml);
    setLog(prev => [...prev, entry]);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  }, []);

  function handleQuickAdd(ml: number) {
    const types: Record<number, string> = { 200: 'INGESTÃO RÁPIDA', 500: 'HIDRATAÇÃO PADRÃO' };
    addWater(ml, types[ml] ?? 'HIDRATAÇÃO');
  }

  function handleCustomAdd(ml: number) {
    addWater(ml, 'VALOR PERSONALIZADO');
  }

  function handleNewSession() {
    setSeconds(0);
    setTotal(0);
    setLog([]);
    setShowConfirm(false);
    logIdRef.current = 1;
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }

  return {
    seconds, total, log, goalReached, flash,
    showCustom, showConfirm,
    setShowCustom, setShowConfirm,
    handleQuickAdd, handleCustomAdd, handleNewSession,
  };
}