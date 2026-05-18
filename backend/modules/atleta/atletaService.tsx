// Serviço para atletas - lógica de negócio
// Contém regras de validação e processamento dos dados dos atletas

import { atletaRepository } from "./atletaRepository"
import { CreateAtletaDTO, Atleta } from "./atletaTypes"

export const atletaService = {
  // Cria um novo atleta com validações
  async create(data: CreateAtletaDTO): Promise<Atleta> {
    // Validação dos campos obrigatórios
    if (!data.nome || !data.email || !data.dataNascimento || !data.peso || !data.altura || !data.posicao || !data.equipe) {
      throw new Error("Dados obrigatórios não informados")
    }

    // Verifica se já existe atleta com o mesmo email
    const existe = await atletaRepository.findByEmail(data.email)

    if (existe) {
      throw new Error("Email já cadastrado")
    }

    // Cria o atleta no repositório
    return atletaRepository.create(data)
  },

  // Busca atleta por ID, lança erro se não encontrado
  async getById(id: number): Promise<Atleta> {
    const atleta = await atletaRepository.findById(id)

    if (!atleta) {
      throw new Error("Atleta não encontrado")
    }

    return atleta
  },

  // Retorna todos os atletas
  async getAll(): Promise<Atleta[]> {
    return atletaRepository.findAll()
  }
}