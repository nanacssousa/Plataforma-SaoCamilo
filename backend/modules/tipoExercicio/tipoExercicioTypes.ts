export interface TipoExercicio {
  id_tipo_exercicio: number
  nome: string
  descricao: string | null
  categoria: string
}

export interface CreateTipoExercicioDTO {
  nome: string
  descricao?: string | null
  categoria?: string
}

export interface UpdateTipoExercicioDTO {
  nome?: string
  descricao?: string | null
  categoria?: string
}
