import OrderModel from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { type } = req.query;

    // Counts
    const products = await Product.countDocuments();
    const users = await User.countDocuments();
    const orders = await OrderModel.countDocuments();

    // Total Revenue
    const salesResult = await OrderModel.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalSales: { $sum: "$amount" } } },
    ]);
    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    let chartData = [];

    if (type === "daily") {
      //Daily Logic
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const dailyData = await OrderModel.aggregate([
        {
          $match: {
            status: "Delivered",
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toISOString().split("T")[0];
        const displayDate = d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });

        const found = dailyData.find((item) => item._id === dateString);

        chartData.unshift({
          name: displayDate,
          Sales: found ? found.sales : 0,
          Orders: found ? found.count : 0,
        });
      }
    } else {
      // Monthly Logic
      const monthlyData = await OrderModel.aggregate([
        { $match: { status: "Delivered" } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            sales: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      chartData = Array.from({ length: 12 }, (_, i) => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const found = monthlyData.find((item) => item._id === i + 1);
        return {
          name: months[i],
          Sales: found ? found.sales : 0,
          Orders: found ? found.count : 0,
        };
      });
    }

    res.status(200).json({
      users,
      orders,
      products,
      totalSales,
      chartData,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};
