import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { emitNewProduct } from "../server.js";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    if (!imageUrl.includes("cloudinary.com")) return;

    const regex = /\/v\d+\/(.+)\.[a-z]+$/;
    const match = imageUrl.match(regex);

    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
      console.log(` Deleted from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error(" Cloudinary Delete Error:", error.message);
  }
};

// Fetch all products
export const getProducts = asyncHandler(async (req, res) => {
  let query = {};

  if (req.query.category) {
    const catList = req.query.category.split(",");
    query.category = { $in: catList };
  }
  // (Other filters remain same)
  if (req.query.subCategory) {
    const subCatList = req.query.subCategory.split(",");
    query.subCategory = { $in: subCatList };
  }
  if (req.query.thirdLevelCategory) {
    const thirdCatList = req.query.thirdLevelCategory.split(",");
    query.thirdLevelCategory = { $in: thirdCatList };
  }
  if (req.query.minPrice && req.query.maxPrice) {
    query.price = {
      $gte: parseInt(req.query.minPrice),
      $lte: parseInt(req.query.maxPrice),
    };
  }

  const products = await Product.find({})
    .populate("category")
    .sort({ createdAt: -1 });

  res.json(products);
});

// Fetch single product
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Create a product
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    brand,
    category,
    subCategory,
    thirdLevelCategory,
    countInStock,
    oldPrice,
    isFeatured,
    discount,
    rams,
    weight,
    size,
    rating,
    isBannerActive,
  } = req.body;

  //  Handle Multiple Images
  let imagesPaths = [];
  if (req.files && req.files["images"]) {
    for (const file of req.files["images"]) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        imagesPaths.push(result.secure_url);
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error("Image Upload Error:", error);
      }
    }
  }

  //  Handle Banner Image
  let bannerPath = "";
  if (req.files && req.files["bannerImage"]) {
    try {
      const file = req.files["bannerImage"][0];
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "banners",
      });
      bannerPath = result.secure_url;
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error("Banner Upload Error:", error);
    }
  }

  const product = new Product({
    user: req.user._id,
    name,
    description,
    price,
    brand,
    category,
    subCategory,
    thirdLevelCategory,
    countInStock,
    oldPrice,
    isFeatured: isFeatured === "true",
    discount,
    rating,
    isBannerActive: isBannerActive === "true",
    rams: rams ? (Array.isArray(rams) ? rams : rams.split(",")) : [],
    weight: weight ? (Array.isArray(weight) ? weight : weight.split(",")) : [],
    size: size ? (Array.isArray(size) ? size : size.split(",")) : [],
    images: imagesPaths,
    image: imagesPaths[0] || "",
    bannerImage: bannerPath,
  });

  const createdProduct = await product.save();
  try {
    if (typeof emitNewProduct === "function") emitNewProduct(createdProduct);
  } catch (socketError) {
    console.log("Socket Error:", socketError.message);
  }
  res.status(201).json(createdProduct);
});

// Update a product
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    brand,
    category,
    subCategory,
    thirdLevelCategory,
    countInStock,
    oldPrice,
    isFeatured,
    discount,
    rams,
    weight,
    size,
    rating,
    isBannerActive,
    existingImages,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    if (!product.user) product.user = req.user._id;

    product.name = name || product.name;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.thirdLevelCategory =
      thirdLevelCategory || product.thirdLevelCategory;
    product.price = price || product.price;
    product.oldPrice = oldPrice || 0;
    product.countInStock = countInStock || 0;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured === "true" : product.isFeatured;
    product.discount = discount || 0;
    product.rating = rating || 0;

    if (isBannerActive !== undefined)
      product.isBannerActive = isBannerActive === "true";
    if (rams) product.rams = Array.isArray(rams) ? rams : rams.split(",");
    if (weight)
      product.weight = Array.isArray(weight) ? weight : weight.split(",");
    if (size) product.size = Array.isArray(size) ? size : size.split(",");

    // IMAGE UPDATE LOGIC
    let keptImages = [];
    if (existingImages) {
      keptImages = Array.isArray(existingImages)
        ? existingImages
        : [existingImages];
    }

    // Delete removed images from Cloudinary
    if (product.images && product.images.length > 0) {
      const imagesToDelete = product.images.filter(
        (img) => !keptImages.includes(img)
      );

      for (const imgPath of imagesToDelete) {
        await deleteFromCloudinary(imgPath);
      }
    }

    // Add new images
    let newImagesPaths = [];
    if (req.files && req.files["images"]) {
      for (const file of req.files["images"]) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          });
          newImagesPaths.push(result.secure_url);
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error("New Image Upload Error:", error);
        }
      }
    }

    product.images = [...keptImages, ...newImagesPaths];

    // Main Image Update
    if (product.images.length > 0) {
      product.image = product.images[0];
    } else {
      product.image = "";
    }

    // Banner Update
    if (req.files && req.files["bannerImage"]) {
      try {
        if (product.bannerImage) {
          await deleteFromCloudinary(product.bannerImage);
        }

        const file = req.files["bannerImage"][0];
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "banners",
        });
        product.bannerImage = result.secure_url;
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error("Banner Update Error:", error);
      }
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Delete a product
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.images && product.images.length > 0) {
      for (const imgPath of product.images) {
        await deleteFromCloudinary(imgPath);
      }
    }

    if (product.bannerImage) {
      await deleteFromCloudinary(product.bannerImage);
    }

    await product.deleteOne();
    res.json({ message: "Product and Images removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Delete review
export const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);

  if (product) {
    const review = product.reviews.find((r) => r._id.toString() === reviewId);

    if (review) {
      product.reviews = product.reviews.filter(
        (r) => r._id.toString() !== reviewId
      );

      product.numReviews = product.reviews.length;

      if (product.reviews.length > 0) {
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
      } else {
        product.rating = 0;
      }

      await product.save();
      res.json({ message: "Review removed successfully" });
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Create new review
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
