import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", authMiddleware, getExpenses);
router.post("/", authMiddleware, createExpense);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
