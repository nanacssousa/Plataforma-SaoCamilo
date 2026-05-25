export interface VinculoProfissionalAtleta {
  id_vinculo: number
  id_nutricionista: number
  id_atleta: number
  data_inicio: string
  data_fim: string | null
  ativo: number
  criado_em: string
}

export interface CreateVinculoProfissionalAtletaDTO {
  id_nutricionista: number
  id_atleta: number
  data_inicio?: string
  data_fim?: string | null
  ativo?: number
}

export interface UpdateVinculoProfissionalAtletaDTO {
  data_fim?: string | null
  ativo?: number
}
