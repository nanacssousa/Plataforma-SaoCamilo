import { execute, runQuery } from "../../shared"
import { CreateEquipeMembroDTO, EquipeMembro, UpdateEquipeMembroDTO } from "./equipeMembroTypes"

export const equipeMembroRepository = {
  async create(data: CreateEquipeMembroDTO): Promise<EquipeMembro> {
    await execute(
      "INSERT INTO equipe_membros (id_equipe, id_usuario, cargo, ativo) VALUES (?, ?, ?, ?)",
      [data.id_equipe, data.id_usuario, data.cargo ?? "MEMBRO", data.ativo ?? 1]
    )

    const [member] = await runQuery<EquipeMembro>(
      "SELECT id_equipe, id_usuario, cargo, ativo, criado_em FROM equipe_membros WHERE id_equipe = ? AND id_usuario = ?",
      [data.id_equipe, data.id_usuario]
    )

    if (!member) {
      throw new Error("Não foi possível criar o vínculo da equipe")
    }

    return member
  },

  async findByEquipe(id_equipe: number): Promise<EquipeMembro[]> {
    return runQuery<EquipeMembro>(
      "SELECT id_equipe, id_usuario, cargo, ativo, criado_em FROM equipe_membros WHERE id_equipe = ? ORDER BY criado_em DESC",
      [id_equipe]
    )
  },

  async findByUsuario(id_usuario: number): Promise<EquipeMembro[]> {
    return runQuery<EquipeMembro>(
      "SELECT id_equipe, id_usuario, cargo, ativo, criado_em FROM equipe_membros WHERE id_usuario = ? ORDER BY criado_em DESC",
      [id_usuario]
    )
  },

  async update(id_equipe: number, id_usuario: number, data: UpdateEquipeMembroDTO): Promise<EquipeMembro> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.cargo !== undefined) {
      fields.push("cargo = ?")
      values.push(data.cargo)
    }

    if (data.ativo !== undefined) {
      fields.push("ativo = ?")
      values.push(data.ativo)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id_equipe, id_usuario)
    await execute(
      `UPDATE equipe_membros SET ${fields.join(", ")} WHERE id_equipe = ? AND id_usuario = ?`,
      values
    )

    const [updated] = await runQuery<EquipeMembro>(
      "SELECT id_equipe, id_usuario, cargo, ativo, criado_em FROM equipe_membros WHERE id_equipe = ? AND id_usuario = ?",
      [id_equipe, id_usuario]
    )

    if (!updated) {
      throw new Error("Vínculo de equipe não encontrado")
    }

    return updated
  },

  async delete(id_equipe: number, id_usuario: number): Promise<void> {
    await execute("DELETE FROM equipe_membros WHERE id_equipe = ? AND id_usuario = ?", [id_equipe, id_usuario])
  }
}
