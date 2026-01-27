import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLayerGroup, FaPlus, FaLevelUpAlt, FaStream } from "react-icons/fa";

const AddSubCategoryScreen = () => {
  const navigate = useNavigate();

  // Data States
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  //  Add Sub Category
  const [subCatMain, setSubCatMain] = useState("");
  const [subCatName, setSubCatName] = useState("");

  // Add Third Level
  const [thirdCatMain, setThirdCatMain] = useState("");
  const [thirdSubCat, setThirdSubCat] = useState("");
  const [thirdLevelName, setThirdLevelName] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/subcategories"),
        ]);
        setCategories(catRes.data);
        setSubCategories(subRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter Sub Categories for Third Level Form
  const filteredSubCats =
    categories.find((cat) => cat._id === thirdCatMain)?.subCategories || [];

  // Add Sub Category Submit
  const submitSubHandler = async (e) => {
    e.preventDefault();
    if (!subCatMain || !subCatName) return alert("Please fill all fields");

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        "/api/subcategories",
        {
          name: subCatName,
          categoryId: subCatMain,
        },
        config
      );
      alert("Sub Category Added Successfully!");
      navigate("/subcategories");
    } catch (error) {
      alert("Error adding sub category");
    } finally {
      setLoading(false);
    }
  };

  //  Add Third Level Submit
  const submitThirdHandler = async (e) => {
    e.preventDefault();
    if (!thirdSubCat || !thirdLevelName) return alert("Please fill all fields");

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      alert("Third Level Category Added Successfully!");
      navigate("/category/list");
    } catch (error) {
      alert("Error adding third level category");
    } finally {
      setLoading(false);
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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
            padding: "30px 40px",
            borderRadius: "16px",
            color: "white",
            marginBottom: "30px",
            boxShadow: "0 10px 20px rgba(67, 97, 238, 0.2)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaStream /> Manage Categories
          </h2>
          <p style={{ margin: "8px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
            Add new sub-categories and nested third-level items here.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "30px",
          }}
        >
          {/*  Card 1: Add Sub Category */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={iconBoxStyle}>
                <FaLayerGroup size={18} color="#4361ee" />
              </div>
              <h3 style={cardTitleStyle}>Add Sub Category</h3>
            </div>

            <form onSubmit={submitSubHandler} style={{ padding: "30px" }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Select Main Category</label>
                <select
                  style={inputStyle}
                  value={subCatMain}
                  onChange={(e) => setSubCatMain(e.target.value)}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Sub Category Name</label>
                <input
                  type="text"
                  placeholder="Enter Name (e.g. Mens Wear)"
                  style={inputStyle}
                  value={subCatName}
                  onChange={(e) => setSubCatName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={submitButtonStyle}
              >
                {loading ? "Adding..." : "PUBLISH SUB CATEGORY"}
              </button>
            </form>
          </div>

          {/*  Card 2: Add Third Level Category  */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ ...iconBoxStyle, background: "#f0fdf4" }}>
                <FaLevelUpAlt size={18} color="#16a34a" />
              </div>
              <h3 style={cardTitleStyle}>Add Third Level Category</h3>
            </div>

            <form onSubmit={submitThirdHandler} style={{ padding: "30px" }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Select Main Category</label>
                <select
                  style={inputStyle}
                  value={thirdCatMain}
                  onChange={(e) => {
                    setThirdCatMain(e.target.value);
                    setThirdSubCat("");
                  }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Select Sub Category</label>
                <select
                  style={inputStyle}
                  value={thirdSubCat}
                  onChange={(e) => setThirdSubCat(e.target.value)}
                  disabled={!thirdCatMain}
                >
                  <option value="">-- Select Sub Category --</option>
                  {filteredSubCats.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Third Level Name</label>
                <input
                  type="text"
                  placeholder="Enter Name (e.g. T-Shirts)"
                  style={inputStyle}
                  value={thirdLevelName}
                  onChange={(e) => setThirdLevelName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...submitButtonStyle,
                  background: "#16a34a",
                  boxShadow: "0 8px 15px rgba(22, 163, 74, 0.2)",
                }}
              >
                {loading ? "Adding..." : "PUBLISH THIRD LEVEL"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const cardStyle = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};
const cardHeaderStyle = {
  padding: "20px 30px",
  borderBottom: "1px solid #f1f5f9",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#fcfcfc",
};
const iconBoxStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  background: "#eef2ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const cardTitleStyle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "700",
  color: "#1e293b",
};
const inputGroupStyle = { marginBottom: "20px" };
const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  textTransform: "uppercase",
};
const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#f8fafc",
  fontSize: "14px",
  color: "#334155",
  outline: "none",
  transition: "all 0.2s",
  boxSizing: "border-box",
};
const submitButtonStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#4361ee",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 8px 15px rgba(67, 97, 238, 0.2)",
  transition: "transform 0.2s",
  textTransform: "uppercase",
  marginTop: "10px",
};

export default AddSubCategoryScreen;
