// src/services/api.ts
// Camada central de comunicação com o backend
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.15.18:3000";

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("@saocamilo:token");
}

async function buildHeaders(auth = true): Promise<Record<string, string>> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
  }
  return h;
}

async function req<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = await buildHeaders(auth);
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error ?? `Erro ${res.status}`);
  return data as T;
}

export interface UsuarioAPI {
  id_usuario: number;
  nome_completo: string;
  email: string;
  id_perfil: number;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioAPI;
}

export interface SessaoTreinoAPI {
  id_sessao: number;
  id_usuario: number;
  id_tipo_exercicio: number;
  data_treino: string;
  hora_inicio: string;
  intensidade: string;
}

export interface ClimaAtualAPI {
  fonte: "SENSOR" | "OPENMETEO" | "MANUAL";
  temperatura_c: number;
  umidade_pct: number;
  indice_calor_c: number;
  condicao: "CONFORTAVEL" | "ATENCAO" | "CRITICO";
  descricao_condicao: string;
  lido_em: string;
  id_leitura: number;
}

export interface AgenteIAContrato {
  status_sessao: "ESTÁVEL" | "ATENÇÃO" | "CRÍTICO";
  disparar_alerta_push: boolean;
  mensagem_notificacao: string;
  recomendacao_hidratacao_ml: number;
  analise_clinica_comentario: string;
}

export const authAPI = {
  login: (email: string, senha: string) =>
    req<LoginResponse>(
      "/usuarios/login",
      {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      },
      false,
    ),

  cadastrarAtleta: (dados: {
    nome_completo: string;
    email: string;
    senha: string;
    id_perfil?: number;
  }) =>
    req<any>(
      "/usuarios/register",
      {
        method: "POST",
        body: JSON.stringify({ ...dados, id_perfil: dados.id_perfil ?? 1 }),
      },
      false,
    ),

  salvarToken: (token: string, usuario: UsuarioAPI) =>
    Promise.all([
      AsyncStorage.setItem("@saocamilo:token", token),
      AsyncStorage.setItem("@saocamilo:usuario", JSON.stringify(usuario)),
    ]),

  getUsuarioLocal: async (): Promise<UsuarioAPI | null> => {
    const raw = await AsyncStorage.getItem("@saocamilo:usuario");
    return raw ? JSON.parse(raw) : null;
  },

  logout: () =>
    Promise.all([
      AsyncStorage.removeItem("@saocamilo:token"),
      AsyncStorage.removeItem("@saocamilo:usuario"),
    ]),
};

export const perfilAPI = {
  criarOuAtualizar: (
    id_usuario: number,
    dados: {
      altura_cm?: number;
      peso_habitual_kg?: number;
      modalidade?: string;
      nivel?: string;
    },
  ) =>
    req<any>("/api/perfil-atletico", {
      method: "POST",
      body: JSON.stringify({ id_usuario, ...dados }),
    }),
};

export const sessaoAPI = {
  criar: (dados: {
    id_usuario: number;
    id_tipo_exercicio: number;
    data_treino: string;
    hora_inicio: string;
    intensidade: string;
  }) =>
    req<SessaoTreinoAPI>("/api/sessoes-treino", {
      method: "POST",
      body: JSON.stringify(dados),
    }),
  atualizar: (
    id_sessao: number,
    dados: { hora_fim?: string; duracao_minutos?: number },
  ) =>
    req<any>(`/api/sessoes-treino/${id_sessao}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),
};

export const pesagemAPI = {
  registrar: (id_sessao: number, momento: "PRE" | "POS", massa_kg: number) =>
    req<any>("/api/pesagens", {
      method: "POST",
      body: JSON.stringify({ id_sessao, momento, massa_kg }),
    }),
};

export const urinaAPI = {
  registrar: (id_sessao: number, momento: "PRE" | "POS", escala_cor: number) =>
    req<any>("/api/registro-cor-urina", {
      method: "POST",
      body: JSON.stringify({ id_sessao, momento, escala_cor }),
    }),
};

export const fluidoAPI = {
  registrar: (
    id_sessao: number,
    momento: "PRE" | "DURANTE" | "POS",
    volume_ml: number,
    tipo_fluido = "AGUA",
  ) =>
    req<any>("/api/ingestao-fluido", {
      method: "POST",
      body: JSON.stringify({ id_sessao, momento, volume_ml, tipo_fluido }),
    }),
};

export const triagemAPI = {
  registrar: (
    id_sessao: number,
    dados: {
      caibras?: boolean;
      tontura?: boolean;
      cansaco_excessivo?: boolean;
      sensacao_sede?: boolean;
    },
  ) =>
    req<any>("/api/triagens", {
      method: "POST",
      body: JSON.stringify({ id_sessao, ...dados }),
    }),
};

export const calculoAPI = {
  calcular: (id_sessao: number) =>
    req<any>(`/api/calculos-hidratacao/sessao/${id_sessao}`, {
      method: "POST",
    }),
};

export const climaAPI = {
  buscarAtual: (id_local = 1) =>
    req<ClimaAtualAPI>(`/api/ambiente-clima/atual/${id_local}`),
};

export const agenteIA = {
  analisarPre: (params: {
    id_sessao: number;
    id_usuario: number;
    id_local?: number;
    peso_pre_kg?: number;
    cor_urina?: number;
    sintomas?: string[];
    nivel_sede?: number;
  }) =>
    req<AgenteIAContrato>("/api/agente-ia/analisar-pre", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  analisarPos: (params: {
    id_sessao: number;
    id_usuario: number;
    id_local?: number;
  }) =>
    req<AgenteIAContrato>("/api/agente-ia/analisar-pos", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};
