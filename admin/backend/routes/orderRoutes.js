import express from "express";
import { getAllOrdersController } from "../controllers/orderController.js";

const router = express.Router();

router.get("/admin/all", getAllOrdersController);

export default router;
