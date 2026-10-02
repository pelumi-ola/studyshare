import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import { protect } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

import { Router } from "express";
const router = Router();

router.post("/", protect, isAdmin, createCourse);
router.get("/", protect, getAllCourses);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, isAdmin, updateCourse);
router.delete("/:id", protect, isAdmin, deleteCourse);

export default router;
