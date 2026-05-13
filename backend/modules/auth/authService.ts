import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { userService } from "../user/userService"
import { userRepository } from "../user/userRepository"

const JWT_SECRET = process.env.JWT_SECRET as string

interface LoginDTO {
  email: string
  password: string
}

interface CadastroDTO {
  nome: string
  email: string
  password: string
  tipo: string
}

export const authService = {
  async login({ email, password }: LoginDTO) {
    const user = await userRepository.findByEmail(email)

    if (!user) {
      throw new Error("Usuário não encontrado!")
    }

    const senhaValida = bcrypt.compareSync(password, user.senha)

    if (!senhaValida) {
      throw new Error("Senha inválida!")
    }

    const token = jwt.sign(
      {
        id: user.id,
        tipo: user.tipo
      },
      JWT_SECRET,
      {
        expiresIn: "1d"
      }
    )

    return {
      user: {
        id: user.id,
        email: user.email
      },
      token
    }
  },

  async cadastrar({
    nome,
    email,
    password,
    tipo
  }: CadastroDTO) {
    const senhaHash = bcrypt.hashSync(password, 10)

    const user = await userService.create({
      nome,
      email,
      senha: senhaHash,
      tipo
    })

    return {
      id: user.id,
      email: user.email
    }
  }
}