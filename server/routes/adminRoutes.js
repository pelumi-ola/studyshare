const { isAdmin } = require("../middleware/adminMiddleware");
const {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

module.exports = router;
