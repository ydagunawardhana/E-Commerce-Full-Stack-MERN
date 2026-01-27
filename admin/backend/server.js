import path from "path";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import http from "http";

// Route Imports
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import thirdLevelRoutes from "./routes/thirdLevelRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import logoRoutes from "./routes/logoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Config
dotenv.config();
const app = express();

//  HTTP Server
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

export const emitNewProduct = (product) => {
  io.emit("productAdded", product);
};

export const emitNewCategory = (data) => {
  io.emit("categoryAdded", data);
};

export const emitNewBanner = (data) => {
  io.emit("bannerAdded", data);
};

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.set("socketio", io);

//  Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("DB Error:", err);
    process.exit(1);
  });

//  Uploads Folder Logic
const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Uploads folder created!");
}

app.use("/uploads", express.static(uploadsDir));

// Socket.IO Connection Event
io.on("connection", (socket) => {
  console.log("New Client Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

app.set("socketio", io);

//  Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/thirdlevels", thirdLevelRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/logo", logoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", dashboardRoutes);
app.use("/api/orders", orderRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
