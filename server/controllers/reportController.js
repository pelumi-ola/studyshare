import { Types } from "mongoose";
import reportModel from "../models/Report.js";

export async function createReport(req, res) {
  try {
    const { resource, reason, description } = req.body;

    if (!resource || !reason) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }
    if (!Types.ObjectId.isValid(resource)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }
    if (reason.trim() === "") {
      return res.status(400).json({ message: "Reason cannot be empty" });
    }
    if (description && description.trim() === "") {
      return res.status(400).json({ message: "Description cannot be empty" });
    }

    const report = await reportModel.create({
      resource,
      user: req.user._id,
      reason,
      description,
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllReports(req, res) {
  try {
    const reports = await reportModel.find().populate("resource user");
    if (!reports) {
      return res.status(404).json({ message: "No reports found" });
    }
    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports found" });
    }
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getReportById(req, res) {
  try {
    const report = await reportModel
      .findById(req.params.id)
      .populate("resource user");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateReport(req, res) {
  try {
    const report = await reportModel.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    const { status } = req.body;

    if (status) {
      report.status = status;
    }

    await report.save();

    res.status(200).json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function deleteReport(req, res) {
  try {
    const report = await reportModel.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    await report.deleteOne();
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
