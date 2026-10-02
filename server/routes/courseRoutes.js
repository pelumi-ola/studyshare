const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const express = require("express");
const router = express.Router();

router.post("/", protect, isAdmin, createCourse);
router.get("/", protect, getAllCourses);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, isAdmin, updateCourse);
router.delete("/:id", protect, isAdmin, deleteCourse);

module.exports = router;
