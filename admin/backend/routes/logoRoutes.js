import express from "express";
import multer from "multer";
import path from "path";
import { getLogo, updateLogo } from "../controllers/logoController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer Config (Images Save)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Routes
router
  .route("/")
  .get(getLogo)
  .post(protect, admin, upload.single("image"), updateLogo);

// ES Module Export
export default router;
