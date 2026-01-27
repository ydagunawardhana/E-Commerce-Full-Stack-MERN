import { Router } from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/create-checkout-session", createCheckoutSession);

export default paymentRouter;
