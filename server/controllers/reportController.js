const mongoose = require("mongoose");
const reportModal = require("../models/Report");

exports.createReport = async (req, res) => {
  try {
    const { resource, reason, description } = req.body;

    if (!resource || !reason) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(resource)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }
    if (reason.trim() === "") {
      return res.status(400).json({ message: "Reason cannot be empty" });
    }
    if (description && description.trim() === "") {
      return res.status(400).json({ message: "Description cannot be empty" });
    }

    const report = await reportModal.create({
      resource,
      user: req.user._id,
      reason,
      description,
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await reportModal.find().populate("resource user");
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
};

exports.getReportById = async (req, res) => {
  try {
    const report = await reportModal
      .findById(req.params.id)
      .populate("resource user");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await reportModal.findById(req.params.id);

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
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await reportModal.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    await report.deleteOne();
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
