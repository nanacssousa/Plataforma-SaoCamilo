import { execute, runOne, runQuery } from "../../shared"
import { CreatePerfilAtleticoDTO, PerfilAtletico, UpdatePerfilAtleticoDTO } from "./perfilAtleticoTypes"

export const perfilAtleticoRepository = {
  async create(data: CreatePerfilAtleticoDTO): Promise<PerfilAtletico> {
    await execute(
      "INSERT INTO perfis_atleticos (id_usuario, modalidade, nivel, altura_cm, peso_habitual_kg, condicao_medica, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [data.id_usuario, data.modalidade, data.nivel ?? "INICIANTE", data.altura_cm ?? null, data.peso_habitual_kg ?? null, data.condicao_medica ?? null, data.observacoes ?? null]
    )

    const created = await runOne<PerfilAtletico>(
      "SELECT id_perfil_atletico, id_usuario, modalidade, nivel, altura_cm, peso_habitual_kg, condicao_medica, observacoes, criado_em, atualizado_em FROM perfis_atleticos WHERE id_usuario = ?",
      [data.id_usuario]
    )

    if (!created) {
      throw new Error("Não foi possível criar o perfil atlético")
    }

    return created
  },

  async findById(id: number): Promise<PerfilAtletico | undefined> {
    return runOne<PerfilAtletico>(
      "SELECT id_perfil_atletico, id_usuario, modalidade, nivel, altura_cm, peso_habitual_kg, condicao_medica, observacoes, criado_em, atualizado_em FROM perfis_atleticos WHERE id_perfil_atletico = ?",
      [id]
    )
  },

  async findByUsuario(id_usuario: number): Promise<PerfilAtletico | undefined> {
    return runOne<PerfilAtletico>(
      "SELECT id_perfil_atletico, id_usuario, modalidade, nivel, altura_cm, peso_habitual_kg, condicao_medica, observacoes, criado_em, atualizado_em FROM perfis_atleticos WHERE id_usuario = ?",
      [id_usuario]
    )
  },

  async findAll(): Promise<PerfilAtletico[]> {
    return runQuery<PerfilAtletico>(
      "SELECT id_perfil_atletico, id_usuario, modalidade, nivel, altura_cm, peso_habitual_kg, condicao_medica, observacoes, criado_em, atualizado_em FROM perfis_atleticos ORDER BY criado_em DESC"
    )
  },

  async update(id: number, data: UpdatePerfilAtleticoDTO): Promise<PerfilAtletico> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.modalidade !== undefined) {
      fields.push("modalidade = ?")
      values.push(data.modalidade)
    }

    if (data.nivel !== undefined) {
      fields.push("nivel = ?")
      values.push(data.nivel)
    }

    if (data.altura_cm !== undefined) {
      fields.push("altura_cm = ?")
      values.push(data.altura_cm)
    }

    if (data.peso_habitual_kg !== undefined) {
      fields.push("peso_habitual_kg = ?")
      values.push(data.peso_habitual_kg)
    }

    if (data.condicao_medica !== undefined) {
      fields.push("condicao_medica = ?")
      values.push(data.condicao_medica)
    }

    if (data.observacoes !== undefined) {
      fields.push("observacoes = ?")
      values.push(data.observacoes)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE perfis_atleticos SET ${fields.join(", ")} WHERE id_perfil_atletico = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Perfil atlético não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM perfis_atleticos WHERE id_perfil_atletico = ?", [id])
  }
}
