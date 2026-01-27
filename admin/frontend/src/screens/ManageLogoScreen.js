import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaTimesCircle } from "react-icons/fa";

const ManageLogoScreen = () => {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await axios.get("/api/logo");
        if (data.image) {
          setPreview(`http://localhost:5000${data.image}`);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setLogo(null);
    setPreview(null);
  };

  // Submit Handler
  const submitHandler = async () => {
    if (!logo) {
      alert("Please select a logo first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", logo);

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      await axios.post("/api/logo", formData, config);

      alert("Logo Updated Successfully!");

      window.dispatchEvent(new Event("logoUpdated"));
    } catch (error) {
      console.error(error);
      alert("Error updating logo");
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f3f4f6", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "800px",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Manage Logo</h2>

        <div
          style={{
            background: "#f9f9f9",
            padding: "30px",
            borderRadius: "10px",
            border: "1px solid #eee",
          }}
        >
          {preview ? (
            <div
              style={{
                position: "relative",
                width: "200px",
                height: "150px",
                background: "white",
                border: "1px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              <img
                src={preview}
                alt="Logo Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
              <FaTimesCircle
                size={24}
                color="#ef4444"
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  cursor: "pointer",
                  background: "white",
                  borderRadius: "50%",
                }}
                onClick={removeImage}
              />
            </div>
          ) : (
            <div
              style={{
                width: "200px",
                height: "150px",
                border: "2px dashed #ddd",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <input
                type="file"
                onChange={handleImageChange}
                style={{
                  opacity: 0,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
                accept="image/*"
              />
              <div style={{ textAlign: "center" }}>
                <FaCloudUploadAlt size={40} color="#ccc" />
                <p
                  style={{
                    color: "#888",
                    margin: "5px 0 0 0",
                    fontSize: "14px",
                  }}
                >
                  Image Upload
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={submitHandler}
          style={{
            marginTop: "30px",
            width: "100%",
            padding: "15px",
            background: "#4361ee",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <FaCloudUploadAlt /> PUBLISH AND VIEW
        </button>
      </div>
    </div>
  );
};

export default ManageLogoScreen;
