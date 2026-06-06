import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const EditCategoryScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  //  Data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(`/api/categories/${id}`);
        setName(data.name);
        setImage(data.image);
      } catch (error) {
        console.error("Error fetching category", error);
      }
    };
    fetchCategory();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsImageRemoved(false);
  };

  const handleRemoveImage = () => {
    setImage("");
    setFile(null);
    setPreview(null);
    setIsImageRemoved(true);
  };

  //  Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("isImageRemoved", isImageRemoved);

    if (file) {
      formData.append("image", file);
    }

    try {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;

      if (!userInfo) {
        alert("Please Login First!");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/categories/${id}`, formData, config);
      alert("Category Updated Successfully!");
      navigate("/categories");
    } catch (error) {
      console.error(error);
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error updating category";
      alert(message);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <div
      style={{
        padding: "30px",
        background: "#f3f4f6",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "15px",
          }}
        >
          <h2 style={{ margin: 0, color: "#333", fontSize: "20px" }}>
            Edit Category
          </h2>
          <button
            onClick={() => navigate("/categories")}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#555",
            }}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Category Name</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Image Upload Section */}
          <div style={{ marginBottom: "30px" }}>
            <label style={labelStyle}>Category Image</label>
            <div
              style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}
            >
              {/* Preview Box */}
              {(image || preview) && (
                <div
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
  src={preview ? preview : `${API_URL}${image}`} 
  alt="Category"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              {/* Upload Box */}
              <label
                style={{
                  ...uploadBoxStyle,
                  display: image || preview ? "none" : "flex",
                }}
              >
                <FaCloudUploadAlt size={24} color="#4361ee" />
                <span
                  style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
                >
                  Upload New
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          <button type="submit" style={btnStyle}>
            UPDATE CATEGORY
          </button>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "500",
  color: "#555",
  fontSize: "14px",
};
const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  background: "#fff",
};
const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "#4361ee",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "bold",
  cursor: "pointer",
};
const uploadBoxStyle = {
  width: "100px",
  height: "100px",
  border: "2px dashed #ccc",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  background: "#f9f9f9",
};

export default EditCategoryScreen;
