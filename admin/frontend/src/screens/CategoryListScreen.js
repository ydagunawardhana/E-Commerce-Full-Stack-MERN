import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTags, FaLayerGroup } from "react-icons/fa";

const CategoryListScreen = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete Category
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        await axios.delete(`/api/categories/${id}`, config);
        fetchCategories(); // Refresh list
      } catch (error) {
        alert("Error deleting category");
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
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header Area */}
        <div
          style={{
            background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
            padding: "30px 40px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
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
              <FaLayerGroup /> Category Management
            </h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
              Organize your main product categories here.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-category")}
            style={headerBtnStyle}
          >
            <FaPlus /> Add New Category
          </button>
        </div>

        {/* Table Section */}
        <div style={{ padding: "0 0 20px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th style={thStyle}>IMAGE</th>
                <th style={thStyle}>CATEGORY NAME</th>
                <th style={{ ...thStyle, textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background 0.2s",
                    }}
                  >
                    {/* Image Column */}
                    <td style={tdStyle}>
                      <div style={imgContainerStyle}>
                        <img
                          src={
                            category.image
                              ? `http://localhost:5000${category.image}`
                              : "https://via.placeholder.com/50"
                          }
                          alt={category.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/50";
                          }}
                        />
                      </div>
                    </td>

                    {/* Name Column */}
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#334155",
                        }}
                      >
                        {category.name}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            navigate(`/category/${category._id}/edit`)
                          }
                          style={{
                            ...actionBtn,
                            color: "#6366f1",
                            background: "#eef2ff",
                          }}
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteHandler(category._id)}
                          style={{
                            ...actionBtn,
                            color: "#ef4444",
                            background: "#fef2f2",
                          }}
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                      color: "#94a3b8",
                    }}
                  >
                    <FaTags
                      size={40}
                      style={{ marginBottom: "15px", opacity: 0.2 }}
                    />
                    <br />
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>
                      No categories found. Add one to get started!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// STYLES
const headerBtnStyle = {
  background: "white",
  color: "#4361ee",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const thStyle = {
  padding: "20px 40px",
  fontSize: "12px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  textAlign: "left",
};

const tdStyle = {
  padding: "20px 40px",
  verticalAlign: "middle",
};

const imgContainerStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "10px",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
};

const actionBtn = {
  border: "none",
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.2s",
};

export default CategoryListScreen;
