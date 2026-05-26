import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "telaDuranteTreino_v1";
const HISTORY_KEY = "telaDuranteTreino_history";
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
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadState(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state: SessionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useDuranteTreino() {
  const saved = loadState();

  const [seconds, setSeconds] = useState<number>(saved?.seconds ?? 0);
  const [total, setTotal] = useState<number>(saved?.total ?? 0);
  const [log, setLog] = useState<LogEntry[]>(saved?.log ?? []);
  const [showCustom, setShowCustom] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [flash, setFlash] = useState(false);

  const goalReached = total >= META_ML;
  const logIdRef = useRef<number>((saved?.log?.length ?? 0) + 1);

  // Timer
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Persist
  useEffect(() => {
    saveState({ seconds, total, log });
  }, [seconds, total, log]);

  const addWater = useCallback((ml: number, type: string) => {
    const t = timeNow();
    const entry: LogEntry = {
      id: logIdRef.current++,
      title: `${ml}ml ingeridos`,
      subtitle: `${t} • ${type}`,
      ml,
      ts: Date.now(),
    };
    setTotal((prev) => prev + ml);
    setLog((prev) => [...prev, entry]);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  }, []);

  function handleQuickAdd(ml: number) {
    const types: Record<number, string> = {
      200: "INGESTÃO RÁPIDA",
      500: "HIDRATAÇÃO PADRÃO",
    };
    addWater(ml, types[ml] ?? "HIDRATAÇÃO");
  }

  function handleCustomAdd(ml: number) {
    addWater(ml, "VALOR PERSONALIZADO");
  }

  function handleNewSession() {
    const summary = {
      date: new Date().toLocaleString("pt-BR"),
      total,
      seconds,
      logCount: log.length,
    };
    try {
      const prev = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
      localStorage.setItem(HISTORY_KEY, JSON.stringify([...prev, summary]));
    } catch {}

    setSeconds(0);
    setTotal(0);
    setLog([]);
    setShowConfirm(false);
    logIdRef.current = 1;
  }

  return {
    seconds,
    total,
    log,
    goalReached,
    flash,
    showCustom,
    showConfirm,
    setShowCustom,
    setShowConfirm,
    handleQuickAdd,
    handleCustomAdd,
    handleNewSession,
  };
}