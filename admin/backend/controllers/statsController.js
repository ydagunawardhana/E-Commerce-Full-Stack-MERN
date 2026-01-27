import OrderModel from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Get Dashboard Stats
export const getStats = async (req, res) => {
  try {
    const { type } = req.query;

    // Total Counts
    const products = await Product.countDocuments();
    const users = await User.countDocuments();
    const orders = await OrderModel.countDocuments();

    // Total Revenue Logic
    const salesResult = await OrderModel.aggregate([
      {
        $match: { status: "Delivered" },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amount" },
        },
      },
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    let chartData = [];

    if (type === "daily") {
      // Daily Logic
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
            _id: { $dateToString: { format: "%d %b", date: "$createdAt" } },
            sales: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      chartData = dailyData.map((item) => ({
        name: item._id,
        Sales: item.sales,
        Orders: item.count,
      }));
    } else {
      const monthlyData = await OrderModel.aggregate([
        {
          $match: { status: "Delivered" },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            sales: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      //  Graph Data Formatting (Jan - Dec)
      const chartData = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = i + 1;
        const monthData = monthlyData.find((item) => item._id === monthIndex);

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

        return {
          name: months[i],
          Sales: monthData ? monthData.sales : 0,
          Orders: monthData ? monthData.count : 0,
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
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};
