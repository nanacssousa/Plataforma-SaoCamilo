import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

const JWT_SECRET = process.env.JWT_SECRET as string

interface AuthRequest extends Request {
    user?: any
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
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

export { authMiddleware }