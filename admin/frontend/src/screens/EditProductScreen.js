import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt, FaStar, FaTimesCircle } from "react-icons/fa";

const EditProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data States
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdLevels, setThirdLevels] = useState([]);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [productSize, setProductSize] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Dropdowns
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [thirdLevel, setThirdLevel] = useState("");

  // Image States
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isBannerActive, setIsBannerActive] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes, thirdRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/subcategories"),
          axios.get("/api/thirdlevels"),
        ]);
        setCategories(catRes.data);
        setSubCategories(subRes.data);
        setThirdLevels(thirdRes.data);

        const { data } = await axios.get(`/api/products/${id}`);

        setName(data.name);
        setDescription(data.description);
        setBrand(data.brand);
        setPrice(data.price);
        setOldPrice(data.oldPrice || 0);
        setCountInStock(data.countInStock || 0);
        setDiscount(data.discount || 0);
        setIsFeatured(data.isFeatured);
        setRating(data.rating || 0);
        setIsBannerActive(data.isBannerActive || false);

        if (data.size && data.size.length > 0) {
          setProductSize(data.size.join(","));
        }

        const foundCat = catRes.data.find((c) => c.name === data.category);
        if (foundCat) setCategory(foundCat._id);
        const foundSub = subRes.data.find((s) => s.name === data.subCategory);
        if (foundSub) setSubCategory(foundSub._id);
        const foundThird = thirdRes.data.find(
          (t) => t.name === data.thirdLevelCategory
        );
        if (foundThird) setThirdLevel(foundThird._id);

        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }

        if (data.bannerImage) {
  setBannerPreview(
    data.bannerImage.startsWith("/")
      ? `${API_URL}${data.bannerImage}` 
      : data.bannerImage
  );
}
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [id]);

  const filteredSubCats = category
    ? subCategories.filter((s) => s.category && s.category._id === category)
    : [];
  const filteredThirdLevels = subCategory
    ? thirdLevels.filter(
        (t) => t.subCategory && t.subCategory._id === subCategory
      )
    : [];

  const handleMultipleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...selectedFiles]);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (imgUrl) => {
    setExistingImages(existingImages.filter((img) => img !== imgUrl));
  };

  const removeNewImage = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeBanner = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop clicking input behind it
    setBannerFile(null);
    setBannerPreview(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("oldPrice", oldPrice || 0);
    formData.append("countInStock", countInStock || 0);
    formData.append("discount", discount || 0);
    formData.append("rating", rating || 0);
    formData.append("isFeatured", isFeatured);
    formData.append("isBannerActive", isBannerActive);
    formData.append("size", productSize);

    const catName = categories.find((c) => c._id === category)?.name || "";
    const subName =
      subCategories.find((s) => s._id === subCategory)?.name || "";
    const thirdName = thirdLevels.find((t) => t._id === thirdLevel)?.name || "";

    formData.append("category", catName);
    formData.append("subCategory", subName);
    formData.append("thirdLevelCategory", thirdName);

    existingImages.forEach((img) => {
      formData.append("existingImages", img);
    });

    for (let i = 0; i < newFiles.length; i++) {
      formData.append("images", newFiles[i]);
    }

    if (bannerFile) {
      formData.append("bannerImage", bannerFile);
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/products/${id}`, formData, config);
      alert("Product Updated Successfully!");
      navigate("/products");
    } catch (error) {
      console.error(error);
      const msg =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error updating product";
      alert(msg);
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
        }}
      >
        <h2
          style={{ marginBottom: "25px", color: "#1e293b", fontWeight: "700" }}
        >
          Edit Product
        </h2>
        <form onSubmit={submitHandler}>
          {/* Dropdowns & Inputs */}
          <div style={gridContainerStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Category</label>
              <select
                style={inputStyle}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory("");
                  setThirdLevel("");
                }}
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
              <label style={labelStyle}>Product Sub Category</label>
              <select
                style={inputStyle}
                value={subCategory}
                onChange={(e) => {
                  setSubCategory(e.target.value);
                  setThirdLevel("");
                }}
                disabled={!category}
              >
                <option value="">Select Sub Category</option>
                {filteredSubCats.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Third Level Category</label>
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
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Price</label>
              <input
                type="number"
                style={inputStyle}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Old Price</label>
              <input
                type="number"
                style={inputStyle}
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Is Featured?</label>
              <select
                style={inputStyle}
                value={isFeatured}
                onChange={(e) => setIsFeatured(e.target.value === "true")}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Stock</label>
              <input
                type="number"
                style={inputStyle}
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Brand</label>
              <input
                type="text"
                style={inputStyle}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Discount</label>
              <input
                type="number"
                style={inputStyle}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Product Sizes</label>
              <input
                type="text"
                placeholder="S, M, L, XL"
                style={inputStyle}
                value={productSize}
                onChange={(e) => setProductSize(e.target.value)}
              />
              <span
                style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}
              >
                (Separate with comma)
              </span>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Product Name</label>
            <input
              type="text"
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, height: "100px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "25px" }}>
            <label style={labelStyle}>Product Rating</label>
            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  color={
                    star <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          {/* Media & Images Section */}
          <h3
            style={{
              marginTop: "30px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Media & Images
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "15px",
            }}
          >
            {/* Product Images Upload (Overlay Method) */}
            <div style={uploadBoxStyle}>
              <div style={{ ...dashedBoxStyle, position: "relative" }}>
                <FaCloudUploadAlt size={40} color="#ccc" />
                <p
                  style={{ color: "#888", margin: "10px 0", fontSize: "13px" }}
                >
                  Product Images Upload (Click Here)
                </p>

                <input
                  type="file"
                  multiple
                  onChange={handleMultipleFiles}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                />
              </div>

              {/* Previews */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                }}
              >
                {existingImages.map((img, index) => (
                  <div key={`exist-${index}`} style={{ position: "relative" }}>
                   <img
  src={
    img.startsWith("/")
      ? `${API_URL}${img}` 
      : img
  }
  alt="Existing"
  style={previewImageStyle}
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/80";
  }}
/>
                    <FaTimesCircle
                      size={20}
                      color="#ef4444"
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "white",
                        borderRadius: "50%",
                        cursor: "pointer",
                        zIndex: 20,
                      }}
                      onClick={() => removeExistingImage(img)}
                    />
                  </div>
                ))}
                {newPreviews.map((src, index) => (
                  <div key={`new-${index}`} style={{ position: "relative" }}>
                    <img src={src} alt="New" style={previewImageStyle} />
                    <FaTimesCircle
                      size={20}
                      color="#ef4444"
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "white",
                        borderRadius: "50%",
                        cursor: "pointer",
                        zIndex: 20,
                      }}
                      onClick={() => removeNewImage(index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Section (Overlay Method) */}
            <div style={uploadBoxStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h4 style={{ fontSize: "14px", color: "#555", margin: 0 }}>
                  Banner Images
                </h4>
                <div
                  onClick={() => setIsBannerActive(!isBannerActive)}
                  style={{
                    width: "40px",
                    height: "20px",
                    background: isBannerActive ? "#4361ee" : "#cbd5e1",
                    borderRadius: "20px",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    zIndex: 30,
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      background: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                      left: isBannerActive ? "22px" : "2px",
                      transition: "left 0.3s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  ...dashedBoxStyle,
                  opacity: isBannerActive ? 1 : 0.6,
                  position: "relative",
                }}
              >
                {bannerPreview ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={bannerPreview}
                      alt="Banner"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <FaTimesCircle
                      size={24}
                      color="#ef4444"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "white",
                        borderRadius: "50%",
                        cursor: "pointer",
                        zIndex: 20,
                      }}
                      onClick={removeBanner}
                    />
                  </div>
                ) : (
                  <>
                    <FaCloudUploadAlt size={40} color="#ccc" />
                    <p
                      style={{
                        color: "#888",
                        margin: "10px 0",
                        fontSize: "13px",
                      }}
                    >
                      Banner Upload (Click Here)
                    </p>
                  </>
                )}

                <input
                  type="file"
                  onChange={handleBannerFile}
                  disabled={!isBannerActive}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: isBannerActive ? "pointer" : "default",
                    zIndex: 10,
                    display: isBannerActive ? "block" : "none",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "30px",
              width: "100%",
              padding: "15px",
              background: "#4361ee",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            UPDATE PRODUCT
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles
const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
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
};
const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
  fontSize: "14px",
  color: "#334155",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const uploadBoxStyle = {
  background: "#f9f9f9",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #eee",
};
const dashedBoxStyle = {
  border: "2px dashed #ddd",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center",
  position: "relative",
  minHeight: "150px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "white",
  transition: "opacity 0.3s",
  width: "100%",
};
const previewImageStyle = {
  width: "80px",
  height: "80px",
  objectFit: "cover",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

export default EditProductScreen;
