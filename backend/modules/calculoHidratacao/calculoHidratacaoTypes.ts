export interface CalculoHidratacao {
  id_calculo: number
  id_sessao: number
  massa_pre_kg: number
  massa_pos_kg: number
  total_ingestao_ml: number
  total_urinario_ml: number
  duracao_horas: number
  variacao_massa_kg: number
  perda_percentual_massa: number
  taxa_sudorese_lh: number
  balanco_hidrico_ml: number
  nivel_desidratacao: string
  risco_hiponatremia: number
  recomendacao_reposicao_ml: number | null
  calculado_em: string
  versao_algoritmo: string
}

export interface CreateCalculoHidratacaoDTO {
  id_sessao: number
  massa_pre_kg: number
  massa_pos_kg: number
  total_ingestao_ml: number
  total_urinario_ml?: number
  duracao_horas: number
  variacao_massa_kg: number
  perda_percentual_massa: number
  taxa_sudorese_lh: number
  balanco_hidrico_ml: number
  nivel_desidratacao: string
  risco_hiponatremia?: number
  recomendacao_reposicao_ml?: number | null
  versao_algoritmo?: string
}

export interface UpdateCalculoHidratacaoDTO {
  massa_pre_kg?: number
  massa_pos_kg?: number
  total_ingestao_ml?: number
  total_urinario_ml?: number
  duracao_horas?: number
  variacao_massa_kg?: number
  perda_percentual_massa?: number
  taxa_sudorese_lh?: number
  balanco_hidrico_ml?: number
  nivel_desidratacao?: string
  risco_hiponatremia?: number
  recomendacao_reposicao_ml?: number | null
  versao_algoritmo?: string
}
