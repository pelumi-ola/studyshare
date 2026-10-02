import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    department: {
      type: String,
      trim: true,
    },

    level: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

export default model("User", userSchema);
