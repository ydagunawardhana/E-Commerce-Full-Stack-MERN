import mongoose from "mongoose";

const thirdLevelCategorySchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ThirdLevelCategory = mongoose.model(
  "ThirdLevelCategory",
  thirdLevelCategorySchema
);

export default ThirdLevelCategory;
