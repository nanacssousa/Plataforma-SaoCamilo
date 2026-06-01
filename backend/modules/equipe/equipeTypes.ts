export interface Equipe {
  id_equipe: number
  nome: string
  modalidade: string | null
  descricao: string | null
  ativo: number
  criado_em: string
}

export interface EquipeAtleta {
  id: number
  nome: string
  posicao: string
  categoria: string
  massaAtual: number
  deltaMassa: number
  usg: number
  statusHidrico: "desidratado" | "hidratado" | "alerta_leve"
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
