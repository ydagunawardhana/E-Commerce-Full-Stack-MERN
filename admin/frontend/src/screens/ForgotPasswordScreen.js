import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaShoppingBag, FaArrowLeft } from "react-icons/fa";

// Image import
import forgotImg from "../images/login-illustration.png";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Logo Data fetch
    const fetchLogo = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL; 

        const { data } = await axios.get(`${API_URL}/api/logo`);
        
        if (data.image) {
         
          setLogo(`${API_URL}${data.image}`);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage(null);

    try {
      const config = { headers: { "Content-Type": "application/json" } };

      setTimeout(() => {
        setMessage(`Password reset link sent to ${email}`);
        setLoading(false);

        navigate("/verify-otp", { state: { email } });
      }, 1500);
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
        {/* LEFT SIDE (Form)  */}
        <div style={leftSection}>
          <div style={{ marginBottom: "25px" }}>
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
                fontSize: "22px",
                color: "#111",
                fontWeight: "700",
                margin: "0 0 5px 0",
              }}
            >
              Forgot Password?
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Enter your email to reset your password.
            </p>
          </div>

          {error && <div style={errorStyle}>{error}</div>}
          {message && <div style={successStyle}>{message}</div>}

          <form onSubmit={submitHandler} autoComplete="off">
            {/* Email Input */}
            <div style={{ marginBottom: "25px" }}>
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
                />
                <span style={iconSpan}>
                  <FaEnvelope color="#9ca3af" size={16} />
                </span>
              </div>
            </div>

            {/* Send Link Button */}
            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Sending Link..." : "Send Reset Link"}
            </button>

            {/* Back to Login */}
            <div style={{ textAlign: "center" }}>
              <Link to="/login" style={backLinkStyle}>
                <FaArrowLeft size={12} style={{ marginRight: "5px" }} /> Back to
                Login
              </Link>
            </div>
          </form>
        </div>

        {/* --- RIGHT SIDE (Illustration) --- */}
        <div style={rightSection}>
          <img
            src={forgotImg}
            alt="Forgot Password Illustration"
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
  maxWidth: "900px",
  minHeight: "500px",
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
  maxWidth: "400px",
  height: "auto",
  objectFit: "contain",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
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
  padding: "14px 40px 14px 16px",
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
  marginBottom: "20px",
  boxShadow: "0 8px 20px rgba(239, 68, 68, 0.2)",
};

const backLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  transition: "0.3s",
};

const errorStyle = {
  background: "#fee2e2",
  color: "#ef4444",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "13px",
  textAlign: "center",
};

const successStyle = {
  background: "#d1fae5",
  color: "#059669", // Green text
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "13px",
  textAlign: "center",
};

export default ForgotPasswordScreen;
