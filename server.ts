import express from "express"
import cors from "cors"
import {apiRoutes} from "./backend/routes/index"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: "*",
}))

app.use(express.json())

app.use("/", apiRoutes)

process.on("uncaughtException", (err) => {
  console.error("ERRO NÃO TRATADO:", err.message)
  console.error(err.stack)
})

process.on("unhandledRejection", (reason) => {
  console.error("PROMISE REJEITADA:", reason)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})