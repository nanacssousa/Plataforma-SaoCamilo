// Tipos para sessões de treino
// Estruturas de dados para registros de treinos dos atletas

export interface Treino {
  id: number
  atletaId: number  // ID do atleta
  data: string      // Data do treino
  tipo: string      // Tipo de treino (ex: musculação, corrida)
  duracao: number   // Duração em minutos
  intensidade: string  // Intensidade (baixa, média, alta)
  observacoes: string  // Observações do treinador
}

// DTO para criar sessão de treino
export interface CreateTreinoDTO {
  atletaId: number
  data: string
  tipo: string
  duracao: number
  intensidade: string
  observacoes: string
}