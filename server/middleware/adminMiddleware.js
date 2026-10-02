const usermodel = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const admin = await usermodel.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { isAdmin };
