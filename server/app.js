const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoute");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "StudyShare API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/reports", reportRoutes);

app.use(errorHandler);

module.exports = app;
