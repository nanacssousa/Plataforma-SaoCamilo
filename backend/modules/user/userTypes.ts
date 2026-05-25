export interface User {
  id: number
  nome: string
  email: string
  senha: string
  tipo: string
}

export interface CreateUserDTO {
  nome: string
  email: string
  senha: string
  tipo: string
}