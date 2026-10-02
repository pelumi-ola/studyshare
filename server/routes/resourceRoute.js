import { Router } from "express";
const router = Router();
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
} from "../controllers/resourceController";
import { protect } from "../middleware/authMiddleware";
import { single } from "../middleware/uploadMiddleware";

router.post("/", protect, single("file"), createResource);
router.get("/", protect, getAllResources);
router.get("/:id", protect, getResourceById);
router.put("/:id", protect, updateResource);
router.delete("/:id", protect, deleteResource);
router.get("/:id/download", protect, downloadResource);

export default router;
