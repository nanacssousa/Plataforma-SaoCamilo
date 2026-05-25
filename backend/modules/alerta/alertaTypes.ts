export interface Alerta {
  id_alerta: number
  id_usuario: number
  id_sessao: number | null
  id_calculo: number | null
  tipo_alerta: string
  mensagem: string
  nivel_urgencia: string
  lido: number
  lido_em: string | null
  enviado_push: number
  criado_em: string
}

export interface CreateAlertaDTO {
  id_usuario: number
  id_sessao?: number | null
  id_calculo?: number | null
  tipo_alerta: string
  mensagem: string
  nivel_urgencia?: string
  lido?: number
  enviado_push?: number
}

export interface UpdateAlertaDTO {
  lido?: number
  lido_em?: string | null
  enviado_push?: number
}
