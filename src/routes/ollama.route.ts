import { Router } from "express";
import { ollamaController } from "../controllers/ollama.controller";

const router = Router();

router.post('/comparar-frases', ollamaController.comparePhrases);

export { router as ollamaRouter };