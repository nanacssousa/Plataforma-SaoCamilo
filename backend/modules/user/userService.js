const { usuarioRepository } = require("./userRepository")

const usuarioService = {
  create(data) {
    // validações básicas
    if (!data.nome || !data.email || !data.senha || !data.tipo) {
      throw new Error("Dados obrigatórios não informados")
    }

    const existe = usuarioRepository.findByEmail(data.email)

    if (existe) {
      throw new Error("Email já cadastrado")
    }

    return usuarioRepository.create(data)
  },

  getById(id) {
    const usuario = usuarioRepository.findById(id)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    return usuario
  }
}

module.exports = { usuarioService }