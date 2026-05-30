// src/hooks/usePerformance.ts
// Calcula performance média em tempo real a partir do histórico real

import { useMemo } from 'react';
import { PerformanceMedia } from '../types';
import { useAppStore } from '../store/useAppStore';

export function usePerformance(): PerformanceMedia {
  const { state } = useAppStore();
  const { historico } = state;

  return useMemo(() => {
    if (historico.length === 0) {
      return { taxaSudoroseMedia: 0, recuperacaoMedia: 0, totalSessoes: 0, aguaMediaPorSessaoML: 0 };
    }
    const totalSudorese = historico.reduce((acc, e) => acc + e.taxaSudorese, 0);
    const totalRecuperacao = historico.reduce((acc, e) => acc + e.recuperacaoPct, 0);
    const totalAgua = historico.reduce((acc, e) => acc + e.aguaConsumidaML, 0);
    return {
      taxaSudoroseMedia: parseFloat((totalSudorese / historico.length).toFixed(2)),
      recuperacaoMedia: Math.round(totalRecuperacao / historico.length),
      totalSessoes: historico.length,
      aguaMediaPorSessaoML: Math.round(totalAgua / historico.length),
    };
  }, [historico]);
}
