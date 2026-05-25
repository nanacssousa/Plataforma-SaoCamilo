export interface Pesagem {
  id_pesagem: number
  id_sessao: number
  momento: string
  massa_kg: number
  confirmou_sem_tenis: number
  confirmou_sem_acessorios: number
  confirmou_bexiga_vazia: number
  horario_pesagem: string
  observacoes: string | null
}

export interface CreatePesagemDTO {
  id_sessao: number
  momento: string
  massa_kg: number
  confirmou_sem_tenis?: number
  confirmou_sem_acessorios?: number
  confirmou_bexiga_vazia?: number
  observacoes?: string | null
}

export interface UpdatePesagemDTO {
  momento?: string
  massa_kg?: number
  confirmou_sem_tenis?: number
  confirmou_sem_acessorios?: number
  confirmou_bexiga_vazia?: number
  observacoes?: string | null
}
