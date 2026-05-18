import { userRepository } from "./userRepository"
import { CreateUserDTO, User } from "./userTypes"

export const userService = {
  async create(data: CreateUserDTO): Promise<User> {
    if (!data.nome || !data.email || !data.senha || !data.tipo) {
      throw new Error("Dados obrigatórios não informados")
    }

    const existe = await userRepository.findByEmail(data.email)

    if (existe) {
      throw new Error("Email já cadastrado")
    }

    return userRepository.create(data)
  },

  async getById(id: number): Promise<Omit<User, 'senha'>> {
    const user = await userRepository.findById(id)

    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    // Ocultar senha na resposta
    const { senha, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}