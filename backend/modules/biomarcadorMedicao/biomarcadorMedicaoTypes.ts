export interface BiomarcadorMedicao {
  id_medicao: number
  id_usuario: number
  id_biomarcador: number
  valor: number
  leitura_texto: string | null
  status: string
  tendencia: string
  medido_em: string
  observacoes: string | null
}

export interface CreateBiomarcadorMedicaoDTO {
  id_usuario: number
  id_biomarcador: number
  valor: number
  leitura_texto?: string | null
  status?: string
  tendencia?: string
  observacoes?: string | null
}

export interface UpdateBiomarcadorMedicaoDTO {
  valor?: number
  leitura_texto?: string | null
  status?: string
  tendencia?: string
  observacoes?: string | null
}