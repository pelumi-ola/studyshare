const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const express = require("express");
const router = express.Router();

router.post("/", protect, createReport);
router.get("/", protect, isAdmin, getAllReports);
router.get("/:id", protect, isAdmin, getReportById);
router.put("/:id", protect, isAdmin, updateReport);
router.delete("/:id", protect, isAdmin, deleteReport);

module.exports = router;
