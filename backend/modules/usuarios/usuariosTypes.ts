export interface Usuario {
  id_usuario: number
  id_perfil: number
  nome_completo: string
  email: string
  senha_hash: string
  data_nascimento: string | null
  genero: 'MASCULINO' | 'FEMININO' | 'NAO_BINARIO' | 'PREFIRO_NAO_INFORMAR' | null
  telefone: string | null
  foto_perfil_url: string | null
  registro_profissional: string | null
  especialidade: string | null
  consentimento_lgpd: number
  data_consentimento: string | null
  ativo: number
  criado_em: string
  atualizado_em: string
}

export interface CreateUsuarioDTO {
  id_perfil: number
  nome_completo: string
  email: string
  senha: string
  data_nascimento?: string | null
  genero?: Usuario['genero']
  telefone?: string | null
  foto_perfil_url?: string | null
  registro_profissional?: string | null
  especialidade?: string | null
  consentimento_lgpd?: number
  data_consentimento?: string | null
  ativo?: number
}

export interface UpdateUsuarioDTO {
  id_perfil?: number
  nome_completo?: string
  email?: string
  senha?: string
  data_nascimento?: string | null
  genero?: Usuario['genero']
  telefone?: string | null
  foto_perfil_url?: string | null
  registro_profissional?: string | null
  especialidade?: string | null
  consentimento_lgpd?: number
  data_consentimento?: string | null
  ativo?: number
}

export interface LoginUsuarioDTO {
  email: string
  senha: string
}

export interface PublicUsuario {
  id_usuario: number
  id_perfil: number
  nome_completo: string
  email: string
  data_nascimento: string | null
  genero: Usuario['genero']
  telefone: string | null
  foto_perfil_url: string | null
  registro_profissional: string | null
  especialidade: string | null
  consentimento_lgpd: number
  data_consentimento: string | null
  ativo: number
  criado_em: string
  atualizado_em: string
}

export interface AuthUsuarioResponse {
  token: string
  usuario: Pick<PublicUsuario, 'id_usuario' | 'id_perfil' | 'nome_completo' | 'email'>
}
