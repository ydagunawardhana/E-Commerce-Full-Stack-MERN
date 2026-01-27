import ProductModel from "../models/product.model.js";

// Get All Products (Filter & Pagination)
export const getProducts = async (req, res) => {
  try {
    let query = {};

    // Category Filter (Multiple Selection Support)

    if (req.query.category) {
      const catList = req.query.category.split(",");
      query.category = { $in: catList };
    }

    //  Sub Category Filter
    if (req.query.subCategory) {
      const subCatList = req.query.subCategory.split(",");
      query.subCategory = { $in: subCatList };
    }

    //  Third Level Category Filter
    if (req.query.thirdLevelCategory) {
      const thirdCatList = req.query.thirdLevelCategory.split(",");
      query.thirdLevelCategory = { $in: thirdCatList };
    }

    // Price Filter Logic
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      };
    }

    // Rating Filter
    if (req.query.rating) {
      const ratings = req.query.rating.split(",").map(Number);
      query.rating = { $in: ratings };
    }

    if (req.query.q) {
      const search = req.query.q;

      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting Logic
    let sortArgs = {};
    if (req.query.sort) {
      if (req.query.sort === "name_asc") sortArgs = { name: 1 };
      if (req.query.sort === "name_desc") sortArgs = { name: -1 };
      if (req.query.sort === "price_asc") sortArgs = { price: 1 };
      if (req.query.sort === "price_desc") sortArgs = { price: -1 };
    }

    // Database Query
    const products = await ProductModel.find(query).sort(sortArgs);

    //  Response Handling
    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate(
      "category"
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Create Review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await ProductModel.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed" });
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
      return res.status(201).json({ message: "Review added" });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
