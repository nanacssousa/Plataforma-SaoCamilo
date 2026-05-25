export interface Perfil {
  id_perfil: number
  nome: string
  descricao: string
}

export interface CreatePerfilDTO {
  nome: string
  descricao: string
}

export interface UpdatePerfilDTO {
  nome?: string
  descricao?: string
}
