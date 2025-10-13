import express from "express";
import { checkSymptoms, getHistory } from "../controllers/symptomController.js";

const router = express.Router();

router.post("/check-symptoms", checkSymptoms);
router.get("/history/:sessionId", getHistory);

export default router;
