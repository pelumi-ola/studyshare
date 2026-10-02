const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    resourceType: {
      type: String,
      required: true,
      enum: [
        "lecture-note",
        "past-question",
        "study-guide",
        "course-summary",
        "assignment",
        "other",
      ],
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sharingPermissionConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },

    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

resourceSchema.index({
  title: "text",
  description: "text",
  fileName: "text",
});

module.exports = mongoose.model("Resource", resourceSchema);
