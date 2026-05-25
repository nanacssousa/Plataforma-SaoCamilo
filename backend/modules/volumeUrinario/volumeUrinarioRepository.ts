import { execute, runOne, runQuery } from "../../shared"
import { CreateVolumeUrinarioDTO, UpdateVolumeUrinarioDTO, VolumeUrinario } from "./volumeUrinarioTypes"

export const volumeUrinarioRepository = {
  async create(data: CreateVolumeUrinarioDTO): Promise<VolumeUrinario> {
    const result = await execute(
      "INSERT INTO volumes_urinarios (id_sessao, volume_ml) VALUES (?, ?)",
      [data.id_sessao, data.volume_ml]
    )

    const created = await runOne<VolumeUrinario>(
      "SELECT id_volume_urinario, id_sessao, volume_ml, horario_registro FROM volumes_urinarios WHERE id_volume_urinario = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar o volume urinário")
    }

    return created
  },

  async findById(id: number): Promise<VolumeUrinario | undefined> {
    return runOne<VolumeUrinario>(
      "SELECT id_volume_urinario, id_sessao, volume_ml, horario_registro FROM volumes_urinarios WHERE id_volume_urinario = ?",
      [id]
    )
  },

  async findBySessao(id_sessao: number): Promise<VolumeUrinario[]> {
    return runQuery<VolumeUrinario>(
      "SELECT id_volume_urinario, id_sessao, volume_ml, horario_registro FROM volumes_urinarios WHERE id_sessao = ? ORDER BY horario_registro DESC",
      [id_sessao]
    )
  },

  async findAll(): Promise<VolumeUrinario[]> {
    return runQuery<VolumeUrinario>(
      "SELECT id_volume_urinario, id_sessao, volume_ml, horario_registro FROM volumes_urinarios ORDER BY horario_registro DESC"
    )
  },

  async update(id: number, data: UpdateVolumeUrinarioDTO): Promise<VolumeUrinario> {
    if (data.volume_ml === undefined) {
      throw new Error("Nenhum campo para atualizar")
    }

    await execute("UPDATE volumes_urinarios SET volume_ml = ? WHERE id_volume_urinario = ?", [data.volume_ml, id])

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Volume urinário não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM volumes_urinarios WHERE id_volume_urinario = ?", [id])
  }
}
