import Banner from "../models/Banner.js";
import fs from "fs";
import path from "path";
import { emitNewBanner } from "../server.js";

//  Create a new banner

export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const banner = new Banner({
      image: `/uploads/${req.file.filename}`,
    });

    const createdBanner = await banner.save();

    if (typeof emitNewBanner === "function") {
      emitNewBanner(createdBanner);
    }
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Get Single Banner (Edit Screen)
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      res.json(banner);
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Banner (Image Replace)
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      if (req.file) {
        const __dirname = path.resolve();
        const relativePath = banner.image.startsWith("/")
          ? banner.image.slice(1)
          : banner.image;
        const filePath = path.join(__dirname, relativePath);

        //  (Safe Delete)
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error("Error deleting old file:", err);
          }
        }

        banner.image = `/uploads/${req.file.filename}`;
      }

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete a banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      const __dirname = path.resolve();
      const relativePath = banner.image.startsWith("/")
        ? banner.image.slice(1)
        : banner.image;
      const filePath = path.join(__dirname, relativePath);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log("Banner image deleted");
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }

      await banner.deleteOne();
      res.json({ message: "Banner removed" });
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
