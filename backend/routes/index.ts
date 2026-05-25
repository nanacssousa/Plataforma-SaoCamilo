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
import { authMiddleware, pool } from "../shared"

export const apiRoutes = {
  alertas: alertaRoutes,
  biomarcadores: biomarcadorRoutes,
  biomarcadorMedicoes: biomarcadorMedicaoRoutes,
  calculosHidratacao: calculoHidratacaoRoutes,
  equipes: equipeRoutes,
  equipeMembros: equipeMembroRoutes,
  estrategiasHidratacao: estrategiaHidratacaoRoutes,
  ingestaoFluido: ingestaoFluidoRoutes,
  logsAuditoria: logAuditoriaRoutes,
  perfis: perfilRoutes,
  perfilAtletico: perfilAtleticoRoutes,
  pesagens: pesagemRoutes,
  registroCorUrina: registroCorUrinaRoutes,
  relatorios: relatorioRoutes,
  sessoesAutenticacao: sessaoAutenticacaoRoutes,
  sessoesTreino: sessaoTreinoRoutes,
  tipoExercicio: tipoExercicioRoutes,
  triagens: triagemRoutes,
  usuarios: usuariosRoutes,
  vinculoProfissionalAtleta: vinculoProfissionalAtletaRoutes,
  volumeUrinario: volumeUrinarioRoutes,
} as const

export const sharedResources = {
  authMiddleware,
  pool,
} as const

export type ApiRouteKey = keyof typeof apiRoutes
export type SharedResourceKey = keyof typeof sharedResources
