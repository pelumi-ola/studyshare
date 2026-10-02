import resourceModel from "../models/Resource.js";
import courseModel from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";
import { unlinkSync, existsSync } from "fs";

export async function createResource(req, res) {
  try {
    const {
      title,
      description,
      course,
      resourceType,
      sharingPermissionConfirmed,
    } = req.body;
    if (
      !title ||
      !description ||
      !course ||
      !resourceType ||
      !sharingPermissionConfirmed
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resource file",
      });
    }

    const existingCourse = await courseModel._findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (sharingPermissionConfirmed !== "true") {
      return res.status(400).json({
        message:
          "You must confirm that you have permission to share this resource",
      });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "studyshare/resources",
      resource_type: "raw",
    });

    // Create resource in MongoDB
    const resource = await resourceModel.create({
      title,
      description,
      course,
      resourceType,

      fileUrl: result.secure_url,
      publicId: result.public_id,

      fileName: req.file.originalname,
      fileSize: req.file.size,

      uploadedBy: req.user._id,

      sharingPermissionConfirmed: true,
    });

    // Delete temporary local file
    unlinkSync(req.file.path);

    res
      .status(201)
      .json({ message: "Resource uploaded successfully", resource });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    // Remove temporary file if Cloudinary/MongoDB fails
    if (req.file && existsSync(req.file.path)) {
      unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({ message: "Error uploading resource", error: error.message });
  }
}

export async function getAllResources(req, res) {
  try {
    const { search, resourceType, courseId, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    // Filter by resource type
    if (resourceType) {
      filter.resourceType = resourceType;
    }

    // Filter by course
    if (courseId) {
      const course = await resourceModel._findById(courseId);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      filter.course = courseId;
    }

    // Pagination
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const resources = await resourceModel
      .find(filter)
      .populate("course")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalResources = await countDocuments(filter);

    const totalPages = Math.ceil(totalResources / limitNumber);

    res.status(200).json({
      message: "Resources retrieved successfully",
      resources,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalResources,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("GET RESOURCES ERROR:", error);

    res.status(500).json({
      message: "Error retrieving resources",
      error: error.message,
    });
  }
}

export async function getResourceById(req, res) {
  try {
    const resource = await resourceModel
      .findById(req.params.id)
      .populate("course");
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res
      .status(200)
      .json({ message: "Resource retrieved successfully", resource });
  } catch (error) {
    console.error("GET RESOURCE ERROR:", error);

    res.status(500).json({
      message: "Error retrieving resource",
      error: error.message,
    });
  }
}

export async function deleteResource(req, res) {
  try {
    const resource = await resourceModel
      .findById(req.params.id)
      .populate("course");
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    const isOwner = resource.uploadedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this resource" });
    }
    await cloudinary.uploader.destroy(resource.publicId, {
      resource_type: "raw",
    });

    await resource.deleteOne();

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      message: "Error deleting resource",
      error: error.message,
    });
  }
}

export async function updateResource(req, res) {
  try {
    const resource = await resourceModel.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this resource",
      });
    }
    const { title, description, course, resourceType } = req.body;
    if (course) {
      const existingCourse = await resourceModel_findById(course);

      if (!existingCourse) {
        return res.status(404).json({
          message: "Course not found",
        });
      }
      resource.course = course;
    }

    if (title) resource.title = title;
    if (description) resource.description = description;
    if (resourceType) resource.resourceType = resourceType;

    const updatedResource = await resource.save();
    await updatedResource.populate("course");
    res
      .status(200)
      .json({ message: "Resource updated successfully", resource });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      message: "Error updating resource",
      error: error.message,
    });
  }
}

export async function getResourcesByCourse(req, res) {
  try {
    const { courseId } = req.params;
    const course = await resourceModel._findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const resources = await find({ course: courseId }).populate("course");
    res
      .status(200)
      .json({ message: "Resources retrieved successfully", resources });
  } catch (error) {
    console.error("GET RESOURCES BY COURSE ERROR:", error);
    res.status(500).json({
      message: "Error retrieving resources by course",
      error: error.message,
    });
  }
}

export async function getResourcesByUser(req, res) {
  try {
    const resources = await resourceModel
      .find({ uploadedBy: req.user._id })
      .populate("course");
    res
      .status(200)
      .json({ message: "Resources retrieved successfully", resources });
  } catch (error) {
    console.error("GET RESOURCES BY USER ERROR:", error);
    res.status(500).json({
      message: "Error retrieving resources by user",
      error: error.message,
    });
  }
}

export async function downloadResource(req, res) {
  try {
    const resource = await resourceModel.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true },
    );
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const url = cloudinary.utils.private_download_url(resource.publicId, "", {
      resource_type: "raw",
      type: "upload",
      attachment: resource.fileName,
      expires_at: Math.floor(Date.now() / 1000) + 60, // link valid for 60s
    });

    res.json({ url });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading resource", error: error.message });
  }
}
