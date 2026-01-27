import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardcontroller.js";

const router = express.Router();

router.get("/", protect, admin, getDashboardStats);

export default router;
