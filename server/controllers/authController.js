const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, department, level } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      department,
      level,
    });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({
      message: "User registered successfully",
      authToken: token,
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      department: newUser.department,
      level: newUser.level,
      role: newUser.role,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);

    res.status(200).json({
      message: "success",
      authToken: token,
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      level: user.level,
      role: user.role,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", error: error.message });
    }
    res.status(200).json({ message: "success", user });
  } catch (error) {
    console.error("ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
