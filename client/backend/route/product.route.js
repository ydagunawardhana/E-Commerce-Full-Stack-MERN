import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProductReview,
} from "../controllers/product.controller.js";
import { protect } from "../../../admin/backend/middleware/authMiddleware.js";

const productRouter = Router();

productRouter.get("/", getProducts);

productRouter.get("/:id", getProductById);

productRouter.route("/:id/reviews").post(protect, createProductReview);

export default productRouter;
