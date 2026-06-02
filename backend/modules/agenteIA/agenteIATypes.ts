export interface ContextoAnalise {
  atleta: { nome: string; idade: number; peso_kg: number; altura_cm: number; modalidade: string; nivel: string; condicao_medica?: string | null; historico_desidratacao_pct?: number | null; }
  sessao: { intensidade: string; duracao_minutos: number | null; tempo_decorrido_min: number; tipo_exercicio: string; local_treino: string | null; agua_ingerida_ml: number; }
  clima: { temperatura_c: number; umidade_pct: number; indice_calor_c: number; condicao: string; fonte: string; }
  pre_sessao?: { peso_pre_kg: number; cor_urina_escala: number; sintomas: string[]; nivel_sede: number; }
  pos_sessao?: { peso_pos_kg: number; variacao_massa_pct: number; taxa_sudorese_lh: number; total_ingestao_ml: number; nivel_desidratacao: string; cor_urina_pos: number | null; }
  historico_recente?: { media_taxa_sudorese: number; media_desidratacao_pct: number; total_sessoes: number; }
}

export interface AgenteIAContrato {
  status_sessao: 'ESTÁVEL' | 'ATENÇÃO' | 'CRÍTICO'
  disparar_alerta_push: boolean
  mensagem_notificacao: string
  recomendacao_hidratacao_ml: number
  analise_clinica_comentario: string
}

export interface AnaliseIAResponse extends AgenteIAContrato {
  prompt_tokens: number
  output_tokens: number
}
