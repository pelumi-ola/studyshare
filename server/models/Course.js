import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Course", courseSchema);
