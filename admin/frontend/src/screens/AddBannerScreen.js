import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaTimesCircle, FaImages } from "react-icons/fa";

const AddBannerScreen = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove Selected Image
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

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploading(true);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post("/api/banners", formData, config);
      alert("Banner Added Successfully!");
      navigate("/admin/banners");
    } catch (error) {
      console.error(error);
      alert("Error uploading banner");
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
            <FaImages /> Add Home Slide
          </h2>
          <p style={{ margin: "8px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
            Upload a new banner image for the home carousel.
          </p>
        </div>

        <form onSubmit={submitHandler} style={{ padding: "40px" }}>
          {/* Upload Area */}
          <div style={{ marginBottom: "30px" }}>
            <label style={labelStyle}>
              Banner Image <span style={{ color: "red" }}>*</span>
            </label>

            <div style={uploadBoxStyle}>
              {preview ? (
                // Preview Mode
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "250px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <img
                    src={preview}
                    alt="Banner Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Overlay Remove Button */}
                  <div style={overlayStyle}>
                    <button
                      type="button"
                      onClick={removeImage}
                      style={removeBtnStyle}
                    >
                      <FaTimesCircle size={18} /> Remove & Change
                    </button>
                  </div>
                </div>
              ) : (
                // Upload Input Box
                <div style={dashedBoxStyle}>
                  <div
                    style={{
                      background: "#e0f2fe",
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <FaCloudUploadAlt size={35} color="#0284c7" />
                  </div>
                  <h5
                    style={{
                      margin: "0 0 5px 0",
                      color: "#334155",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                  >
                    Click to Upload Banner
                  </h5>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>
                    Recommended Size: 1920x600px (JPG/PNG)
                  </p>

                  <input
                    type="file"
                    onChange={handleFileChange}
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
            {uploading ? "Publishing Slide..." : "PUBLISH AND VIEW"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Styles ---
const labelStyle = {
  display: "block",
  marginBottom: "10px",
  fontSize: "13px",
  fontWeight: "700",
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const uploadBoxStyle = {
  background: "#f8fafc",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};
const dashedBoxStyle = {
  border: "2px dashed #cbd5e1",
  borderRadius: "12px",
  padding: "50px 20px",
  textAlign: "center",
  position: "relative",
  cursor: "pointer",
  background: "white",
  transition: "all 0.3s",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const overlayStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
  padding: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  height: "60px",
};
const removeBtnStyle = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "20px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  fontWeight: "600",
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
};
const submitButtonStyle = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#4361ee",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(67, 97, 238, 0.25)",
  transition: "transform 0.2s",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

export default AddBannerScreen;
