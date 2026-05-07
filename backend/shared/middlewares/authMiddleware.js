const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({ error: "Token não fornecido" })
        }

        // formato: Bearer TOKEN
        const [, token] = authHeader.split(" ")

        if (!token) {
            return res.status(401).json({ error: "Token inválido" })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        // salvar dados do usuário na request
        req.user = decoded

        return next()
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" })
    }
}

module.exports = { authMiddleware }