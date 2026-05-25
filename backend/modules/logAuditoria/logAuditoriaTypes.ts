export interface LogAuditoria {
  id_log: number
  id_usuario: number | null
  acao: string
  tabela_afetada: string | null
  id_registro: number | null
  dados_anteriores: string | null
  dados_novos: string | null
  ip_origem: string | null
  user_agent: string | null
  criado_em: string
}

export interface CreateLogAuditoriaDTO {
  id_usuario?: number | null
  acao: string
  tabela_afetada?: string | null
  id_registro?: number | null
  dados_anteriores?: string | null
  dados_novos?: string | null
  ip_origem?: string | null
  user_agent?: string | null
}

export interface UpdateLogAuditoriaDTO {
  id_usuario?: number | null
  acao?: string
  tabela_afetada?: string | null
  id_registro?: number | null
  dados_anteriores?: string | null
  dados_novos?: string | null
  ip_origem?: string | null
  user_agent?: string | null
}