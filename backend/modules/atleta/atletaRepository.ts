// Repositório para atletas - camada de acesso aos dados
// Responsável por armazenar e recuperar dados dos atletas
// Atualmente usa armazenamento em memória (array), pode ser substituído por banco de dados

import { Atleta, CreateAtletaDTO } from "./atletaTypes"

let atletas: Atleta[] = []

export const atletaRepository = {
  // Cria um novo atleta e adiciona ao array
  async create(data: CreateAtletaDTO): Promise<Atleta> {
    const novoAtleta: Atleta = {
      id: atletas.length + 1, // ID simples baseado no tamanho do array
      ...data
    }

    atletas.push(novoAtleta)

    return Promise.resolve(novoAtleta)
  },

  // Busca atleta por email
  async findByEmail(email: string): Promise<Atleta | undefined> {
    return Promise.resolve(atletas.find((a) => a.email === email))
  },

  // Busca atleta por ID
  async findById(id: number): Promise<Atleta | undefined> {
    return Promise.resolve(atletas.find((a) => a.id === id))
  },

  // Retorna todos os atletas
  async findAll(): Promise<Atleta[]> {
    return Promise.resolve(atletas)
  }
}