import { isAdmin } from "../middleware/adminMiddleware";
import {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController";
import { protect } from "../middleware/authMiddleware";

import { Router } from "express";
const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

export default router;
