import { useEffect, useMemo, useState } from "react";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Operational");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const parseResponse = async (res) => {
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const message =
        data && typeof data === "object" && data.message
          ? data.message
          : typeof data === "string"
          ? data
          : `Request failed with status ${res.status}`;
      throw new Error(message);
    }
    return data;
  };

  const fetchExpenses = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        headers: getHeaders(),
      });
      const data = await parseResponse(res);
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpense = useMemo(
    () => expenses.reduce((sum, item) => sum + (item.amount || 0), 0),
    [expenses]
  );

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Operational");
    setDate("");
    setNotes("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!title || !amount) {
      setError("Please provide a title and amount.");
      return;
    }

    const payload = {
      title,
      amount: Number(amount),
      category,
      date: date || new Date().toISOString().slice(0, 10),
      notes,
    };

    try {
      const url = editId
        ? `http://localhost:5000/api/expenses/${editId}`
        : "http://localhost:5000/api/expenses";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await parseResponse(res);
      setMessage(editId ? "Expense updated" : "Expense added");
      resetForm();
      fetchExpenses();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not save expense");
    }
  };

  const handleEdit = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(new Date(expense.date).toISOString().slice(0, 10));
    setNotes(expense.notes || "");
    setEditId(expense._id);
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await parseResponse(res);
      setMessage("Expense deleted");
      fetchExpenses();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not delete expense");
    }
  };

  return (
    <div className="bg-white rounded shadow p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Farm Expense Tracker</h2>
          <p className="text-sm text-slate-500">Track operational spending and budget trends.</p>
        </div>
        <div className="rounded bg-green-50 px-4 py-2 text-sm text-green-700">
          Total: ${totalExpense.toFixed(2)}
        </div>
      </div>

      {message && <div className="mt-4 rounded bg-green-100 p-3 text-green-800">{message}</div>}
      {error && <div className="mt-4 rounded bg-red-100 p-3 text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 mt-4">
        <div>
          <label className="block text-sm font-medium">Expense Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            placeholder="Seed purchase"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="mt-1 w-full rounded border p-2"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          >
            <option>Operational</option>
            <option>Labor</option>
            <option>Fertilizer</option>
            <option>Pest Control</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded border p-2"
            rows="3"
            placeholder="Optional details..."
          />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button className="rounded bg-green-700 px-4 py-2 text-white" type="submit">
            {editId ? "Update Expense" : "Add Expense"}
          </button>
          {editId && (
            <button className="rounded border px-4 py-2 text-slate-700" type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {expenses.length === 0 ? (
          <p className="text-sm text-slate-500">No expenses yet. Add one above.</p>
        ) : (
          expenses.map((expense) => (
            <div key={expense._id} className="flex flex-col gap-2 rounded border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold">{expense.title}</div>
                <div className="text-sm text-slate-500">{expense.category} • ${expense.amount.toFixed(2)} • {new Date(expense.date).toLocaleDateString()}</div>
                {expense.notes && <div className="text-sm text-slate-600">{expense.notes}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(expense)} className="rounded border px-3 py-1 text-sm text-slate-700">
                  Edit
                </button>
                <button onClick={() => handleDelete(expense._id)} className="rounded bg-red-600 px-3 py-1 text-sm text-white">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
