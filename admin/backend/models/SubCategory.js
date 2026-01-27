import mongoose from 'mongoose';

const subCategorySchema = mongoose.Schema(
  {
    // Parent Category 
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', 
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;