import mongoose from "mongoose";

const bannerSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    // Product Link
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
