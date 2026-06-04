import userRoutes from "./routes/userRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env");
const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
  console.error("Failed to load .env from", envPath, envResult.error);
}
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables. Check .env and restart.");
  process.exit(1);
}

const app = express();

// middleware
app.use(cors(
{
  origin:["http://localhost:5173", "http://localhost:5174", "https://smart-farming-three.vercel.app/"],
  credentials: true
}));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);
//MongoDB connection
mongoose
.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Mongo Error:", err.message));

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// server start
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
