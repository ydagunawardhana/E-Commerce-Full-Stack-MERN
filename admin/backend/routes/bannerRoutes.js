import express from "express";
import multer from "multer";
import path from "path";
// functions import
import {
  createBanner,
  getBanners,
  deleteBanner,
  updateBanner,
  getBannerById,
} from "../controllers/bannerController.js";

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `banner-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

//  Routes
router.route("/").post(upload.single("image"), createBanner).get(getBanners);

router
  .route("/:id")
  .get(getBannerById)
  .put(upload.single("image"), updateBanner)
  .delete(deleteBanner);

export default router;
