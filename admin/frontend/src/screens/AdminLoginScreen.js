import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaEye, FaEyeSlash, FaShoppingBag } from "react-icons/fa";

import loginImg from "../images/login-illustration.png";

const AdminLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/");
    }
    const fetchLogo = async () => {
      try {
        const { data } = await axios.get("/api/logo");
        if (data.image) {
          setLogo(`http://localhost:5000${data.image}`);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      window.location.href = "/";
    } catch (err) {
      setLoading(false);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  return (
    <div style={pageContainer}>
      <div style={mainCard}>
        {/*  LEFT SIDE (Form) */}
        <div style={leftSection}>
          <div style={{ marginBottom: "30px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: "35px", objectFit: "contain" }}
                />
              ) : (
                <FaShoppingBag size={28} color="#ff3e3e" />
              )}
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#1f2937",
                }}
              >
                NEXAMART
              </span>
            </div>
            <h2
              style={{
                fontSize: "20px",
                color: "#111",
                fontWeight: "700",
                margin: "0 0 5px 0",
              }}
            >
              Welcome Back!
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Login to manage your store
            </p>
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <form onSubmit={submitHandler} autoComplete="off">
            {/* Email Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Email address</label>
              <div style={inputGroup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputField}
                  placeholder="admin@gmail.com"
                  required
                  autoComplete="off"
                />
                <span style={iconSpan}>
                  <FaEnvelope color="#9ca3af" size={18} />
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: "10px" }}>
              <label style={labelStyle}>Password</label>
              <div style={inputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputField}
                  placeholder="Enter password"
                  required
                  autoComplete="new-password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ ...iconSpan, cursor: "pointer", zIndex: 2 }}
                >
                  {showPassword ? (
                    <FaEyeSlash color="#9ca3af" size={20} />
                  ) : (
                    <FaEye color="#9ca3af" size={20} />
                  )}
                </span>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: "right", marginBottom: "25px" }}>
              <Link
                to="/forgot-password"
                style={{
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Logging in..." : "Login Now"}
            </button>

            <div style={divider}>
              <span>OR</span>
            </div>

            <Link to="/register" style={secondaryBtn}>
              Signup Now
            </Link>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div style={rightSection}>
          <img
            src={loginImg}
            alt="Login Illustration"
            style={illustrationImage}
          />
        </div>
      </div>
    </div>
  );
};

// STYLES
const pageContainer = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f0f2f5",
  fontFamily: "'Poppins', sans-serif, system-ui",
  padding: "20px",
};
const mainCard = {
  display: "flex",
  width: "100%",
  maxWidth: "950px",
  minHeight: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
  overflow: "hidden",
};
const leftSection = {
  flex: "1",
  padding: "50px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "#fff",
  zIndex: 2,
};
const rightSection = {
  flex: "1.1",
  backgroundColor: "#fdf2f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  position: "relative",
};
const illustrationImage = {
  width: "100%",
  maxWidth: "450px",
  height: "auto",
  objectFit: "contain",
};
const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};
const inputGroup = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};
const inputField = {
  width: "100%",
  padding: "16px 45px 16px 16px",
  fontSize: "15px",
  border: "2px solid #f3f4f6",
  borderRadius: "10px",
  backgroundColor: "#fff",
  outline: "none",
  color: "#1f2937",
  transition: "border-color 0.2s",
};
const iconSpan = {
  position: "absolute",
  right: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
};
const primaryBtn = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "background 0.3s",
  marginBottom: "20px",
  boxShadow: "0 8px 20px rgba(239, 68, 68, 0.2)",
};
const secondaryBtn = {
  display: "block",
  width: "100%",
  padding: "15px",
  backgroundColor: "transparent",
  color: "#ef4444",
  border: "2px solid #ef4444",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "700",
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
  transition: "0.3s",
  boxSizing: "border-box",
};
const divider = {
  position: "relative",
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "13px",
  color: "#9ca3af",
  fontWeight: "500",
};
const errorStyle = {
  background: "#fee2e2",
  color: "#ef4444",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontSize: "13px",
  textAlign: "center",
};

export default AdminLoginScreen;
