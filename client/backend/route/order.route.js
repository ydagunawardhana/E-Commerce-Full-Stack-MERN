import { Router } from "express";
import {
  createOrderController,
  getMyOrders,
  getOrderController,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import auth from "../middlewares/auth.js";

const orderRouter = Router();

orderRouter.post("/create", auth, createOrderController);
orderRouter.get("/", auth, getOrderController);
orderRouter.put("/:id/status", updateOrderStatus);
orderRouter.get("/my-orders", auth, getMyOrders);

export default orderRouter;
