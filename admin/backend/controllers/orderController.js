import OrderModel from "../models/Order.js";
import AddressModel from "../models/address.js";

// Admin Panel Orders Function
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email mobile")
      .populate("addressId")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res.json({
      message: "All orders fetched successfully",
      error: false,
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
