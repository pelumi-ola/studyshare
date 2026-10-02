const express = require("express");
const router = express.Router();
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
} = require("../controllers/resourceController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, upload.single("file"), createResource);
router.get("/", protect, getAllResources);
router.get("/:id", protect, getResourceById);
router.put("/:id", protect, updateResource);
router.delete("/:id", protect, deleteResource);
router.get("/:id/download", protect, downloadResource);

module.exports = router;
