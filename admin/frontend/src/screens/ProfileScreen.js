import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaCamera,
  FaArrowLeft,
  FaUserCircle,
} from "react-icons/fa";

const ProfileScreen = () => {
  const navigate = useNavigate();

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Data
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      const user = JSON.parse(userInfo);
      setName(user.name);
      setEmail(user.email);

      if (user.image) {
        const API_URL = import.meta.env.VITE_API_URL; 

        setImagePreview(
          user.image.startsWith("http")
            ? user.image
            : `${API_URL}${user.image}` 
        );
      }
    }
  }, [navigate]);

  // Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put("/api/users/profile", formData, config);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setMessage("Profile Updated Successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
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
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
            padding: "30px 40px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* Back Button Integrated */}
            <button onClick={() => navigate("/")} style={headerBackBtn}>
              <FaArrowLeft size={16} />
            </button>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaUserCircle /> My Profile
              </h2>
              <p
                style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "14px" }}
              >
                Manage your personal details
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "40px" }}>
          {/* Messages */}
          {message && (
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "25px",
                fontWeight: "500",
                border: "1px solid #bbf7d0",
              }}
            >
              {message}
            </div>
          )}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "25px",
                fontWeight: "500",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>
            {/* Profile Image */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "130px",
                  height: "130px",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #e0e7ff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <label htmlFor="fileInput" style={cameraBtnStyle}>
                  <FaCamera size={16} color="white" />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
              <p
                style={{
                  marginTop: "12px",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Allowed *.jpeg, *.jpg, *.png
              </p>
            </div>

            {/* Form Fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "25px",
                marginBottom: "25px",
              }}
            >
              {/* Name */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <div style={inputWrapperStyle}>
                  <FaUser style={iconStyle} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWrapperStyle}>
                  <FaEnvelope style={iconStyle} />
                  <input
                    type="email"
                    value={email}
                    disabled
                    style={{
                      ...inputStyle,
                      background: "#f1f5f9",
                      color: "#94a3b8",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>New Password</label>
                <div style={inputWrapperStyle}>
                  <FaLock style={iconStyle} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Confirm New Password</label>
                <div style={inputWrapperStyle}>
                  <FaLock style={iconStyle} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} style={submitButtonStyle}>
              <FaSave style={{ marginRight: "8px" }} />
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Styles
const headerBackBtn = {
  background: "rgba(255,255,255,0.2)",
  border: "none",
  color: "white",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "0.2s",
};
const cameraBtnStyle = {
  position: "absolute",
  bottom: "5px",
  right: "5px",
  background: "#4361ee",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: "3px solid white",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
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
  letterSpacing: "0.5px",
};
const inputWrapperStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};
const inputStyle = {
  width: "100%",
  padding: "14px 14px 14px 45px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
  fontSize: "14px",
  color: "#334155",
  outline: "none",
  transition: "all 0.2s",
  boxSizing: "border-box",
};
const iconStyle = {
  position: "absolute",
  left: "15px",
  color: "#94a3b8",
  fontSize: "16px",
};
const submitButtonStyle = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#4361ee",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(67, 97, 238, 0.25)",
  transition: "transform 0.2s",
  textTransform: "uppercase",
  letterSpacing: "1px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "20px",
};

export default ProfileScreen;
