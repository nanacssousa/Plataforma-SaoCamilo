export interface EquipeMembro {
  id_equipe: number
  id_usuario: number
  cargo: string
  ativo: number
  criado_em: string
}

export interface CreateEquipeMembroDTO {
  id_equipe: number
  id_usuario: number
  cargo?: string
  ativo?: number
}

export interface UpdateEquipeMembroDTO {
  cargo?: string
  ativo?: number
}
