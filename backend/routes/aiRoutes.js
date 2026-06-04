import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getYieldPrediction,
  getFertilizerRecommendation,
  detectCropDisease,
  aiFarmingAssistant,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/yield", authMiddleware, getYieldPrediction);
router.post("/fertilizer", authMiddleware, getFertilizerRecommendation);
router.post("/disease", authMiddleware, detectCropDisease);
router.post("/assistant", authMiddleware, aiFarmingAssistant);

export default router;
