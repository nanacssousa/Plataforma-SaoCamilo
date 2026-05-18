// Definições de tipos para o módulo de nutricionistas
// Interfaces que representam a estrutura de dados dos nutricionistas

export interface Nutricionista {
  id: number
  nome: string
  email: string
  crn: string  // Conselho Regional de Nutrição
  especialidade: string
}

// DTO para criação de nutricionista
export interface CreateNutricionistaDTO {
  nome: string
  email: string
  crn: string
  especialidade: string
}