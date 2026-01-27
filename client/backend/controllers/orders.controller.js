import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";

export const createOrderController = async (request, response) => {
  try {
    const {
      userId,
      products,
      addressId,
      amount,
      paymentType,
      paymentId,
      paymentStatus,
      status,
    } = request.body;

    const orderProducts = products.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
      image: item.productId.images[0],
    }));

    const newOrder = new OrderModel({
      userId,
      products: orderProducts,
      addressId,
      amount,
      paymentType,
      paymentId: paymentId || "",
      paymentStatus: paymentStatus || "pending",
      status: status || "Pending",
    });

    await newOrder.save();

    try {
      const io = request.app.get("socketio");
      if (io) {
        io.emit("newOrder", newOrder);
        console.log(" Socket Notification Sent!");
      }
    } catch (socketError) {
      console.log("Socket Error:", socketError.message);
    }

    await CartProductModel.deleteMany({ userId: userId });

    return response.status(200).json({
      message: "Order placed successfully",
      error: false,
      success: true,
      data: newOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Get Orders (New Function)
export const getOrderController = async (request, response) => {
  try {
    const userId = request.userId;

    const orders = await OrderModel.find({ userId: userId })
      .populate("addressId")
      .populate("products.productId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return response.json({
      message: "Orders fetched successfully",
      error: false,
      success: true,
      data: orders,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// Order Status Update
export const updateOrderStatus = async (request, response) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    const order = await OrderModel.findById(id);

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    // Status
    order.status = status;
    await order.save();

    // Socket io emit
    const io = request.app.get("socketio");
    if (io) {
      io.emit("order_updated", { _id: id, status: status }); // Real-time update
    }

    return response.status(200).json({
      message: "Order status updated successfully",
      error: false,
      success: true,
      data: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// User get My Orders)
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId: userId })
      .populate("userId", "name email mobile")
      .populate("addressId")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(404).json({
        message: "No orders found for this user",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "User orders fetched successfully",
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
