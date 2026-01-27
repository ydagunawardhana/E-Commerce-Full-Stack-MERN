import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const AddHomeSlideScreen = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
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

  // Submit
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

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
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.post("/api/banners", formData, config);

      alert("Home Slide Added Successfully!");
      navigate("/banners");
    } catch (error) {
      console.error(error);
      const msg =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error uploading banner";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f3f4f6", minHeight: "100vh" }}>
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Add Home Slide</h2>

        <form onSubmit={submitHandler}>
          {/* Upload Box */}
          <div
            style={{
              marginBottom: "30px",
              border: "2px dashed #ddd",
              padding: "40px",
              textAlign: "center",
              borderRadius: "10px",
              background: "#fafafa",
              position: "relative",
            }}
          >
            {preview ? (
              <div
                style={{ position: "relative", width: "100%", height: "200px" }}
              >
                <img
                  src={preview}
                  alt="Banner Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <FaCloudUploadAlt
                  size={50}
                  color="#ccc"
                  style={{ marginBottom: "15px" }}
                />
                <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>
                  Image Upload
                </h4>
                <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                  Click box to upload
                </p>

                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Uploading..." : "PUBLISH AND VIEW"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHomeSlideScreen;
