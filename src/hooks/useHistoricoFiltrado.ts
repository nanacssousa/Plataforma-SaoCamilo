// src/hooks/useHistoricoFiltrado.ts
import { useMemo, useState } from 'react';
import { HydrationEntry } from '../types';
import { useAppStore } from '../store/useAppStore';

export type FiltroHistorico = 'hoje' | 'semana' | 'mes' | 'todos';

export function useHistoricoFiltrado() {
  const { state } = useAppStore();
  const [filtro, setFiltro] = useState<FiltroHistorico>('todos');
  const [search, setSearch] = useState('');

  const filtrado = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    let base: HydrationEntry[] = state.historico;

    if (filtro === 'hoje') {
      base = base.filter(e => e.data === today);
    } else if (filtro === 'semana') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      base = base.filter(e => new Date(e.dataISO) >= weekAgo);
    } else if (filtro === 'mes') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      base = base.filter(e => new Date(e.dataISO) >= monthAgo);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(e =>
        e.tipoTreino.toLowerCase().includes(q) ||
        e.intensidade.toLowerCase().includes(q)
      );
    }

    return base;
  }, [state.historico, filtro, search]);

  return { filtrado, filtro, setFiltro, search, setSearch };
}
