import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const EditSubCategoryScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  //  Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get("/api/categories");
        setCategories(categoriesRes.data);

        const subCatRes = await axios.get(`/api/subcategories/${id}`);

        const catData = subCatRes.data.category;

        if (catData && catData._id) {
          setSelectedCategory(catData._id);
        } else {
          setSelectedCategory(catData);
        }

        setSubCategoryName(subCatRes.data.name);
      } catch (error) {
        console.error("Error fetching data");
      }
    };
    fetchData();
  }, [id]);

  // Update Handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      //  Token
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // Header
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/subcategories/${id}`,
        {
          categoryId: selectedCategory,
          name: subCategoryName,
        },
        config
      );

      alert("Sub Category Updated Successfully!");
      navigate("/subcategories");
    } catch (error) {
      console.error(error);
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error updating sub category";
      alert(message);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f3f4f6", minHeight: "100vh" }}>
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
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
            Edit Sub Category
          </h2>
          <button
            onClick={() => navigate("/subcategories")}
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

        <form onSubmit={submitHandler}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#555",
                fontSize: "14px",
              }}
            >
              Product Category
            </label>
            <select
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                background: "#fff",
              }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#555",
                fontSize: "14px",
              }}
            >
              Sub Category Name
            </label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                background: "#fff",
              }}
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#4361ee",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <FaCloudUploadAlt /> UPDATE SUB CATEGORY
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubCategoryScreen;
