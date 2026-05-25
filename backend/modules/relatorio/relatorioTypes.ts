export interface Relatorio {
  id_relatorio: number
  id_solicitante: number
  id_atleta: number
  tipo_relatorio: string
  formato: string
  periodo_inicio: string
  periodo_fim: string
  url_arquivo: string | null
  status: string
  erro_mensagem: string | null
  gerado_em: string | null
  criado_em: string
}

export interface CreateRelatorioDTO {
  id_solicitante: number
  id_atleta: number
  tipo_relatorio: string
  formato: string
  periodo_inicio: string
  periodo_fim: string
  url_arquivo?: string | null
  status?: string
  erro_mensagem?: string | null
  gerado_em?: string | null
}

export interface UpdateRelatorioDTO {
  tipo_relatorio?: string
  formato?: string
  periodo_inicio?: string
  periodo_fim?: string
  url_arquivo?: string | null
  status?: string
  erro_mensagem?: string | null
  gerado_em?: string | null
}