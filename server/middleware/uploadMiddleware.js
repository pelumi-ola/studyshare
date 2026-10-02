import multer, { diskStorage } from "multer";
import { join, extname } from "path";
import { mkdirSync } from "fs";

const uploadDir = join(__dirname, "..", "uploads");
mkdirSync(uploadDir, { recursive: true });

// Set up storage engine for multer
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname)); // Generate a unique filename
  },
});

// Set up file filter to allow only specific file types
const ALLOWED = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/plain": [".txt"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const fileFilter = (req, file, cb) => {
  const ext = extname(file.originalname).toLowerCase();
  const exts = ALLOWED[file.mimetype];
  if (exts && exts.includes(ext)) return cb(null, true);
  cb(new Error("Unsupported file type"), false);
};

// Create multer instance with the specified storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;
