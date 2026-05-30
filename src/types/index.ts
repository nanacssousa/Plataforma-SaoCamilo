// src/types/index.ts
// Tipagem global do aplicativo — Plataforma São Camilo

export interface AtletaProfile {
  id: string;
  nome: string;
  email: string;
  posicao: string;
  categoria: string;
  peso: number;
  altura: number;
  idade: number;
  fotoUri: string | null;
  iniciais: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface HydrationSettings {
  metaDiariaL: number;
  lembretesPreTreino: boolean;
  minutosAntesTreino: number;
  notifDesidratacaoCritica: boolean;
  limiteDesidratacaoPct: number;
}

export interface HydrationEntry {
  id: string;
  data: string;
  dataISO: string;
  tipoTreino: string;
  intensidade: 'ALTA INTENSIDADE' | 'RESISTÊNCIA' | 'MODERADO' | 'FORÇA' | 'RECUPERAÇÃO';
  duracaoMin: number;
  aguaConsumidaML: number;
  taxaSudorese: number;
  desidratacaoPct: number;
  recuperacaoPct: number;
  pesoPreKg: number;
  pesoPosKg: number;
  observacoes?: string;
}

export interface DailyHydration {
  data: string;
  consumidoML: number;
  metaML: number;
  ultimaAtualizacao: string;
}

export interface SessaoAtiva {
  id: string;
  tipoTreino: string;
  intensidade: string;
  pesoPre: number;
  corUrinaPre: number;
  sintomasPre: string[];
  sede: number;
  iniciadaEm: string;
  aguaML: number;
  logFluidos: LogFluido[];
}

export interface LogFluido {
  id: number;
  ml: number;
  tipo: string;
  hora: string;
  ts: number;
}

export interface ToastMessage {
  msg: string;
  tipo: 'success' | 'error' | 'info';
}

export interface PerformanceMedia {
  taxaSudoroseMedia: number;
  recuperacaoMedia: number;
  totalSessoes: number;
  aguaMediaPorSessaoML: number;
}
