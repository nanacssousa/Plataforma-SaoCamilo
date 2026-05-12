// Enquanto não houver o banco de dados, será usado dados genéricos
let usuarios = []

const usuarioRepository = {
  create(data) {
    const novoUsuario = {
      id: usuarios.length + 1,
      ...data
    }

    usuarios.push(novoUsuario)
    return novoUsuario
  },

  findByEmail(email) {
    return usuarios.find(u => u.email === email)
  },

  findById(id) {
    return usuarios.find(u => u.id === id)
  }
}

module.exports = { usuarioRepository }