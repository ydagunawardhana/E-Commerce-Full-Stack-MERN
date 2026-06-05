import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserFriends,
  FaShoppingCart,
  FaBoxOpen,
  FaDollarSign,
  FaChartLine,
  FaPlus,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardScreen = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [filterType, setFilterType] = useState("monthly");

  // Stats State
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    totalSales: 0,
    chartData: [],
  });

  // Products List State
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Check Login Status
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (!userInfo) {
      navigate("/login");
      return;
    }

    if (userInfo.name) {
      setFirstName(userInfo.name.split(" ")[0]);
    }

    // Data Fetching Functions
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const API_URL = import.meta.env.VITE_API_URL; 

const { data } = await axios.get(
  `${API_URL}/api/stats?type=${filterType}`,
  config
);
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchProducts = async () => {
      try {

        const { data } = await axios.get(`${API_URL}/api/products`);

        console.log("Products Data:", data);
        setProducts(data.reverse());
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Initial Fetch
    fetchStats();
    fetchProducts();

    //  WebSocket Connection
    const socket = io("http://localhost:5000");

    socket.on("order_updated", () => fetchStats());
    socket.on("banner_added", () => fetchStats());
    socket.on("product_added", () => fetchProducts());

    // Cleanup on unmount
    return () => socket.disconnect();
  }, [navigate, filterType]);

  return (
    <div
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Welcome Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
            padding: "30px 40px",
            borderRadius: "16px",
            color: "white",
            marginBottom: "30px",
            boxShadow: "0 10px 20px rgba(67, 97, 238, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "26px", fontWeight: "700" }}>
              Welcome back, {firstName} 👋
            </h2>
            <p style={{ margin: "8px 0 0 0", opacity: 0.9, fontSize: "15px" }}>
              Here's what's happening with your store today.
            </p>
          </div>
          <button
            style={headerBtnStyle}
            onClick={() => navigate("/add-product", { state: { from: "/" } })}
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Summary Cards */}
        <div style={gridStyle}>
          {/* Total Revenue */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <div>
                <p style={cardLabelStyle}>Total Revenue</p>
                {/* Live Total Sales */}
                <h3 style={cardValueStyle}>
                  ${" "}
                  {stats.totalSales?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <div
                style={{
                  ...iconBoxStyle,
                  background: "#dcfce7",
                  color: "#16a34a",
                }}
              >
                <FaDollarSign size={20} />
              </div>
            </div>
            <div style={cardFooterStyle}>
              <span style={{ color: "#16a34a", fontWeight: "600" }}>+12%</span>{" "}
              <span style={{ color: "#94a3b8" }}>from last month</span>
            </div>
          </div>

          {/* Total Orders */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <div>
                <p style={cardLabelStyle}>Total Orders</p>
                <h3 style={cardValueStyle}>{stats.orders}</h3>
              </div>
              <div
                style={{
                  ...iconBoxStyle,
                  background: "#e0f2fe",
                  color: "#0284c7",
                }}
              >
                <FaShoppingCart size={20} />
              </div>
            </div>
            <div style={cardFooterStyle}>
              <span style={{ color: "#0284c7", fontWeight: "600" }}>+5%</span>{" "}
              <span style={{ color: "#94a3b8" }}>new orders</span>
            </div>
          </div>

          {/* Total Products */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <div>
                <p style={cardLabelStyle}>Total Products</p>
                <h3 style={cardValueStyle}>{stats.products}</h3>
              </div>
              <div
                style={{
                  ...iconBoxStyle,
                  background: "#f3e8ff",
                  color: "#9333ea",
                }}
              >
                <FaBoxOpen size={20} />
              </div>
            </div>
            <div style={cardFooterStyle}>
              <span style={{ color: "#9333ea", fontWeight: "600" }}>
                {stats.products}
              </span>{" "}
              <span style={{ color: "#94a3b8" }}>active items</span>
            </div>
          </div>

          {/* Total Users */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <div>
                <p style={cardLabelStyle}>Total Users</p>
                <h3 style={cardValueStyle}>{stats.users}</h3>
              </div>
              <div
                style={{
                  ...iconBoxStyle,
                  background: "#fee2e2",
                  color: "#dc2626",
                }}
              >
                <FaUserFriends size={20} />
              </div>
            </div>
            <div style={cardFooterStyle}>
              <span style={{ color: "#dc2626", fontWeight: "600" }}>+2</span>{" "}
              <span style={{ color: "#94a3b8" }}>new customers</span>
            </div>
          </div>
        </div>

        {/*  Analytics Charts (Live Data Connected) */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginTop: "30px",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "100%", height: 350 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "25px",
              }}
            >
              {/* Icon & Title */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    background: "#eff6ff",
                    padding: "8px",
                    borderRadius: "8px",
                    color: "#4361ee",
                  }}
                >
                  <FaChartLine />
                </div>
                <h3
                  style={{
                    margin: 0,
                    color: "#1e293b",
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                >
                  Sales Analytics
                </h3>
              </div>

              {/* Filter Buttons (Daily / Monthly) */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setFilterType("daily")}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "all 0.3s",
                    background: filterType === "daily" ? "#4361ee" : "#f1f5f9",
                    color: filterType === "daily" ? "#fff" : "#64748b",
                    boxShadow:
                      filterType === "daily"
                        ? "0 4px 10px rgba(67, 97, 238, 0.3)"
                        : "none",
                  }}
                >
                  Daily
                </button>
                <button
                  onClick={() => setFilterType("monthly")}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "all 0.3s",
                    background:
                      filterType === "monthly" ? "#4361ee" : "#f1f5f9",
                    color: filterType === "monthly" ? "#fff" : "#64748b",
                    boxShadow:
                      filterType === "monthly"
                        ? "0 4px 10px rgba(67, 97, 238, 0.3)"
                        : "none",
                  }}
                >
                  Monthly
                </button>
              </div>
            </div>
            <ResponsiveContainer>
              <AreaChart
                data={stats.chartData || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 35 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4361ee" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{
                    stroke: "#4361ee",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="Sales"
                  stroke="#4361ee"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Products Table */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginTop: "30px",
            border: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Latest Products
            </h3>
            <Link
              to="/products"
              style={{
                color: "#4361ee",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                background: "#eff6ff",
                padding: "8px 16px",
                borderRadius: "8px",
              }}
            >
              View All
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                  <th style={thStyle}>PRODUCT</th>
                  <th style={thStyle}>CATEGORY</th>
                  <th style={thStyle}>PRICE</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>STOCK</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr
                    key={product._id}
                    style={{
                      borderBottom: "1px solid #f8fafc",
                      transition: "background 0.2s",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div style={imgBoxStyle}>
                        <img
                          src={
                            product.images && product.images[0]
                              ? product.images[0].startsWith("/")
                                ? `http://localhost:5000${product.images[0]}`
                                : product.images[0]
                              : "/placeholder.jpg"
                          }
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#334155",
                            fontSize: "14px",
                          }}
                        >
                          {product.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          {product.brand}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={badgeStyle}>
                        {product.category?.name || "General"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      $ {product.price}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#64748b",
                      }}
                    >
                      {product.countInStock}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      {product.countInStock > 0 ? (
                        <span
                          style={{
                            background: "#dcfce7",
                            color: "#166534",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          In Stock
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          Out of Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "30px",
                        textAlign: "center",
                        color: "#94a3b8",
                      }}
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

//  Styles
const headerBtnStyle = {
  backgroundColor: "rgba(255,255,255,0.2)",
  color: "white",
  padding: "10px 20px",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backdropFilter: "blur(5px)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "25px",
};

const cardStyle = {
  padding: "25px",
  borderRadius: "16px",
  background: "white",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  border: "1px solid #f1f5f9",
  transition: "transform 0.2s",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "130px",
};

const cardLabelStyle = {
  margin: "0 0 5px 0",
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "600",
  textTransform: "uppercase",
};
const cardValueStyle = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "700",
  color: "#1e293b",
};
const cardFooterStyle = {
  fontSize: "12px",
  marginTop: "15px",
  paddingTop: "15px",
  borderTop: "1px solid #f1f5f9",
};

const iconBoxStyle = {
  width: "45px",
  height: "45px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const thStyle = {
  padding: "16px",
  fontSize: "11px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const imgBoxStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const badgeStyle = {
  background: "#f1f5f9",
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: "600",
  color: "#475569",
  border: "1px solid #e2e8f0",
};

export default DashboardScreen;
