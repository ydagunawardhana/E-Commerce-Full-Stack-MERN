import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  FaShoppingBag,
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Status List
  const orderStatuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const fetchOrders = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL; 
      
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get(
        `${API_URL}/api/orders/admin/all`,
        config
      );

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    const API_URL = process.env.REACT_APP_API_URL;
    const socket = io(API_URL);

    socket.on("order_updated", () => {
      fetchOrders();
    });

    socket.on("newOrder", () => {
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleRow = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const API_URL = process.env.REACT_APP_API_URL;

  // Status Change Handler
  const handleStatusChange = async (id, newStatus, e) => {
    e.stopPropagation();

    if (window.confirm(`Change order status to "${newStatus}"?`)) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        await axios.put(
  `${API_URL}/api/orders/${id}/status`,
  { status: newStatus },
  config
);

        fetchOrders();
        alert("Status Updated!");
      } catch (error) {
        alert("Update Failed");
        console.error(error);
      }
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
            padding: "30px 40px",
            color: "white",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaShoppingBag /> Order Management
          </h2>

          <p
            style={{
              margin: "8px 0 0 0",
              opacity: 0.9,
              fontSize: "15px",
              fontWeight: "400",
              letterSpacing: "0.3px",
            }}
          >
            Manage, track and organize all customer orders here.
          </p>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th style={thStyle}></th>
                <th style={thStyle}>ORDER ID</th>
                <th style={thStyle}>CUSTOMER</th>
                <th style={thStyle}>DATE</th>
                <th style={thStyle}>TOTAL</th>
                <th style={{ ...thStyle, textAlign: "center" }}>PAYMENT</th>
                <th style={{ ...thStyle, textAlign: "center" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  {/* Main Row */}
                  <tr
                    onClick={() => toggleRow(order._id)}
                    style={{
                      borderBottom:
                        expandedOrderId === order._id
                          ? "none"
                          : "1px solid #f1f5f9",
                      cursor: "pointer",
                      background:
                        expandedOrderId === order._id ? "#f1f5f9" : "white",
                    }}
                  >
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      {expandedOrderId === order._id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: "monospace",
                        fontWeight: "700",
                        color: "#4361ee",
                        fontSize: "14px",
                      }}
                    >
                      #{order._id}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      {order.userId?.name || "Guest"}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontSize: "14px",
                        fontWeight: "700",
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      $ {order.amount?.toFixed(2)}
                    </td>

                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <span
                        style={{
                          ...badgeBase,
                          background:
                            order.paymentType === "COD" ? "#fff7ed" : "#dcfce7",
                          color:
                            order.paymentType === "COD" ? "#c2410c" : "#166534",
                          fontSize: "13px",
                        }}
                      >
                        {order.paymentType}
                      </span>
                    </td>

                    {/* Status Dropdown Column  */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value, e)
                        }
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          background: getStatusColor(order.status),
                          color: "#0f172a",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {/* Expanded Details Section */}
                  {expandedOrderId === order._id && (
                    <tr
                      style={{
                        background: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <td colSpan="7" style={{ padding: "0 40px 30px 40px" }}>
                        <div
                          style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            gap: "30px",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* Products List */}
                          <div style={{ flex: "2", minWidth: "300px" }}>
                            <h4 style={sectionHeader}>
                              <FaBoxOpen /> Order Items
                            </h4>
                            <table style={{ width: "100%", fontSize: "13px" }}>
                              <thead>
                                <tr
                                  style={{
                                    color: "#94a3b8",
                                    textAlign: "left",
                                    borderBottom: "1px solid #f1f5f9",
                                  }}
                                >
                                  <th style={{ padding: "8px" }}>PRODUCT</th>
                                  <th style={{ padding: "8px" }}>NAME</th>
                                  <th style={{ padding: "8px" }}>PRICE</th>
                                  <th style={{ padding: "8px" }}>QTY</th>
                                  <th style={{ padding: "8px" }}>SUBTOTAL</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.products.map((item, index) => (
                                  <tr
                                    key={index}
                                    style={{
                                      borderBottom: "1px solid #f8fafc",
                                    }}
                                  >
                                    <td style={{ padding: "8px" }}>
                                      <img
                                        src={item.productId?.images?.[0]}
                                        alt=""
                                        style={{
                                          width: "35px",
                                          height: "35px",
                                          borderRadius: "5px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {item.productId?.name ||
                                        item.productId?.title ||
                                        item.productId?.productName ||
                                        "Deleted"}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      ${item.price}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {item.quantity}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      ${item.price * item.quantity}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Address Details */}
                          <div
                            style={{
                              flex: "1",
                              minWidth: "280px",
                              background: "#f8fafc",
                              padding: "20px",
                              borderRadius: "8px",
                              border: "1px dashed #cbd5e1",
                            }}
                          >
                            <h4 style={sectionHeader}>
                              <FaMapMarkerAlt /> Shipping Details
                            </h4>
                            {order.addressId ? (
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#334155",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                }}
                              >
                                <div style={detailRow}>
                                  <FaUser style={iconStyle} />{" "}
                                  <span>
                                    <strong>{order.userId?.name}</strong>
                                  </span>
                                </div>
                                <div style={detailRow}>
                                  <FaEnvelope style={iconStyle} />{" "}
                                  <span>{order.userId?.email}</span>
                                </div>
                                <div style={detailRow}>
                                  <FaPhone style={iconStyle} />{" "}
                                  <span>{order.addressId.mobile}</span>
                                </div>
                                <hr
                                  style={{
                                    border: "0",
                                    borderTop: "1px solid #e2e8f0",
                                    width: "100%",
                                    margin: "5px 0",
                                  }}
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <FaMapMarkerAlt
                                    style={{ ...iconStyle, marginTop: "3px" }}
                                  />
                                  <div>
                                    <p style={{ margin: "0 0 4px 0" }}>
                                      {order.addressId.address_line}
                                    </p>
                                    <p style={{ margin: "0 0 4px 0" }}>
                                      {order.addressId.city},{" "}
                                      {order.addressId.state}
                                    </p>
                                    <p style={{ margin: "0 0 4px 0" }}>
                                      {order.addressId.country} -{" "}
                                      <strong>{order.addressId.pincode}</strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p style={{ color: "red" }}>No Address</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper for Dropdown Colors
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#fff7ed"; // Orange-ish
    case "Confirmed":
      return "#e0f2fe"; // Blue-ish
    case "Processing":
      return "#f3e8ff"; // Purple-ish
    case "Shipped":
      return "#fef9c3"; // Yellow-ish
    case "Delivered":
      return "#dcfce7"; // Green
    case "Cancelled":
      return "#fee2e2"; // Red
    default:
      return "#f1f5f9";
  }
};

// Styles
const thStyle = {
  padding: "18px 25px",
  fontSize: "11px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  textAlign: "left",
};
const tdStyle = {
  padding: "18px 25px",
  fontSize: "13px",
  color: "#475569",
  verticalAlign: "middle",
};
const badgeBase = {
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
};
const sectionHeader = {
  margin: "0 0 15px 0",
  color: "#475569",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  textTransform: "uppercase",
  borderBottom: "2px solid #e2e8f0",
  paddingBottom: "8px",
};
const detailRow = { display: "flex", alignItems: "center", gap: "10px" };
const iconStyle = { color: "#6366f1", fontSize: "14px" };

export default OrderListScreen;
