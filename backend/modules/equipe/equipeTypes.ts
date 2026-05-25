export interface Equipe {
  id_equipe: number
  nome: string
  modalidade: string | null
  descricao: string | null
  ativo: number
  criado_em: string
}

export interface CreateEquipeDTO {
  nome: string
  modalidade?: string | null
  descricao?: string | null
  ativo?: number
}

export interface UpdateEquipeDTO {
  nome?: string
  modalidade?: string | null
  descricao?: string | null
  ativo?: number
}
