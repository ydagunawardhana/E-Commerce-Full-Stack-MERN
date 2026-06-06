import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaTimesCircle,
  FaLayerGroup,
  FaImages,
} from "react-icons/fa";

const AddCategoryScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // Image Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  // Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();

    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (!userInfo) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (!name || !image) {
      alert("Please enter a name and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      setUploading(true);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
  `${API_URL}/api/categories`,
  formData,
  config
);

      alert("Category Added Successfully!");
      navigate("/categories");
    } catch (error) {
      console.error(error);
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      alert(`Error adding category: ${message}`);
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
          maxWidth: "600px",
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
            <FaLayerGroup /> Add New Category
          </h2>
          <p style={{ margin: "8px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
            Create a main category for your products.
          </p>
        </div>

        <form onSubmit={submitHandler} style={{ padding: "40px" }}>
          {/* Name Input */}
          <div style={{ marginBottom: "25px" }}>
            <label style={labelStyle}>
              Category Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="E.g., Electronics, Fashion..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: "30px" }}>
            <label style={labelStyle}>
              <FaImages style={{ marginRight: "6px" }} /> Category Image{" "}
              <span style={{ color: "red" }}>*</span>
            </label>

            <div style={uploadBoxStyle}>
              {preview ? (
                // Preview Mode
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "200px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={overlayStyle}>
                    <button
                      type="button"
                      onClick={removeImage}
                      style={removeBtnStyle}
                    >
                      <FaTimesCircle size={20} /> Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                // Upload Box
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
                    Click to Upload Image
                  </h5>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>
                    JPG, PNG or GIF (Recommended 500x500px)
                  </p>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    style={{
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    accept="image/*"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={uploading} style={submitButtonStyle}>
            {uploading ? "Creating Category..." : "PUBLISH CATEGORY"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles
const labelStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
  fontSize: "14px",
  color: "#334155",
  outline: "none",
  transition: "all 0.2s",
  boxSizing: "border-box",
};
const uploadBoxStyle = {
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};
const dashedBoxStyle = {
  border: "2px dashed #cbd5e1",
  borderRadius: "10px",
  padding: "40px 20px",
  textAlign: "center",
  position: "relative",
  cursor: "pointer",
  background: "white",
  transition: "all 0.3s",
};
const overlayStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "rgba(0,0,0,0.6)",
  padding: "10px",
  display: "flex",
  justifyContent: "center",
};
const removeBtnStyle = {
  background: "transparent",
  color: "white",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: "600",
};
const submitButtonStyle = {
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
  transition: "transform 0.2s",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

export default AddCategoryScreen;
