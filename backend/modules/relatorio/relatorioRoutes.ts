import { Router } from "express";
import { relatorioController } from "./relatorioController";

const router = Router();

router.post("/", relatorioController.create);
router.get("/", relatorioController.getAll);
router.get("/painel/pdf", relatorioController.gerarPdfPainel);
router.get("/atleta/:id_atleta", relatorioController.getByAtleta);
router.get(
  "/solicitante/:id_solicitante",
  relatorioController.getBySolicitante,
);
router.get("/equipe/:id_equipe", relatorioController.getByEquipe);
router.get("/:id", relatorioController.getById);
router.put("/:id", relatorioController.update);
router.delete("/:id", relatorioController.delete);

export default router;
