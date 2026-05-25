export interface SessaoAutenticacao {
  id_sessao_auth: number
  id_usuario: number
  token_hash: string
  dispositivo: string | null
  plataforma: string
  ip_origem: string | null
  criado_em: string
  expira_em: string
  revogado: number
  revogado_em: string | null
}

export interface CreateSessaoAutenticacaoDTO {
  id_usuario: number
  token_hash: string
  dispositivo?: string | null
  plataforma: string
  ip_origem?: string | null
  expira_em: string
}

export interface UpdateSessaoAutenticacaoDTO {
  dispositivo?: string | null
  plataforma?: string
  ip_origem?: string | null
  expira_em?: string
  revogado?: number
  revogado_em?: string | null
}