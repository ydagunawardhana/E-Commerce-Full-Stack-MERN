import { Router } from "express";
import auth from "../middlewares/auth.js"; 
import {
  addAddressController,
  deleteAddressController,
  getAddressController,
} from "../controllers/address.controller.js";

const addressRouter = Router();

// Routes
addressRouter.post("/add", auth, addAddressController); // Add Address 
addressRouter.get("/get", auth, getAddressController); // Get Address 
addressRouter.delete('/delete/:id', auth, deleteAddressController); // Delete Address 

export default addressRouter;
