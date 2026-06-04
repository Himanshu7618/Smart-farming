import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createCrop, getCrops, updateCrop, deleteCrop } from "../controllers/cropController.js";

const router = express.Router();

router.post("/", authMiddleware, createCrop);
router.get("/", authMiddleware, getCrops);
router.put("/:id", authMiddleware, updateCrop);
router.delete("/:id", authMiddleware, deleteCrop);

export default router;
