const { usuarioService } = require("./userService")

const usuarioController = {
  create(req, res) {
    try {
      const usuario = usuarioService.create(req.body)
      return res.status(201).json(usuario)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  },

  getById(req, res) {
    try {
      const id = Number(req.params.id)
      const usuario = usuarioService.getById(id)
      return res.json(usuario)
    } catch (err) {
      return res.status(404).json({ error: err.message })
    }
  }
}

module.exports = { usuarioController }