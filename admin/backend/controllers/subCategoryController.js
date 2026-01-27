import asyncHandler from "express-async-handler";
import SubCategory from "../models/SubCategory.js";

// Create Sub Category
export const createSubCategory = asyncHandler(async (req, res) => {
  const { categoryId, name, category } = req.body;

  const mainCategoryId = categoryId || category;

  if (!mainCategoryId) {
    res.status(400);
    throw new Error("Category ID is required");
  }

  const subCategoryExists = await SubCategory.findOne({ name });
  if (subCategoryExists) {
    res.status(400);
    throw new Error("Sub Category already exists");
  }

  const subCategory = await SubCategory.create({
    name,
    category: mainCategoryId,
  });

  res.status(201).json(subCategory);
});

//  Get All Sub Categories
export const getSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.find({}).populate("category", "name");
  res.json(subCategories);
});

// Get Single Sub Category
export const getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id).populate(
    "category",
    "name"
  );

  if (subCategory) {
    res.json(subCategory);
  } else {
    res.status(404);
    throw new Error("Sub Category not found");
  }
});

//  Update Sub Category
export const updateSubCategory = asyncHandler(async (req, res) => {
  const { categoryId, name } = req.body;
  const subCategory = await SubCategory.findById(req.params.id);

  if (subCategory) {
    subCategory.name = name || subCategory.name;
    subCategory.category = categoryId || subCategory.category;

    const updatedSubCategory = await subCategory.save();
    res.json(updatedSubCategory);
  } else {
    res.status(404);
    throw new Error("Sub Category not found");
  }
});

// Delete Sub Category
export const deleteSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);

  if (subCategory) {
    await subCategory.deleteOne();
    res.json({ message: "Sub Category removed" });
  } else {
    res.status(404);
    throw new Error("Sub Category not found");
  }
});
