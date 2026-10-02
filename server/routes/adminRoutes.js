import { isAdmin } from "../middleware/adminMiddleware.js";
import {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

import { Router } from "express";
const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

export default router;
