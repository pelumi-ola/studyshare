import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import resourceRoutes from "./routes/resourceRoute";
import courseRoutes from "./routes/courseRoutes";
import adminRoutes from "./routes/adminRoutes";
import reportRoutes from "./routes/reportRoutes";
import errorHandler from "./middleware/errorMiddleware";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
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

export default app;
