import { Router } from "express";
const router = Router();
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
} from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { single } from "../middleware/uploadMiddleware.js";

router.post("/", protect, single("file"), createResource);
router.get("/", protect, getAllResources);
router.get("/:id", protect, getResourceById);
router.put("/:id", protect, updateResource);
router.delete("/:id", protect, deleteResource);
router.get("/:id/download", protect, downloadResource);

export default router;
