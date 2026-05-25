import { logAuditoriaRepository } from "./logAuditoriaRepository"
import { CreateLogAuditoriaDTO, LogAuditoria, UpdateLogAuditoriaDTO } from "./logAuditoriaTypes"

export const logAuditoriaService = {
  async create(data: CreateLogAuditoriaDTO): Promise<LogAuditoria> {
    if (!data.acao) { throw new Error("acao é obrigatória") }
    return logAuditoriaRepository.create(data)
  },

  async getById(id: number): Promise<LogAuditoria> {
    const log = await logAuditoriaRepository.findById(id)
    if (!log) { throw new Error("Log não encontrado") }
    return log
  },

  async getByUsuario(id_usuario: number): Promise<LogAuditoria[]> {
    return logAuditoriaRepository.findByUsuario(id_usuario)
  },

  async getAll(): Promise<LogAuditoria[]> {
    return logAuditoriaRepository.findAll()
  },

  async update(id: number, data: UpdateLogAuditoriaDTO): Promise<LogAuditoria> {
    await this.getById(id)
    return logAuditoriaRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return logAuditoriaRepository.delete(id)
  }
}