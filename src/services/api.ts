// src/services/api.ts
// Camada central de comunicação com o backend
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.15.5:3000";

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

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (networkErr: any) {
    const msg = networkErr?.message ?? String(networkErr);
    throw new Error(
      `Sem conexão com o servidor (${API_URL}). Detalhe: ${msg}`
    );
  }

  const rawText = await res.text().catch(() => "");
  console.log(`[API] ${options.method ?? "GET"} ${path} → status ${res.status} | body: ${rawText.slice(0, 300)}`);

  let data: any = {};
  try {
    if (rawText) data = JSON.parse(rawText);
  } catch {
    if (!res.ok) throw new Error(`Erro ${res.status}: resposta inválida — ${rawText.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(data?.error ?? data?.message ?? `Erro ${res.status}`);
  }

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

  cadastrarStaff: (dados: {
    nome_completo: string;
    email: string;
    senha: string;
    id_perfil: number;
    telefone?: string;
    registro_profissional?: string;
    especialidade?: string | null;
  }) =>
    req<any>(
      "/usuarios/register",
      {
        method: "POST",
        body: JSON.stringify(dados),
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
  getUsuarioLogado: async (): Promise<UsuarioAPI | null> => {
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
    req<any>("/perfil-atletico", {
      method: "POST",
      body: JSON.stringify({ id_usuario, ...dados }),
    }),

  buscarPorUsuario: (id_usuario: number) =>
    req<any>(`/perfil-atletico/usuario/${id_usuario}`),
};

export const sessaoAPI = {
  criar: (dados: {
    id_usuario: number;
    id_tipo_exercicio: number;
    data_treino: string;
    hora_inicio: string;
    intensidade: string;
  }) =>
    req<SessaoTreinoAPI>("/sessoes-treino", {
      method: "POST",
      body: JSON.stringify(dados),
    }),
  atualizar: (
    id_sessao: number,
    dados: { hora_fim?: string; duracao_minutos?: number },
  ) =>
    req<any>(`/sessoes-treino/${id_sessao}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),
};

export const pesagemAPI = {
  registrar: (id_sessao: number, momento: "PRE" | "POS", massa_kg: number) =>
    req<any>("/pesagens", {
      method: "POST",
      body: JSON.stringify({ id_sessao, momento, massa_kg }),
    }),
};

export const urinaAPI = {
  registrar: (id_sessao: number, momento: "PRE" | "POS", escala_cor: number) =>
    req<any>("/registro-cor-urina", {
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
    req<any>("/ingestao-fluido", {
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
    req<any>("/triagens", {
      method: "POST",
      body: JSON.stringify({ id_sessao, ...dados }),
    }),
};

export const calculoAPI = {
  calcular: (id_sessao: number) =>
    req<any>(`/calculos-hidratacao/sessao/${id_sessao}`, {
      method: "POST",
    }),
};

export const climaAPI = {
  buscarAtual: (id_local = 1) =>
    req<ClimaAtualAPI>(`/ambiente-clima/atual/${id_local}`),

  buscarPorCoordenadas: async (lat: number, lon: number): Promise<ClimaAtualAPI> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,precipitation&wind_speed_unit=ms&timezone=America%2FSao_Paulo`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo erro ${res.status}`);
    const data = await res.json();
    const c = data.current;
    const t = c.temperature_2m;
    const h = c.relative_humidity_2m;
    // índice de calor (fórmula Steadman)
    let indice = t;
    if (t >= 27) {
      indice = -8.78 + 1.611 * t + 2.339 * h - 0.146 * t * h
        - 0.01231 * t * t - 0.01642 * h * h
        + 0.00221 * t * t * h + 0.000725 * t * h * h
        - 0.00000358 * t * t * h * h;
    }
    const condicao: ClimaAtualAPI["condicao"] =
      indice < 27 ? "CONFORTAVEL" : indice < 38 ? "ATENCAO" : "CRITICO";
    const descricao =
      condicao === "CONFORTAVEL" ? "Condições ideais para treino"
      : condicao === "ATENCAO"   ? "Calor moderado — hidratação reforçada recomendada"
      :                            "Risco de exaustão por calor — avaliar suspensão do treino";
    return {
      fonte: "OPENMETEO",
      temperatura_c: t,
      umidade_pct: h,
      indice_calor_c: Math.round(indice * 10) / 10,
      condicao,
      descricao_condicao: descricao,
      lido_em: new Date().toISOString(),
      id_leitura: 0,
    };
  },
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
    req<AgenteIAContrato>("/agente-ia/analisar-pre", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  analisarPos: (params: {
    id_sessao: number;
    id_usuario: number;
    id_local?: number;
  }) =>
    req<AgenteIAContrato>("/agente-ia/analisar-pos", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};