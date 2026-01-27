import express from "express";
import multer from "multer";
import path from "path";

// Controllers Import
import {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
  deleteReview,
  createProductReview,
} from "../controllers/productController.js";

// Security Middleware (Admin  create/update/delete )
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `prod-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Images  (Gallery + Banner)
const cpUpload = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "bannerImage", maxCount: 1 },
]);

//  Routes
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, cpUpload, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, cpUpload, updateProduct);

router.delete("/:productId/reviews/:reviewId", protect, admin, deleteReview);

router.route("/:id/reviews").post(protect, createProductReview);

export default router;
