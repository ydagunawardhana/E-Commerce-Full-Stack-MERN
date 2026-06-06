import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const EditHomeSlideScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchBanner = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL; 

      const { data } = await axios.get(`${API_URL}/api/banners/${id}`);
      
      const imageUrl = data.image.startsWith("/")
        ? `${API_URL}${data.image}` 
        : data.image;
        
      setPreview(imageUrl);
    } catch (error) {
      console.error("Error fetching banner:", error);
      alert("Could not load banner data");
    }
  };
  fetchBanner();
}, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    setImage(null);
    setPreview(null);
  };

  //  Update
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.put(`/api/banners/${id}`, formData, config);
      alert("Home Slide Updated Successfully!");
      navigate("/admin/banners");
    } catch (error) {
      console.error(error);
      const msg =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error updating banner";
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
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Edit Home Slide</h2>

        <form onSubmit={submitHandler}>
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
                    zIndex: 10,
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
                  Change Image
                </h4>
                <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                  Click box to upload new image
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
              background: "#4361ee",
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
            {loading ? "Updating..." : "UPDATE BANNER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditHomeSlideScreen;
