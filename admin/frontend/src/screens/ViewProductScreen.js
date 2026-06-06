import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft, FaUserCircle, FaTrash } from "react-icons/fa";

const ViewProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Product Data Fetching
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setActiveImage(data.images[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Review Delete
  const deleteReviewHandler = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        setLoadingDelete(true);
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const API_URL = import.meta.env.VITE_API_URL; 

        await axios.delete(
          `${API_URL}/api/products/${id}/reviews/${reviewId}`,
          config
        );

        alert("Review Deleted Successfully");
        fetchProduct();
        setLoadingDelete(false);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Error deleting review");
        setLoadingDelete(false);
      }
    }
  };

  if (!product) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div
      style={{
        padding: "30px",
        background: "#f8f9fa",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Header with Back Button */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <button
          onClick={() => navigate("/products")}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer",
            color: "#555",
          }}
        >
          <FaArrowLeft />
        </button>
        <h2 style={{ margin: 0, color: "#333" }}>Product Details</h2>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          padding: "40px",
          display: "flex",
          gap: "50px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE: Image Gallery */}
        <div style={{ flex: "1 1 400px", display: "flex", gap: "20px" }}>
          {/* Thumbnails Strip */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
  {product.images &&
    product.images.map((img, index) => (
      <img
        key={index}
        src={
          img.startsWith("http") ? img : `${API_URL}${img}` 
        }
        alt="thumb"
        onClick={() => setActiveImage(img)}
        style={{
          width: "70px",
          height: "70px",
          objectFit: "cover",
          borderRadius: "8px",
          cursor: "pointer",
          border:
            activeImage === img
              ? "2px solid #4361ee"
              : "1px solid #eee",
        }}
      />
    ))}
</div>

          {/* Main Large Image */}
         <div style={{ flex: 1 }}>
  <img
    src={
      activeImage.startsWith("http")
        ? activeImage
        : `${API_URL}${activeImage}` 
    }
    alt="Main"
    style={{
      width: "100%",
      maxHeight: "500px",
      objectFit: "contain",
      borderRadius: "12px",
      border: "1px solid #f0f0f0",
    }}
  />
</div>
        </div>

        {/*  RIGHT SIDE: Product Info  */}
        <div style={{ flex: "1 1 400px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#222",
              marginBottom: "20px",
            }}
          >
            {product.name}
          </h1>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Brand :</span>
            <span style={valueStyle}>{product.brand}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Category :</span>
            <span style={valueStyle}>{product.category}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Price :</span>
            <span style={{ ...valueStyle, fontSize: "20px", color: "#4361ee" }}>
              $ {product.price}
            </span>
            {product.oldPrice && (
              <span
                style={{
                  marginLeft: "10px",
                  textDecoration: "line-through",
                  color: "#999",
                }}
              >
                $ {product.oldPrice}
              </span>
            )}
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>SIZE :</span>
            <span
              style={{
                background: "#f0f0f0",
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              {product.size || "N/A"}
            </span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Stock :</span>
            <span
              style={{
                color: product.countInStock > 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {product.countInStock > 0
                ? `${product.countInStock} Available`
                : "Out of Stock"}
            </span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Rating :</span>
            <div style={{ display: "flex", color: "#ffc107" }}>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < product.rating ? "#ffc107" : "#e4e5e9"}
                />
              ))}
            </div>
            <span
              style={{ marginLeft: "10px", color: "#777", fontSize: "14px" }}
            >
              (Based on user reviews)
            </span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Published :</span>
            <span style={valueStyle}>
              {new Date(product.createdAt).toLocaleDateString()}
            </span>
          </div>

          <hr
            style={{
              margin: "30px 0",
              border: "none",
              borderTop: "1px solid #eee",
            }}
          />

          {/* Description */}
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Product Description
          </h3>
          <p style={{ color: "#555", lineHeight: "1.6", fontSize: "15px" }}>
            {product.description}
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION: Reviews*/}
      <div
        style={{
          maxWidth: "1200px",
          margin: "30px auto",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          padding: "40px",
        }}
      >
        <h3
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}
        >
          Customer Reviews ({product.reviews.length})
        </h3>

        {/*Reviews List */}
        {product.reviews.length === 0 && (
          <p style={{ color: "#888" }}>No reviews yet.</p>
        )}

        {product.reviews.map((review) => (
          <div
            key={review._id}
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
              borderBottom: "1px solid #f1f1f1",
              paddingBottom: "20px",
            }}
          >
            <FaUserCircle size={40} color="#ccc" />
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {review.name}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      color: "#ffc107",
                      fontSize: "12px",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                      />
                    ))}
                  </div>
                </div>

                {/* Delete Review Button */}
                <button
                  onClick={() => deleteReviewHandler(review._id)}
                  disabled={loadingDelete}
                  style={{
                    background: "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>

              <span style={{ fontSize: "12px", color: "#999" }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <p style={{ margin: "5px 0 0 0", color: "#555" }}>
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles
const infoRowStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "12px",
};
const labelStyle = { width: "120px", fontWeight: "600", color: "#555" };
const valueStyle = { fontWeight: "500", color: "#333" };

export default ViewProductScreen;
