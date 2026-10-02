import usermodel from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export async function registerAdmin(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new usermodel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await admin.save();

    const token = generateToken(admin._id, admin.role);
    res.status(201).json({
      message: "Admin registered successfully",
      authToken: token,
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("REGISTERADMIN ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const admin = await usermodel.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(admin._id, admin.role);
    res.status(200).json({ token });
  } catch (error) {
    console.error("LOGINADMIN ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await usermodel.find().select("-password");
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("GETALLUSERS ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await usermodel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await usermodel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETEUSER ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
