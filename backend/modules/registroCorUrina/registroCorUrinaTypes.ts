export interface RegistroCorUrina {
  id_registro_urina: number
  id_sessao: number
  momento: string
  escala_cor: number
  descricao_cor: string | null
  horario_registro: string
}

export interface CreateRegistroCorUrinaDTO {
  id_sessao: number
  momento: string
  escala_cor: number
  descricao_cor?: string | null
}

export interface UpdateRegistroCorUrinaDTO {
  momento?: string
  escala_cor?: number
  descricao_cor?: string | null
}
