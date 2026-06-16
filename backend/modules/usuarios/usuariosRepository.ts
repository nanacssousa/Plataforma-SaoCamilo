import bcrypt from "bcrypt"
import { execute, runOne, runQuery } from "../../shared"
import { CreateUsuarioDTO, PublicUsuario, UpdateUsuarioDTO, Usuario } from "./usuariosTypes"

function toPublicUsuario(usuario: Usuario): PublicUsuario {
  const {
    senha_hash,
    ...publicUser
  } = usuario

  return publicUser
}

export const usuariosRepository = {
  async create(data: CreateUsuarioDTO): Promise<Usuario> {
    const senha_hash = bcrypt.hashSync(data.senha, 10)
    const result = await execute(
      `INSERT INTO usuarios (
        id_perfil,
        nome_completo,
        email,
        senha_hash,
        data_nascimento,
        genero,
        telefone,
        foto_perfil_url,
        registro_profissional,
        especialidade,
        consentimento_lgpd,
        data_consentimento,
        ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        data.id_perfil,
        data.nome_completo,
        data.email,
        senha_hash,
        data.data_nascimento ?? null,
        data.genero ?? null,
        data.telefone ?? null,
        data.foto_perfil_url ?? null,
        data.registro_profissional ?? null,
        data.especialidade ?? null,
        data.consentimento_lgpd ?? 0,
        data.data_consentimento ?? null,
        data.ativo ?? 1
      ]
    )

    const created = await runOne<Usuario>(
      `SELECT
        id_usuario,
        id_perfil,
        nome_completo,
        email,
        senha_hash,
        data_nascimento,
        genero,
        telefone,
        foto_perfil_url,
        registro_profissional,
        especialidade,
        consentimento_lgpd,
        data_consentimento,
        ativo,
        criado_em,
        atualizado_em
      FROM usuarios
      WHERE id_usuario = ?`,
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar o usuário")
    }

    return created
  },

  async findByEmail(email: string): Promise<Usuario | undefined> {
    return runOne<Usuario>(
      `SELECT
        id_usuario,
        id_perfil,
        nome_completo,
        email,
        senha_hash,
        data_nascimento,
        genero,
        telefone,
        foto_perfil_url,
        registro_profissional,
        especialidade,
        consentimento_lgpd,
        data_consentimento,
        ativo,
        criado_em,
        atualizado_em
      FROM usuarios
      WHERE email = ?`,
      [email]
    )
  },

  async findById(id: number): Promise<Usuario | undefined> {
    return runOne<Usuario>(
      `SELECT
        id_usuario,
        id_perfil,
        nome_completo,
        email,
        senha_hash,
        data_nascimento,
        genero,
        telefone,
        foto_perfil_url,
        registro_profissional,
        especialidade,
        consentimento_lgpd,
        data_consentimento,
        ativo,
        criado_em,
        atualizado_em
      FROM usuarios
      WHERE id_usuario = ?`,
      [id]
    )
  },

  async findAll(idPerfis?: number[]): Promise<PublicUsuario[]> {
    let sql = `SELECT
        id_usuario,
        id_perfil,
        nome_completo,
        email,
        senha_hash,
        data_nascimento,
        genero,
        telefone,
        foto_perfil_url,
        registro_profissional,
        especialidade,
        consentimento_lgpd,
        data_consentimento,
        ativo,
        criado_em,
        atualizado_em
      FROM usuarios`
    const params: unknown[] = []

    if (idPerfis && idPerfis.length > 0) {
      const placeholders = idPerfis.map(() => "?").join(", ")
      sql += ` WHERE id_perfil IN (${placeholders})`
      params.push(...idPerfis)
    }

    sql += ` ORDER BY id_usuario ASC`

    const usuarios = await runQuery<Usuario>(sql, params)

    return usuarios.map(toPublicUsuario)
  },

  async update(id: number, data: UpdateUsuarioDTO): Promise<Usuario> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.id_perfil !== undefined) {
      fields.push("id_perfil = ?")
      values.push(data.id_perfil)
    }

    if (data.nome_completo !== undefined) {
      fields.push("nome_completo = ?")
      values.push(data.nome_completo)
    }

    if (data.email !== undefined) {
      fields.push("email = ?")
      values.push(data.email)
    }

    if (data.senha !== undefined) {
      fields.push("senha_hash = ?")
      values.push(bcrypt.hashSync(data.senha, 10))
    }

    if (data.data_nascimento !== undefined) {
      fields.push("data_nascimento = ?")
      values.push(data.data_nascimento)
    }

    if (data.genero !== undefined) {
      fields.push("genero = ?")
      values.push(data.genero)
    }

    if (data.telefone !== undefined) {
      fields.push("telefone = ?")
      values.push(data.telefone)
    }

    if (data.foto_perfil_url !== undefined) {
      fields.push("foto_perfil_url = ?")
      values.push(data.foto_perfil_url)
    }

    if (data.registro_profissional !== undefined) {
      fields.push("registro_profissional = ?")
      values.push(data.registro_profissional)
    }

    if (data.especialidade !== undefined) {
      fields.push("especialidade = ?")
      values.push(data.especialidade)
    }

    if (data.consentimento_lgpd !== undefined) {
      fields.push("consentimento_lgpd = ?")
      values.push(data.consentimento_lgpd)
    }

    if (data.data_consentimento !== undefined) {
      fields.push("data_consentimento = ?")
      values.push(data.data_consentimento)
    }

    if (data.ativo !== undefined) {
      fields.push("ativo = ?")
      values.push(data.ativo)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)

    await execute(`UPDATE usuarios SET ${fields.join(", ")} WHERE id_usuario = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Usuário não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM usuarios WHERE id_usuario = ?", [id])
  }
}
