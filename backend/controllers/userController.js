// import bcrypt from "bcryptjs";
// import Users from "../models/userModel.js";
// import jwt from "jsonwebtoken";
// // Register user
// export const registerUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         // const user = new Users({
//         //     name,
//         //     email,
//         //     password: hashedPassword,
//         // });
//         // await user.save();
//         const user  = await Users.create({
//             name,
//             email,
//             password: hashedPassword,
//         });
//         res.status(201).json({ user, message: "User registered successfully" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Register payload:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};


// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login payload:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message || "Login error" });
  }
};