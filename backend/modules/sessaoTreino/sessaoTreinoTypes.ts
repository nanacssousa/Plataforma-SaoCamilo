export interface SessaoTreino {
  id_sessao: number
  id_usuario: number
  id_tipo_exercicio: number
  data_treino: string
  hora_inicio: string
  hora_fim: string | null
  duracao_minutos: number | null
  intensidade: string
  local_treino: string | null
  observacoes: string | null
  validado_nutricionista: number
  id_nutricionista_validador: number | null
  criado_em: string
}

export interface CreateSessaoTreinoDTO {
  id_usuario: number
  id_tipo_exercicio: number
  data_treino: string
  hora_inicio: string
  hora_fim?: string | null
  duracao_minutos?: number | null
  intensidade?: string
  local_treino?: string | null
  observacoes?: string | null
  validado_nutricionista?: number
  id_nutricionista_validador?: number | null
}

export interface UpdateSessaoTreinoDTO {
  id_tipo_exercicio?: number
  data_treino?: string
  hora_inicio?: string
  hora_fim?: string | null
  duracao_minutos?: number | null
  intensidade?: string
  local_treino?: string | null
  observacoes?: string | null
  validado_nutricionista?: number
  id_nutricionista_validador?: number | null
}
