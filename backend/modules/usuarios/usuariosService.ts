import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { usuariosRepository } from "./usuariosRepository"
import { AuthUsuarioResponse, CreateUsuarioDTO, LoginUsuarioDTO, PublicUsuario, UpdateUsuarioDTO } from "./usuariosTypes"

const JWT_SECRET = (process.env.JWT_SECRET || "dev-secret") as jwt.Secret
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"]

export const usuariosService = {
  async register(data: CreateUsuarioDTO): Promise<PublicUsuario> {
    if (!data.id_perfil || !data.nome_completo || !data.email || !data.senha) {
      throw new Error("Dados obrigatórios não informados")
    }

    const existente = await usuariosRepository.findByEmail(data.email)

    if (existente) {
      throw new Error("Email já cadastrado")
    }

    const usuario = await usuariosRepository.create(data)

    return {
      ...usuario,
      senha_hash: undefined
    } as PublicUsuario
  },

  async login(data: LoginUsuarioDTO): Promise<AuthUsuarioResponse> {
    const usuario = await usuariosRepository.findByEmail(data.email)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    const senhaValida = bcrypt.compareSync(data.senha, usuario.senha_hash)

    if (!senhaValida) {
      throw new Error("Senha inválida")
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        id_perfil: usuario.id_perfil,
        email: usuario.email,
        nome_completo: usuario.nome_completo
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN
      }
    )

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        id_perfil: usuario.id_perfil,
        nome_completo: usuario.nome_completo,
        email: usuario.email
      }
    }
  },

  async getById(id: number): Promise<PublicUsuario> {
    const usuario = await usuariosRepository.findById(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    return {
      ...usuario,
      senha_hash: undefined
    } as PublicUsuario
  },

  async getAll(idPerfis?: number[]): Promise<PublicUsuario[]> {
    return usuariosRepository.findAll(idPerfis)
  },

  async update(id: number, data: UpdateUsuarioDTO): Promise<PublicUsuario> {
    const usuario = await usuariosRepository.findById(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    const updated = await usuariosRepository.update(id, data)

    return {
      ...updated,
      senha_hash: undefined
    } as PublicUsuario
  },

  async delete(id: number): Promise<void> {
    const usuario = await usuariosRepository.findById(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    await usuariosRepository.delete(id)
  }
}
