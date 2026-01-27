import Category from "../models/Category.js";
import fs from "fs";
import path from "path";
import { io } from "../server.js";
import { emitNewCategory } from "../server.js";

// Safe Helper Function
const deleteFile = (filePath) => {
  try {
    if (!filePath) return;

    const __dirname = path.resolve();

    const relativePath = filePath.startsWith("/")
      ? filePath.slice(1)
      : filePath;
    const fullPath = path.join(__dirname, relativePath);

    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath); // Synchronous delete
        console.log(`Successfully deleted: ${fullPath}`);
      } catch (err) {
        console.error(`File delete failed (Locked?): ${err.message}`);
      }
    } else {
      console.log(`File not found (Ignored): ${fullPath}`);
    }
  } catch (err) {
    console.error(
      "Error in deleteFile function (Safe to ignore):",
      err.message
    );
  }
};

//   Create new category
export const createCategory = async (req, res) => {
  try {
    let { name, subCategories } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = `/uploads/${req.file.filename}`;

    if (subCategories) {
      if (typeof subCategories === "string") {
        try {
          subCategories = JSON.parse(subCategories);
        } catch (err) {
          console.log("JSON Parse Error:", err);
          subCategories = [];
        }
      }
    } else {
      subCategories = [];
    }

    const category = new Category({
      name,
      image,
      subCategories: subCategories,
    });
    const savedCategory = await category.save();

    if (typeof io !== "undefined" && io) {
      io.emit("categoryAdded", savedCategory);
    }
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//     Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Update Category
export const updateCategory = async (req, res) => {
  try {
    const { name, isImageRemoved, subCategories } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;

    if (isImageRemoved === "true" && category.image) {
      deleteFile(category.image);
      category.image = "";
    }

    if (req.file) {
      if (category.image) deleteFile(category.image);
      category.image = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//   Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      if (category.image) {
        deleteFile(category.image); // Safe Delete
      }

      await category.deleteOne();
      res.json({ message: "Category removed" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
