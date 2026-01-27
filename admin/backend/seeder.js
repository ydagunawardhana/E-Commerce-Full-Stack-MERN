const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();

const importData = async () => {
  try {
    // Database Connect
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce"
    );
    console.log("MongoDB Connected...");

    //  Users Remove
    await User.deleteMany();

    // New Admin User
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "123456",
      isAdmin: true,
    });

    console.log("Admin User Created Successfully!");
    console.log("Email: admin@gmail.com");
    console.log("Password: 123456");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
