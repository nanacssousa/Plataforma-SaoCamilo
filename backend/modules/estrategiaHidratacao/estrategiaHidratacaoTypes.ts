export interface EstrategiaHidratacao {
  id_estrategia: number
  id_nutricionista: number
  id_atleta: number
  titulo: string
  descricao: string
  volume_pre_ml: number | null
  volume_durante_ml_h: number | null
  volume_pos_ml: number | null
  tipo_fluido_recom: string | null
  eletrólitos_recom: string | null
  valida_ate: string | null
  ativa: number
  criado_em: string
  atualizado_em: string
}

export interface CreateEstrategiaHidratacaoDTO {
  id_nutricionista: number
  id_atleta: number
  titulo: string
  descricao: string
  volume_pre_ml?: number | null
  volume_durante_ml_h?: number | null
  volume_pos_ml?: number | null
  tipo_fluido_recom?: string | null
  eletrólitos_recom?: string | null
  valida_ate?: string | null
  ativa?: number
}

export interface UpdateEstrategiaHidratacaoDTO {
  titulo?: string
  descricao?: string
  volume_pre_ml?: number | null
  volume_durante_ml_h?: number | null
  volume_pos_ml?: number | null
  tipo_fluido_recom?: string | null
  eletrólitos_recom?: string | null
  valida_ate?: string | null
  ativa?: number
}