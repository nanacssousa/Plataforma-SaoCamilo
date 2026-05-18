// Tipos para análises de sudorese
// Estruturas de dados para medições de suor dos atletas

export interface Sudorese {
  id: number
  atletaId: number  // ID do atleta relacionado
  data: string      // Data da medição
  taxaSudoracao: number  // Taxa de sudoração (ml/min)
  perdaPeso: number      // Perda de peso durante o teste (kg)
  observacoes: string    // Observações adicionais
}

// DTO para criar análise de sudorese
export interface CreateSudoreseDTO {
  atletaId: number
  data: string
  taxaSudoracao: number
  perdaPeso: number
  observacoes: string
}