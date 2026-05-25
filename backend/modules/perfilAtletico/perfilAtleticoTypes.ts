export interface PerfilAtletico {
  id_perfil_atletico: number
  id_usuario: number
  modalidade: string
  nivel: string
  altura_cm: number | null
  peso_habitual_kg: number | null
  condicao_medica: string | null
  observacoes: string | null
  criado_em: string
  atualizado_em: string
}

export interface CreatePerfilAtleticoDTO {
  id_usuario: number
  modalidade: string
  nivel?: string
  altura_cm?: number | null
  peso_habitual_kg?: number | null
  condicao_medica?: string | null
  observacoes?: string | null
}

export interface UpdatePerfilAtleticoDTO {
  modalidade?: string
  nivel?: string
  altura_cm?: number | null
  peso_habitual_kg?: number | null
  condicao_medica?: string | null
  observacoes?: string | null
}
