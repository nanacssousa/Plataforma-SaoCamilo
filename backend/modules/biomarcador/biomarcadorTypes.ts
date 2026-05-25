export interface Biomarcador {
  id_biomarcador: number
  nome: string
  unidade: string
  faixa_min: number | null
  faixa_max: number | null
  descricao: string | null
  ativo: number
}

export interface CreateBiomarcadorDTO {
  nome: string
  unidade: string
  faixa_min?: number | null
  faixa_max?: number | null
  descricao?: string | null
  ativo?: number
}

export interface UpdateBiomarcadorDTO {
  nome?: string
  unidade?: string
  faixa_min?: number | null
  faixa_max?: number | null
  descricao?: string | null
  ativo?: number
}