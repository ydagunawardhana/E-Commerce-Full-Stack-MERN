import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

//  Upload Images Controller
var imagesArr = [];
export async function uploadImages(request, response) {
  try {
    imagesArr = [];
    const image = request.files;
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < image?.length; i++) {
      const img = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`);
        }
      );
    }

    return response.status(200).json({
      images: imagesArr,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Create Category
export async function createCategory(request, response) {
  try {
    let imgData = [];
    if (imagesArr && imagesArr.length > 0) {
      imgData = imagesArr;
    } else if (request.body.images && request.body.images.length > 0) {
      imgData = request.body.images;
    }

    let category = new CategoryModel({
      name: request.body.name,
      images: imgData,
      parentId: request.body.parentId || null,
      parentCatName: request.body.parentCatName || "",
    });

    if (!category) {
      return response.status(500).json({
        message: "Category cannot be created!",
        error: true,
        success: false,
      });
    }

    category = await category.save();
    imagesArr = []; // Reset

    return response.status(201).json({
      message: "Category Added Successfully",
      error: false,
      success: true,
      category: category,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get Categories (Tree Structure)
export async function getCategories(request, response) {
  try {
    const categories = await CategoryModel.find();

    if (!categories) {
      return response
        .status(404)
        .json({ success: false, message: "No categories found" });
    }

    const categoryMap = {};

    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat._doc, children: [] };
    });

    const rootCategories = [];

    categories.forEach((cat) => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    return response.status(200).json({
      error: false,
      success: true,
      data: rootCategories,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//  Get Category Count
export async function getCategoriesCount(request, response) {
  try {
    const categoryCount = await CategoryModel.countDocuments({
      parentId: undefined,
    });
    response.send({ categoryCount: categoryCount });
  } catch (error) {
    return response.status(500).json({ error: true, success: false });
  }
}

//  Get Sub Category Count
export async function getSubCategoriesCount(request, response) {
  try {
    const count = await CategoryModel.countDocuments({
      parentId: { $ne: null },
    });
    response.send({ SubcategoryCount: count });
  } catch (error) {
    return response.status(500).json({ error: true, success: false });
  }
}

//  Get Single Category
export async function getCategory(request, response) {
  try {
    const category = await CategoryModel.findById(request.params.id);
    if (!category) {
      return response.status(404).json({
        message: "Category not found.",
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      category: category,
    });
  } catch (error) {
    return response.status(500).json({ error: true, success: false });
  }
}

//  Remove Images
export async function removeImageFromCloudinary(request, response) {
  try {
    const imgUrl = request.body.imgUrl;
    if (!imgUrl)
      return response
        .status(400)
        .json({ status: false, message: "URL required" });

    const urlArr = imgUrl.split("/");
    const imageName = urlArr[urlArr.length - 1].split(".")[0];

    if (imageName) {
      const res = await cloudinary.uploader.destroy(imageName);
      return response.status(200).json({
        status: true,
        message: "Image deleted",
      });
    }
  } catch (error) {
    return response.status(500).json({ status: false, message: error.message });
  }
}

// Delete Category
export async function deleteCategory(request, response) {
  try {
    const category = await CategoryModel.findById(request.params.id);

    if (!category) {
      return response.status(404).json({
        message: "Category not found!",
        success: false,
        error: true,
      });
    }

    const images = category.images;
    if (images && images.length > 0) {
      for (let img of images) {
        const urlArr = img.split("/");
        const imageName = urlArr[urlArr.length - 1].split(".")[0];
        if (imageName) {
          cloudinary.uploader.destroy(imageName);
        }
      }
    }

    // Sub Categories
    const subCategories = await CategoryModel.find({
      parentId: request.params.id,
    });
    for (let subCat of subCategories) {
      if (subCat.images && subCat.images.length > 0) {
        for (let img of subCat.images) {
          const urlArr = img.split("/");
          const imageName = urlArr[urlArr.length - 1].split(".")[0];
          cloudinary.uploader.destroy(imageName);
        }
      }
      await CategoryModel.findByIdAndDelete(subCat._id);
    }

    await CategoryModel.findByIdAndDelete(request.params.id);

    return response.status(200).json({
      success: true,
      error: false,
      message: "Category Deleted!",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//  Update Category
export async function updatedCategory(request, response) {
  try {
    let imgData = [];
    if (imagesArr && imagesArr.length > 0) {
      imgData = imagesArr;
    } else if (request.body.images && request.body.images.length > 0) {
      imgData = request.body.images;
    }

    const category = await CategoryModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        images: imgData,
        parentId: request.body.parentId,
        parentCatName: request.body.parentCatName,
      },
      { new: true }
    );

    if (!category) {
      return response.status(404).json({
        message: "Category not found!",
        success: false,
        error: true,
      });
    }

    imagesArr = []; // Reset

    return response.status(200).json({
      message: "Category Updated Successfully",
      success: true,
      error: false,
      category: category,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}
