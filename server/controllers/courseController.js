import courseModel from "../models/Course.js";

export async function createCourse(req, res) {
  try {
    const { courseCode, courseTitle, department, level } = req.body;

    if (!courseCode || !courseTitle || !department || !level) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const existingCourse = await courseModel.findOne({
      courseCode: courseCode.toUpperCase(),
    });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course already exists",
      });
    }

    const course = await courseModel.create({
      courseCode,
      courseTitle,
      department,
      level,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);

    res.status(500).json({
      message: "Error creating course",
      error: error.message,
    });
  }
}

export async function getAllCourses(req, res) {
  try {
    const courses = await courseModel.find().sort({
      courseCode: 1,
    });

    res.status(200).json({
      message: "Courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);

    res.status(500).json({
      message: "Error retrieving courses",
      error: error.message,
    });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await courseModel.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course retrieved successfully",
      course,
    });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);

    res.status(500).json({
      message: "Error retrieving course",
      error: error.message,
    });
  }
}

export async function updateCourse(req, res) {
  try {
    const { courseCode, courseTitle, department, level } = req.body;
    const course = await courseModel.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const updatedCourse = await courseModel.findByIdAndUpdate(
      req.params.id,
      {
        courseCode,
        courseTitle,
        department,
        level,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);

    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
}

export async function deleteCourse(req, res) {
  try {
    const course = await courseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    await course.deleteOne();
    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({
      message: "Error deleting course",
      error: error.message,
    });
  }
}
