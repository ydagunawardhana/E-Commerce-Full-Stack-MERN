import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaStar,
  FaSearch,
  FaPlus,
  FaFilter,
  FaBoxOpen,
} from "react-icons/fa";

const ProductListScreen = () => {
  const navigate = useNavigate();

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevels, setThirdLevels] = useState([]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedThirdLevel, setSelectedThirdLevel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProducts, setSelectedProducts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch Data
  const fetchData = async () => {
    try {
      const [prodRes, catRes, subRes, thirdRes] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/categories"),
        axios.get("/api/subcategories"),
        axios.get("/api/thirdlevels"),
      ]);

      setProducts(prodRes.data.reverse());
      setCategories(catRes.data);
      setSubCategories(subRes.data);
      setThirdLevels(thirdRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering Logic
  const getCategoryNameById = (id) =>
    categories.find((c) => c._id === id)?.name || "";
  const getSubCategoryNameById = (id) =>
    subCategories.find((s) => s._id === id)?.name || "";
  const getThirdLevelNameById = (id) =>
    thirdLevels.find((t) => t._id === id)?.name || "";

  const dropdownSubCats = selectedCategory
    ? subCategories.filter((sub) => {
        const catId = sub.category?._id || sub.category || sub.categoryId;
        return catId === selectedCategory;
      })
    : [];

  const dropdownThirdLevels = selectedSubCategory
    ? thirdLevels.filter((t) => {
        const subId = t.subCategoryId?._id || t.subCategoryId || t.subCategory;
        return subId === selectedSubCategory;
      })
    : [];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const categoryName = getCategoryNameById(selectedCategory);
    const matchesCategory = selectedCategory
      ? product.category === categoryName ||
        product.category === selectedCategory
      : true;

    const subCategoryName = getSubCategoryNameById(selectedSubCategory);
    const matchesSubCategory = selectedSubCategory
      ? product.subCategory === subCategoryName ||
        product.subCategory === selectedSubCategory
      : true;

    const thirdLevelName = getThirdLevelNameById(selectedThirdLevel);
    const matchesThirdLevel = selectedThirdLevel
      ? product.thirdLevelCategory === thirdLevelName ||
        product.thirdLevelCategory === selectedThirdLevel
      : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubCategory &&
      matchesThirdLevel
    );
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredProducts.map((product) => product._id);
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter((pId) => pId !== id));
    }
  };

  const getAuthConfig = () => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    if (!userInfo) return null;
    return { headers: { Authorization: `Bearer ${userInfo.token}` } };
  };

  const deleteSelectedHandler = async () => {
    const config = getAuthConfig();
    if (!config) return alert("Please login first");

    if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
      try {
        await Promise.all(
          selectedProducts.map((id) =>
            axios.delete(`/api/products/${id}`, config)
          )
        );
        alert("Deleted Successfully!");
        setSelectedProducts([]);
        fetchData();
      } catch (error) {
        alert("Error deleting");
      }
    }
  };

  const deleteHandler = async (id) => {
    const config = getAuthConfig();
    if (!config) return alert("Please login first");

    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`/api/products/${id}`, config);
        fetchData();
      } catch (error) {
        alert("Error deleting");
      }
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FaStar key={i} size={13} color={i < rating ? "#f59e0b" : "#e5e7eb"} />
    ));

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
              <FaBoxOpen /> Product Inventory
            </h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
              Manage, track and organize all your products here.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {selectedProducts.length > 0 && (
              <button
                onClick={deleteSelectedHandler}
                style={{
                  ...headerBtnStyle,
                  background: "#ef4444",
                  border: "1px solid #ef4444",
                }}
              >
                <FaTrash /> Delete ({selectedProducts.length})
              </button>
            )}
            <button
              onClick={() => navigate("/add-product")}
              style={{
                ...headerBtnStyle,
                background: "white",
                color: "#4361ee",
              }}
            >
              <FaPlus /> Add New Product
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div style={filterSectionStyle}>
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              marginBottom: "10px",
            }}
          >
            <FaFilter /> FILTER & SEARCH
          </div>

          <div style={inputGroupStyle}>
            <select
              style={controlStyle}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory("");
                setSelectedThirdLevel("");
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={inputGroupStyle}>
            <select
              style={controlStyle}
              value={selectedSubCategory}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
                setSelectedThirdLevel("");
              }}
              disabled={!selectedCategory || dropdownSubCats.length === 0}
            >
              <option value="">All Sub Categories</option>
              {dropdownSubCats.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div style={inputGroupStyle}>
            <select
              style={controlStyle}
              value={selectedThirdLevel}
              onChange={(e) => setSelectedThirdLevel(e.target.value)}
              disabled={
                !selectedSubCategory || dropdownThirdLevels.length === 0
              }
            >
              <option value="">All Third Levels</option>
              {dropdownThirdLevels.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ ...inputGroupStyle, flex: 2 }}>
            <div style={{ position: "relative", width: "100%" }}>
              <FaSearch style={searchIconStyle} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchInputStyle}
              />
            </div>
          </div>
        </div>

        {/* Product Table */}
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
                <th style={{ ...thStyle, width: "40px" }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      products.length > 0 &&
                      selectedProducts.length === filteredProducts.length
                    }
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th style={thStyle}>PRODUCT NAME</th>
                <th style={thStyle}>CATEGORY</th>
                <th style={thStyle}>PRICE</th>
                <th style={thStyle}>STOCK</th>
                <th style={thStyle}>RATING</th>
                <th style={{ ...thStyle, textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: selectedProducts.includes(product._id)
                      ? "#eff6ff"
                      : "white",
                    transition: "background 0.2s",
                  }}
                >
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectOne(e, product._id)}
                      checked={selectedProducts.includes(product._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div style={productImgContainerStyle}>
  <img
    src={
      product.images?.[0]
        ? product.images[0].startsWith("http")
          ? product.images[0] 
          : `${API_URL}${product.images[0]}` 
        : "https://placehold.co/50x50?text=No+Image"
    }
    alt={product.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
    onError={(e) => {
      e.target.src = "https://placehold.co/50x50?text=Error";
    }}
  />
</div>
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#1e293b",
                            fontWeight: "600",
                          }}
                        >
                          {product.name}
                        </h4>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {product.brand}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <span style={badgeStyle}>{product.category}</span>
                      {product.subCategory && (
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          ↳ {product.subCategory}
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    style={{ ...tdStyle, fontWeight: "700", color: "#0f172a" }}
                  >
                    $ {product.price}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                        background:
                          product.countInStock > 0 ? "#dcfce7" : "#fee2e2",
                        color: product.countInStock > 0 ? "#166534" : "#991b1b",
                        display: "inline-block",
                        minWidth: "70px",
                        textAlign: "center",
                      }}
                    >
                      {product.countInStock > 0 ? "In Stock" : "Out Stock"}
                    </span>
                  </td>
                  <td style={tdStyle}>{renderStars(product.rating)}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={{
                          ...actionBtn,
                          color: "#3b82f6",
                          background: "#eff6ff",
                        }}
                        onClick={() => navigate(`/product/${product._id}`)}
                        title="View"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        style={{
                          ...actionBtn,
                          color: "#6366f1",
                          background: "#eef2ff",
                        }}
                        onClick={() => navigate(`/product/${product._id}/edit`)}
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        style={{
                          ...actionBtn,
                          color: "#ef4444",
                          background: "#fef2f2",
                        }}
                        onClick={() => deleteHandler(product._id)}
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "60px",
                      color: "#94a3b8",
                    }}
                  >
                    <FaSearch
                      size={40}
                      style={{ marginBottom: "15px", opacity: 0.2 }}
                    />
                    <br />
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>
                      No products found matching your filters
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

// --- STYLES ---
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
const filterSectionStyle = {
  padding: "25px 40px",
  background: "white",
  borderBottom: "1px solid #f1f5f9",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  alignItems: "end",
};
const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};
const controlStyle = {
  width: "100%",
  height: "42px",
  padding: "0 12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#f8fafc",
  fontSize: "13px",
  color: "#334155",
  outline: "none",
  transition: "all 0.2s",
  cursor: "pointer",
  boxSizing: "border-box",
};
const searchInputStyle = {
  ...controlStyle,
  paddingLeft: "38px",
  cursor: "text",
  backgroundColor: "white",
};
const searchIconStyle = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#94a3b8",
  fontSize: "14px",
  pointerEvents: "none",
};
const thStyle = {
  padding: "18px 25px",
  fontSize: "11px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  textAlign: "left",
};
const tdStyle = {
  padding: "18px 25px",
  fontSize: "13px",
  color: "#475569",
  verticalAlign: "middle",
};
const productImgContainerStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const badgeStyle = {
  background: "#e0f2fe",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "700",
  color: "#0369a1",
};
const actionBtn = {
  border: "none",
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s",
};

export default ProductListScreen;
