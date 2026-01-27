import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],
    addressId: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      default: "COD",
    },
    paymentId: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
