import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../controllers/reportController";
import { protect } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

import { Router } from "express";
const router = Router();

router.post("/", protect, createReport);
router.get("/", protect, isAdmin, getAllReports);
router.get("/:id", protect, isAdmin, getReportById);
router.put("/:id", protect, isAdmin, updateReport);
router.delete("/:id", protect, isAdmin, deleteReport);

export default router;
