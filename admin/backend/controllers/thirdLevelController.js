import ThirdLevelCategory from "../models/ThirdLevelCategory.js";
import SubCategory from "../models/SubCategory.js";

//  Create
export const createThirdLevel = async (req, res) => {
  try {
    const { subCategoryId, name } = req.body;

    if (!subCategoryId || !name) {
      return res
        .status(400)
        .json({ message: "SubCategory ID and Name are required" });
    }

    const subCategoryExists = await SubCategory.findById(subCategoryId);
    if (!subCategoryExists) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    const newItem = new ThirdLevelCategory({ subCategoryId, name });
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All
export const getThirdLevels = async (req, res) => {
  try {
    const items = await ThirdLevelCategory.find().populate(
      "subCategoryId",
      "name"
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Single Item
export const getThirdLevelById = async (req, res) => {
  try {
    const item = await ThirdLevelCategory.findById(req.params.id).populate(
      "subCategoryId"
    );
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update
export const updateThirdLevel = async (req, res) => {
  try {
    const { subCategoryId, name } = req.body;

    if (subCategoryId) {
      const subCategoryExists = await SubCategory.findById(subCategoryId);
      if (!subCategoryExists) {
        return res.status(404).json({ message: "SubCategory not found" });
      }
    }

    const updatedItem = await ThirdLevelCategory.findByIdAndUpdate(
      req.params.id,
      { subCategoryId, name },
      { new: true, runValidators: true }
    );

    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete
export const deleteThirdLevel = async (req, res) => {
  try {
    const item = await ThirdLevelCategory.findByIdAndDelete(req.params.id);

    if (item) {
      res.json({ message: "Item removed successfully" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
