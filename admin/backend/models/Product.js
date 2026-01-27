import mongoose from "mongoose";

// Review Schema (Controller  Reviews )
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },

    // Images
    image: { type: String },
    images: [{ type: String }],
    bannerImage: { type: String },
    isBannerActive: { type: Boolean, default: false },

    // Categories
    category: { type: String, required: true },
    subCategory: { type: String },
    thirdLevelCategory: { type: String },

    // Price & Stock
    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },

    // Features
    isFeatured: { type: Boolean, default: false },

    // Options (Arrays)
    rams: [{ type: String }],
    weight: [{ type: String }],
    size: [{ type: String }],

    // Ratings
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    // Reviews Array
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
