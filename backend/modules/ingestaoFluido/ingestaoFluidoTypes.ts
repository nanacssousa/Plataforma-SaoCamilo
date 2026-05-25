export interface IngestaoFluido {
  id_ingestao: number
  id_sessao: number
  momento: string
  tipo_fluido: string
  descricao_fluido: string | null
  volume_ml: number
  horario_ingestao: string
}

export interface CreateIngestaoFluidoDTO {
  id_sessao: number
  momento: string
  tipo_fluido?: string
  descricao_fluido?: string | null
  volume_ml: number
}

export interface UpdateIngestaoFluidoDTO {
  momento?: string
  tipo_fluido?: string
  descricao_fluido?: string | null
  volume_ml?: number
}
