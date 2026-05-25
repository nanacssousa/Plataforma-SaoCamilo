import express from "express"
import {apiRoutes} from "./backend/routes/index"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use("/", apiRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})