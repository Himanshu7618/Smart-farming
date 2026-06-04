import express from "express";
import { registerUser, loginUser} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware,async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});
export default router;
