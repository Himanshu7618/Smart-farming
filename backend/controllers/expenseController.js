import Expense from "../models/expenseModel.js";

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({ message: "Could not fetch expenses" });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    if (!title || amount == null) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date ? new Date(date) : Date.now(),
      notes,
    });

    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    console.error("Create Expense Error:", error);
    res.status(500).json({ message: "Could not create expense" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, amount, category, date, notes } = req.body;
    expense.title = title ?? expense.title;
    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.date = date ? new Date(date) : expense.date;
    expense.notes = notes ?? expense.notes;
    await expense.save();

    res.json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({ message: "Could not update expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Could not delete expense" });
  }
};
