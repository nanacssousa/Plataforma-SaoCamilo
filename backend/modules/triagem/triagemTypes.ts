export interface Triagem {
  id_triagem: number
  id_sessao: number
  marca_branca_roupa: number
  irritacao_ocular: number
  gosto_salgado_labios: number
  sensacao_sede: number
  dor_cabeca: number
  cansaco_excessivo: number
  tontura: number
  caibras: number
  nausea: number
  escala_borg: number | null
  observacoes_livres: string | null
  criado_em: string
}

export interface CreateTriagemDTO {
  id_sessao: number
  marca_branca_roupa?: number
  irritacao_ocular?: number
  gosto_salgado_labios?: number
  sensacao_sede?: number
  dor_cabeca?: number
  cansaco_excessivo?: number
  tontura?: number
  caibras?: number
  nausea?: number
  escala_borg?: number | null
  observacoes_livres?: string | null
}

export interface UpdateTriagemDTO {
  marca_branca_roupa?: number
  irritacao_ocular?: number
  gosto_salgado_labios?: number
  sensacao_sede?: number
  dor_cabeca?: number
  cansaco_excessivo?: number
  tontura?: number
  caibras?: number
  nausea?: number
  escala_borg?: number | null
  observacoes_livres?: string | null
}
