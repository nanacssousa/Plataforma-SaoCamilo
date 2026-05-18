import { User, CreateUserDTO } from "./userTypes"

let users: User[] = []

export const userRepository = {
  async create(data: CreateUserDTO): Promise<User> {
    const newUser: User = {
      id: users.length + 1,
      ...data
    }

    users.push(newUser)

    return Promise.resolve(newUser)
  },

  async findByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(users.find((u) => u.email === email))
  },

  async findById(id: number): Promise<User | undefined> {
    return Promise.resolve(users.find((u) => u.id === id))
  }
}