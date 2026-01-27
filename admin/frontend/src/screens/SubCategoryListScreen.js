import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaLevelUpAlt,
  FaLayerGroup,
  FaCheckSquare,
  FaSquare,
  FaStream,
} from "react-icons/fa";

const SubCategoryListScreen = () => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevels, setThirdLevels] = useState([]);

  // Selection States
  const [selectedSubIds, setSelectedSubIds] = useState([]);
  const [selectedThirdIds, setSelectedThirdIds] = useState([]);

  // Data Fetching
  const fetchData = async () => {
    try {
      const [subRes, thirdRes] = await Promise.all([
        axios.get("/api/subcategories"),
        axios.get("/api/thirdlevels"),
      ]);
      setSubCategories(subRes.data);
      setThirdLevels(thirdRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  Selection Handlers
  const handleSelectAll = () => {
    if (
      selectedSubIds.length + selectedThirdIds.length ===
      subCategories.length + thirdLevels.length
    ) {
      setSelectedSubIds([]);
      setSelectedThirdIds([]);
    } else {
      setSelectedSubIds(subCategories.map((s) => s._id));
      setSelectedThirdIds(thirdLevels.map((t) => t._id));
    }
  };

  const toggleSubSelect = (id) => {
    if (selectedSubIds.includes(id)) {
      setSelectedSubIds(selectedSubIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedSubIds([...selectedSubIds, id]);
    }
  };

  const toggleThirdSelect = (id) => {
    if (selectedThirdIds.includes(id)) {
      setSelectedThirdIds(selectedThirdIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedThirdIds([...selectedThirdIds, id]);
    }
  };

  // Bulk Delete Handler
  const bulkDeleteHandler = async () => {
    const totalSelected = selectedSubIds.length + selectedThirdIds.length;
    if (
      window.confirm(
        `Are you sure you want to delete ${totalSelected} items? This action cannot be undone.`
      )
    ) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const deletePromises = [
          ...selectedSubIds.map((id) =>
            axios.delete(`/api/subcategories/${id}`, config)
          ),
          ...selectedThirdIds.map((id) =>
            axios.delete(`/api/thirdlevels/${id}`, config)
          ),
        ];

        await Promise.all(deletePromises);
        alert("Selected items deleted successfully!");
        setSelectedSubIds([]);
        setSelectedThirdIds([]);
        fetchData();
      } catch (error) {
        alert("Error deleting items");
      }
    }
  };

  // Single Delete Handlers
  const deleteSubHandler = async (id) => {
    if (window.confirm("Delete this Sub Category?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        await axios.delete(`/api/subcategories/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        fetchData();
      } catch (error) {
        alert("Error Deleting");
      }
    }
  };

  const deleteThirdLevelHandler = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        await axios.delete(`/api/thirdlevels/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        fetchData();
      } catch (error) {
        alert("Error Deleting");
      }
    }
  };

  // Grouping Logic
  const groupedData = subCategories.reduce((acc, sub) => {
    const mainCatName = sub.category?.name || "Uncategorized";
    const mainCatId = sub.category?._id || "uncat";
    if (!acc[mainCatId]) {
      acc[mainCatId] = { name: mainCatName, subs: [] };
    }
    acc[mainCatId].subs.push(sub);
    return acc;
  }, {});

  const totalItems = subCategories.length + thirdLevels.length;
  const selectedCount = selectedSubIds.length + selectedThirdIds.length;
  const isAllSelected = totalItems > 0 && selectedCount === totalItems;

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
          maxWidth: "1200px",
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
              <FaStream /> Sub Category Structure
            </h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
              Organize sub-categories and nested third-level items.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {selectedCount > 0 && (
              <button
                onClick={bulkDeleteHandler}
                style={{
                  ...headerBtnStyle,
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                }}
              >
                <FaTrash /> Delete Selected ({selectedCount})
              </button>
            )}
            <button
              onClick={() => navigate("/add-subcategory")}
              style={{
                ...headerBtnStyle,
                background: "white",
                color: "#4361ee",
              }}
            >
              <FaPlus /> Add New Sub Category
            </button>
          </div>
        </div>

        {/* Master Checkbox Bar */}
        <div
          style={{
            padding: "20px 40px",
            borderBottom: "1px solid #f1f5f9",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            onClick={handleSelectAll}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600",
              color: "#334155",
              fontSize: "14px",
            }}
          >
            {isAllSelected ? (
              <FaCheckSquare size={20} color="#4361ee" />
            ) : (
              <FaSquare size={20} color="#cbd5e1" />
            )}
            <span>Select All Items ({totalItems})</span>
          </div>
        </div>

        {/* Grouped Lists */}
        <div
          style={{
            padding: "30px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          {Object.keys(groupedData).length > 0 ? (
            Object.values(groupedData).map((group, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {/* Main Category Header */}
                <div
                  style={{
                    background: "#f1f5f9",
                    padding: "15px 25px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      background: "#e0f2fe",
                      padding: "6px",
                      borderRadius: "6px",
                      color: "#0369a1",
                      display: "flex",
                    }}
                  >
                    <FaLayerGroup size={14} />
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#334155",
                      fontSize: "14px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {group.name}
                  </h3>
                </div>

                {/* Sub Categories List */}
                <div>
                  {group.subs.map((sub) => {
                    const relatedThirdLevels = thirdLevels.filter((t) => {
                      const parentId =
                        t.subCategoryId?._id ||
                        t.subCategoryId ||
                        t.subCategory;
                      return parentId === sub._id;
                    });

                    return (
                      <div
                        key={sub._id}
                        style={{
                          padding: "20px 25px",
                          borderBottom: "1px solid #f1f5f9",
                          display: "grid",
                          gridTemplateColumns: "2fr 3fr 1fr",
                          alignItems: "start",
                          gap: "20px",
                          background: selectedSubIds.includes(sub._id)
                            ? "#eff6ff"
                            : "white",
                        }}
                      >
                        {/* Col 1: Sub Category Name */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            onClick={() => toggleSubSelect(sub._id)}
                            style={{ cursor: "pointer" }}
                          >
                            {selectedSubIds.includes(sub._id) ? (
                              <FaCheckSquare color="#4361ee" size={18} />
                            ) : (
                              <FaSquare color="#cbd5e1" size={18} />
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#1e293b",
                            }}
                          >
                            {sub.name}
                          </span>
                        </div>

                        {/* Col 2: Nested Items (Vertical List Fix) */}
                        <div>
                          {relatedThirdLevels.length > 0 ? (
                            <div style={nestedListStyle}>
                              {relatedThirdLevels.map((third) => (
                                <div
                                  key={third._id}
                                  style={{
                                    ...nestedRowStyle,
                                    background: selectedThirdIds.includes(
                                      third._id
                                    )
                                      ? "#e0f2fe"
                                      : "white",
                                    border: selectedThirdIds.includes(third._id)
                                      ? "1px solid #bfdbfe"
                                      : "1px solid #e2e8f0",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <div
                                      onClick={() =>
                                        toggleThirdSelect(third._id)
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      {selectedThirdIds.includes(third._id) ? (
                                        <FaCheckSquare
                                          size={14}
                                          color="#4361ee"
                                        />
                                      ) : (
                                        <FaSquare size={14} color="#cbd5e1" />
                                      )}
                                    </div>
                                    <FaLevelUpAlt
                                      style={{
                                        transform: "rotate(90deg)",
                                        color: "#94a3b8",
                                      }}
                                      size={10}
                                    />
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        color: "#475569",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {third.name}
                                    </span>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "6px",
                                      opacity: 0.6,
                                    }}
                                  >
                                    <Link
                                      to={`/thirdlevel/${third._id}/edit`}
                                      style={{
                                        cursor: "pointer",
                                        color: "#6366f1",
                                      }}
                                    >
                                      <FaEdit size={12} />
                                    </Link>
                                    <FaTrash
                                      size={12}
                                      color="#ef4444"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        deleteThirdLevelHandler(third._id)
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#94a3b8",
                                fontStyle: "italic",
                              }}
                            >
                              No nested items
                            </span>
                          )}
                        </div>

                        {/* Col 3: Actions */}
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() =>
                              navigate(`/subcategory/${sub._id}/edit`)
                            }
                            style={iconBtnStyle}
                          >
                            <FaEdit size={15} color="#64748b" />
                          </button>
                          <button
                            onClick={() => deleteSubHandler(sub._id)}
                            style={iconBtnStyle}
                          >
                            <FaTrash size={15} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}
            >
              No categories found. Add one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -Styles
const headerBtnStyle = {
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const nestedListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
};

const nestedRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  borderRadius: "6px",
  width: "100%",
  boxSizing: "border-box",
  transition: "0.2s",
};

const iconBtnStyle = {
  background: "#f1f5f9",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s",
};

export default SubCategoryListScreen;
