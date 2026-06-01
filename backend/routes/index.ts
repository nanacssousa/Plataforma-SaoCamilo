import { alertaRoutes } from "../modules/alerta"
import { biomarcadorRoutes } from "../modules/biomarcador"
import { biomarcadorMedicaoRoutes } from "../modules/biomarcadorMedicao"
import { calculoHidratacaoRoutes } from "../modules/calculoHidratacao"
import { equipeRoutes } from "../modules/equipe"
import { equipeMembroRoutes } from "../modules/equipeMembro"
import { estrategiaHidratacaoRoutes } from "../modules/estrategiaHidratacao"
import { ingestaoFluidoRoutes } from "../modules/ingestaoFluido"
import { logAuditoriaRoutes } from "../modules/logAuditoria"
import { perfilRoutes } from "../modules/perfil"
import { perfilAtleticoRoutes } from "../modules/perfilAtletico"
import { pesagemRoutes } from "../modules/pesagem"
import { registroCorUrinaRoutes } from "../modules/registroCorUrina"
import { relatorioRoutes } from "../modules/relatorio"
import { sessaoAutenticacaoRoutes } from "../modules/sessaoAutenticacao"
import { sessaoTreinoRoutes } from "../modules/sessaoTreino"
import { tipoExercicioRoutes } from "../modules/tipoExercicio"
import { triagemRoutes } from "../modules/triagem"
import { usuariosRoutes } from "../modules/usuarios"
import { vinculoProfissionalAtletaRoutes } from "../modules/vinculoProfissionalAtleta"
import { volumeUrinarioRoutes } from "../modules/volumeUrinario"
import { ambienteClimaRoutes } from "../modules/ambienteClima"
import { agenteIARoutes } from "../modules/agenteIA"
import { Router } from "express"

const apiRoutes = Router()

apiRoutes.use("/alertas", alertaRoutes)
apiRoutes.use("/biomarcadores", biomarcadorRoutes)
apiRoutes.use("/biomarcador-medicoes", biomarcadorMedicaoRoutes)
apiRoutes.use("/calculos-hidratacao", calculoHidratacaoRoutes)
apiRoutes.use("/equipes", equipeRoutes)
apiRoutes.use("/equipe-membros", equipeMembroRoutes)
apiRoutes.use("/estrategias-hidratacao", estrategiaHidratacaoRoutes)
apiRoutes.use("/ingestao-fluido", ingestaoFluidoRoutes)
apiRoutes.use("/logs-auditoria", logAuditoriaRoutes)
apiRoutes.use("/perfis", perfilRoutes)
apiRoutes.use("/perfil-atletico", perfilAtleticoRoutes)
apiRoutes.use("/pesagens", pesagemRoutes)
apiRoutes.use("/registro-cor-urina", registroCorUrinaRoutes)
apiRoutes.use("/relatorios", relatorioRoutes)
apiRoutes.use("/sessoes-autenticacao", sessaoAutenticacaoRoutes)
apiRoutes.use("/sessoes-treino", sessaoTreinoRoutes)
apiRoutes.use("/tipos-exercicio", tipoExercicioRoutes)
apiRoutes.use("/triagens", triagemRoutes)
apiRoutes.use("/usuarios", usuariosRoutes)
apiRoutes.use("/vinculo-profissional-atleta", vinculoProfissionalAtletaRoutes)
apiRoutes.use("/volume-urinario", volumeUrinarioRoutes)
apiRoutes.use("/ambiente-clima", ambienteClimaRoutes)
apiRoutes.use("/agente-ia", agenteIARoutes)

export { apiRoutes }
