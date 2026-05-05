const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { usuarioService } = require("../user/userService")
const { usuarioRepository } = require("../user/userRepository")

const JWT_SECRET = process.env.JWT_SECRET

const login = async ({ email, password }) => {
    const user = usuarioRepository.findByEmail(email)

    if (!user) throw new Error("Usuário não encontrado!")

    const senhaValida = bcrypt.compareSync(password, user.senha)

    if (!senhaValida) throw new Error("Senha inválida!")

    const token = jwt.sign(
        { id: user.id, tipo: user.tipo },
        JWT_SECRET,
        { expiresIn: "1d" }
    )

    return {
        user: {
            id: user.id,
            email: user.email
        },
        token
    }
}

const cadastrar = async ({ nome, email, password, tipo }) => {

    const senhaHash = bcrypt.hashSync(password, 10)

    const user = usuarioService.create({
        nome,
        email,
        senha: senhaHash,
        tipo
    })

    return {
        id: user.id,
        email: user.email
    }
}

module.exports = {
    login,
    cadastrar
}