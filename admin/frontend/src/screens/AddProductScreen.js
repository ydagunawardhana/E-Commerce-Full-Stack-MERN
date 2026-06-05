import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaTimesCircle,
  FaBoxOpen,
  FaTags,
  FaImages,
  FaStar,
  FaInfoCircle,
} from "react-icons/fa";

const AddProductScreen = () => {
  const navigate = useNavigate();

  // Data States
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevels, setThirdLevels] = useState([]);

  // Selection States
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [thirdLevel, setThirdLevel] = useState("");

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [isFeatured, setIsFeatured] = useState("false");
  const [productSize, setProductSize] = useState("");

  // Rating State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(null);

  // Images
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  //  Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL; 

        const [catRes, subRes, thirdRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/subcategories`),
          axios.get(`${API_URL}/api/thirdlevels`),
        ]);

        setCategories(catRes.data);
        setSubCategories(subRes.data);
        setThirdLevels(thirdRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const extractId = (obj) => {
    if (!obj) return null;
    if (typeof obj === "string") return obj;
    if (obj._id) return obj._id;
    return null;
  };

  const filteredSubCats = subCategories.filter((sub) => {
    const parentId = extractId(sub.category) || extractId(sub.categoryId);
    return String(parentId) === String(category);
  });

  const filteredThirdLevels = thirdLevels.filter((third) => {
    const parentId =
      extractId(third.subCategory) || extractId(third.subCategoryId);
    return String(parentId) === String(subCategory);
  });

  // Handlers
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory("");
    setThirdLevel("");
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    setThirdLevel("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Sub Category
    if (!category) {
      alert("Please select a Category");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("oldPrice", oldPrice || 0);
    formData.append("countInStock", countInStock || 0);
    formData.append("discount", discount || 0);
    formData.append("isFeatured", isFeatured);
    formData.append("size", productSize);
    formData.append("rating", rating);

    const catName = categories.find((c) => c._id === category)?.name || "";
    const subName =
      subCategories.find((s) => s._id === subCategory)?.name || "";
    const thirdName = thirdLevels.find((t) => t._id === thirdLevel)?.name || "";

    formData.append("category", catName);
    formData.append("subCategory", subName);
    formData.append("thirdLevelCategory", thirdName);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      setUploading(true);
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;

      if (!userInfo) {
        alert("Please Login first!");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Backend URL
      await axios.post("http://localhost:5000/api/products", formData, config);
      alert("Product Added Successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Error adding product");
    } finally {
      setUploading(false);
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
              fontSize: "28px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaBoxOpen /> Add New Product
          </h2>
          <p style={{ margin: "8px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
            Fill in the details to publish a new product to your store.
          </p>
        </div>

        <form onSubmit={submitHandler} style={{ padding: "40px" }}>
          {/* Section 1: Classification */}
          <div style={sectionStyle}>
            <h4 style={sectionTitleStyle}>
              <FaTags style={{ marginRight: "8px" }} /> Category Classification
            </h4>
            <div style={gridContainerStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  Category <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  style={inputStyle}
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                {/* Sub Category */}
                <label style={labelStyle}>Sub Category</label>
                <select
                  style={inputStyle}
                  value={subCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!category}
                >
                  <option value="">Select Sub Category (Optional)</option>
                  {filteredSubCats.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Third Level (Optional)</label>
                <select
                  style={inputStyle}
                  value={thirdLevel}
                  onChange={(e) => setThirdLevel(e.target.value)}
                  disabled={!subCategory}
                >
                  <option value="">Select Third Level</option>
                  {filteredThirdLevels.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #f1f5f9",
              margin: "30px 0",
            }}
          />

          {/* Section 2: Basic Info & Rating */}
          <div style={sectionStyle}>
            <h4 style={sectionTitleStyle}>
              <FaInfoCircle style={{ marginRight: "8px" }} /> Product
              Information
            </h4>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Product Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name..."
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ ...inputGroupStyle, marginTop: "20px" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                placeholder="Write a detailed description..."
                style={{
                  ...inputStyle,
                  minHeight: "120px",
                  resize: "vertical",
                  lineHeight: "1.5",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Brand, Featured & Rating Row */}
            <div
              style={{
                ...gridContainerStyle,
                marginTop: "20px",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}
            >
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Brand</label>
                <input
                  type="text"
                  placeholder="Brand Name"
                  style={inputStyle}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Is Featured?</label>
                <select
                  style={inputStyle}
                  value={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.value)}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {/* Rating Input */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Initial Rating</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "48px",
                    gap: "5px",
                  }}
                >
                  {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                          style={{ display: "none" }}
                        />
                        <FaStar
                          size={24}
                          color={
                            ratingValue <= (hoverRating || rating)
                              ? "#ffc107"
                              : "#e4e5e9"
                          }
                          onMouseEnter={() => setHoverRating(ratingValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          style={{
                            cursor: "pointer",
                            transition: "color 0.2s",
                          }}
                        />
                      </label>
                    );
                  })}
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginLeft: "10px",
                    }}
                  >
                    ({rating}/5)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #f1f5f9",
              margin: "30px 0",
            }}
          />

          {/* Section 3: Pricing & Stock */}
          <div style={sectionStyle}>
            <h4 style={sectionTitleStyle}>Pricing & Inventory</h4>
            <div
              style={{
                ...gridContainerStyle,
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              }}
            >
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Regular Price ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  style={inputStyle}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Old Price ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  style={inputStyle}
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Stock Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  style={inputStyle}
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Discount (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  style={inputStyle}
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Product Sizes</label>
                <input
                  type="text"
                  placeholder="Ex: S, M, L, XL, XXL"
                  style={inputStyle}
                  value={productSize}
                  onChange={(e) => setProductSize(e.target.value)}
                />
                <span
                  style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}
                >
                  (Please separate sizes with a comma)
                </span>
              </div>
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #f1f5f9",
              margin: "30px 0",
            }}
          />

          {/* Section 4: Images */}
          <div style={sectionStyle}>
            <h4 style={sectionTitleStyle}>
              <FaImages style={{ marginRight: "8px" }} /> Product Media
            </h4>
            <div style={uploadBoxStyle}>
              <div style={dashedBoxStyle}>
                <FaCloudUploadAlt
                  size={48}
                  color="#4361ee"
                  style={{ marginBottom: "15px" }}
                />
                <h5
                  style={{
                    margin: "0 0 5px 0",
                    color: "#334155",
                    fontWeight: "600",
                  }}
                >
                  Click to Upload Images
                </h5>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  style={hiddenInputStyle}
                />
              </div>

              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  {imagePreviews.map((src, index) => (
                    <div key={index} style={previewWrapperStyle}>
                      <img src={src} alt="Preview" style={previewImageStyle} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={removeBtnStyle}
                      >
                        <FaTimesCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={uploading} style={submitButtonStyle}>
            {uploading ? "Publishing Product..." : "PUBLISH PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
};

//  Styles
const sectionStyle = { marginBottom: "20px" };
const sectionTitleStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "25px",
};
const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};
const labelStyle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.3px",
};
const inputStyle = {
  padding: "14px 16px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
  fontSize: "14px",
  color: "#334155",
  outline: "none",
  transition: "all 0.2s",
  width: "100%",
  boxSizing: "border-box",
};
const uploadBoxStyle = {
  background: "#f8fafc",
  padding: "25px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};
const dashedBoxStyle = {
  border: "2px dashed #cbd5e1",
  borderRadius: "10px",
  padding: "40px",
  textAlign: "center",
  position: "relative",
  cursor: "pointer",
  background: "white",
  transition: "all 0.3s",
};
const hiddenInputStyle = {
  opacity: 0,
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  cursor: "pointer",
};
const previewWrapperStyle = {
  position: "relative",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};
const previewImageStyle = {
  width: "100px",
  height: "100px",
  objectFit: "cover",
  display: "block",
};
const removeBtnStyle = {
  position: "absolute",
  top: "5px",
  right: "5px",
  background: "white",
  color: "#ef4444",
  border: "none",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};
const submitButtonStyle = {
  marginTop: "40px",
  width: "100%",
  padding: "16px",
  backgroundColor: "#4361ee",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(67, 97, 238, 0.25)",
  transition: "transform 0.2s, box-shadow 0.2s",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

export default AddProductScreen;
