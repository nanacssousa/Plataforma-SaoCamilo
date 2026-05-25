import { execute, runOne, runQuery } from "../../shared"
import { CreatePerfilDTO, Perfil, UpdatePerfilDTO } from "./perfilTypes"

export const perfilRepository = {
  async create(data: CreatePerfilDTO): Promise<Perfil> {
    const result = await execute(
      "INSERT INTO perfis (nome, descricao) VALUES (?, ?)",
      [data.nome, data.descricao]
    )

    const created = await runOne<Perfil>(
      "SELECT id_perfil, nome, descricao FROM perfis WHERE id_perfil = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar o perfil")
    }

    return created
  },

  async findById(id: number): Promise<Perfil | undefined> {
    return runOne<Perfil>(
      "SELECT id_perfil, nome, descricao FROM perfis WHERE id_perfil = ?",
      [id]
    )
  },

  async findAll(): Promise<Perfil[]> {
    return runQuery<Perfil>(
      "SELECT id_perfil, nome, descricao FROM perfis ORDER BY id_perfil ASC"
    )
  },

  async update(id: number, data: UpdatePerfilDTO): Promise<Perfil> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.nome !== undefined) {
      fields.push("nome = ?")
      values.push(data.nome)
    }

    if (data.descricao !== undefined) {
      fields.push("descricao = ?")
      values.push(data.descricao)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)

    await execute(
      `UPDATE perfis SET ${fields.join(", ")} WHERE id_perfil = ?`,
      values
    )

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Perfil não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM perfis WHERE id_perfil = ?", [id])
  }
}
