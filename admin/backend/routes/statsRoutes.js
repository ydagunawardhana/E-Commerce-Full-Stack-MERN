import express from "express";
import { getDashboardStats } from "../controllers/dashboardcontroller";

const router = express.Router();

//  Get Dashboard Stats
router.get("/stats", getDashboardStats);

module.exports = router;
