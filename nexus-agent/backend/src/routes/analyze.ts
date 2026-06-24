import { Router } from "express";
import { AnalyzeController } from "../controllers/AnalyzeController";

const router = Router();

router.post("/", AnalyzeController.analyzeWallet);

export default router;
