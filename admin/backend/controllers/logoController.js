import Logo from "../models/Logo.js"; // 🔥 .js අගට දාන්න
import fs from "fs";
import path from "path";

// Get the current logo
export const getLogo = async (req, res) => {
  try {
    // අන්තිමට දාපු Logo එක ගන්නවා
    const logo = await Logo.findOne().sort({ createdAt: -1 });
    res.json(logo || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Upload or Update Logo
export const updateLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const __dirname = path.resolve();

    const existingLogo = await Logo.findOne();

    if (existingLogo) {
      const oldPath = path.join(__dirname, existingLogo.image);

      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
          console.log("Old logo deleted");
        } catch (err) {
          console.error(err);
        }
      }

      await Logo.deleteMany({});
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const newLogo = new Logo({
      image: imagePath,
    });

    const savedLogo = await newLogo.save();
    res.status(201).json(savedLogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
