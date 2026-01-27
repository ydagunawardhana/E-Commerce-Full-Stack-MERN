import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import registerImg from "../images/login-illustration.png";

const AdminRegisterScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState(null);
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
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    // First Name & Last Name
    const fullName = `${firstName} ${lastName}`;

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/users",
        { name: fullName, email, password, isAdmin: true },
        config
      );

      setLoading(false);
      window.location.href = "/login";
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
        {/* LEFT SIDE (Form) */}
        <div style={leftSection}>
          <div style={{ marginBottom: "20px" }}>
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
              Create Account
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Join us and manage your store
            </p>
          </div>

          {error && <div style={errorStyle}>{error}</div>}
          {message && <div style={errorStyle}>{message}</div>}

          <div style={dividerContainer}>
            <div style={lineStyle}></div>

            <div style={lineStyle}></div>
          </div>

          <form onSubmit={submitHandler} autoComplete="off">
            {/* First Name & Last Name Row */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
              {/* First Name Input */}
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First Name</label>
                <div style={inputGroup}>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={inputField}
                    placeholder="First Name"
                    required
                    autoComplete="off"
                    name="fname_field"
                  />
                </div>
              </div>

              {/* Last Name Input */}
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last Name</label>
                <div style={inputGroup}>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={inputField}
                    placeholder="Last Name"
                    required
                    autoComplete="off"
                    name="lname_field"
                  />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Email address</label>
              <div style={inputGroup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputField}
                  placeholder="admin@example.com"
                  required
                  autoComplete="off"
                  name="email_new_reg"
                />
                <span style={iconSpan}>
                  <FaEnvelope color="#9ca3af" size={16} />
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Password</label>
              <div style={inputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputField}
                  placeholder="Create password"
                  required
                  autoComplete="new-password"
                  name="new_pwd_reg"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ ...iconSpan, cursor: "pointer", zIndex: 2 }}
                >
                  {showPassword ? (
                    <FaEyeSlash color="#9ca3af" size={18} />
                  ) : (
                    <FaEye color="#9ca3af" size={18} />
                  )}
                </span>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={inputGroup}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputField}
                  placeholder="Confirm password"
                  required
                  autoComplete="new-password"
                  name="confirm_pwd_reg"
                />
                <span style={iconSpan}>
                  <FaLock color="#9ca3af" size={16} />
                </span>
              </div>
            </div>

            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div
              style={{ textAlign: "center", fontSize: "14px", color: "#555" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#ef4444",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            </div>
          </form>
        </div>

        {/*  RIGHT SIDE (Illustration) */}
        <div style={rightSection}>
          <img
            src={registerImg}
            alt="Register Illustration"
            style={illustrationImage}
          />
        </div>
      </div>
    </div>
  );
};

//  STYLES
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
  padding: "40px 50px",
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
  marginBottom: "5px",
  fontSize: "13px",
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
  padding: "12px 15px", // Padding පොඩ්ඩක් අඩු කළා text එක ලස්සනට පෙනෙන්න
  fontSize: "14px",
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
  padding: "14px",
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "background 0.3s",
  marginBottom: "15px",
  boxShadow: "0 8px 20px rgba(239, 68, 68, 0.2)",
};

const googleBtnStyle = {
  width: "100%",
  padding: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  background: "white",
  border: "2px solid #f3f4f6",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  cursor: "pointer",
  marginBottom: "20px",
};

const dividerContainer = {
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
};
const lineStyle = { flex: 1, height: "1px", backgroundColor: "#e5e7eb" };

const errorStyle = {
  background: "#fee2e2",
  color: "#ef4444",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "13px",
  textAlign: "center",
};

export default AdminRegisterScreen;
