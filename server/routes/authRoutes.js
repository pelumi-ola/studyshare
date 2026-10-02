import { Router } from "express";
const router = Router();
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

export default router;
