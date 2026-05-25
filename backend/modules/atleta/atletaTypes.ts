// Definições de tipos para o módulo de atletas
// Este arquivo contém as interfaces que representam a estrutura de dados dos atletas

export interface Atleta {
  id: number
  nome: string
  email: string
  dataNascimento: string
  peso: number
  altura: number
  posicao: string
  equipe: string
}

// DTO para criação de atleta, sem o campo id que é gerado automaticamente
export interface CreateAtletaDTO {
  nome: string
  email: string
  dataNascimento: string
  peso: number
  altura: number
  posicao: string
  equipe: string
}