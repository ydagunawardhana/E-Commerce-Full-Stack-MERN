import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import otpImg from "../images/login-illustration.png";

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  const [logo, setLogo] = useState(null);

  // Input fields
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ForgotPassword page
  const email = location.state?.email || "your email";

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

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

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage(null);

    // OTP array
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      setError("Please enter the 6-digit code");
      setLoading(false);
      return;
    }

    try {
      setMessage("Email verified successfully!");
      setTimeout(() => {
        console.log("OTP Verified:", otpCode);
        setLoading(false);
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
        {/* LEFT SIDE (Form) */}
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
              Verify Your Email
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0 0 15px 0",
              }}
            >
              Please enter the 6-digit code sent to <br />
              <span style={{ fontWeight: "600", color: "#1f2937" }}>
                {email}
              </span>
            </p>
          </div>

          {error && <div style={errorStyle}>{error}</div>}
          {message && <div style={successStyle}>{message}</div>}

          <form onSubmit={submitHandler} autoComplete="off">
            {/*OTP Input Boxes */}
            <div style={otpContainerStyle}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={otpInputStyle}
                  required
                />
              ))}
            </div>

            {/* Verify Button */}
            <button type="submit" style={primaryBtn} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend Link */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={() => console.log("Resend OTP")}
                style={resendBtnStyle}
              >
                Resend
              </button>
            </div>

            {/* Back to Login */}
            <div style={{ textAlign: "center" }}>
              <Link to="/login" style={backLinkStyle}>
                <FaArrowLeft size={12} style={{ marginRight: "5px" }} /> Back to
                Login
              </Link>
            </div>
          </form>
        </div>

        {/*RIGHT SIDE (Illustration)  */}
        <div style={rightSection}>
          <img
            src={otpImg}
            alt="OTP Verification Illustration"
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

// OTP Inputs සඳහා Styles
const otpContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  marginBottom: "25px",
};
const otpInputStyle = {
  width: "45px",
  height: "45px",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: "600",
  border: "2px solid #f3f4f6",
  borderRadius: "10px",
  backgroundColor: "#fff",
  outline: "none",
  color: "#1f2937",
  transition: "border-color 0.2s",
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
const resendBtnStyle = {
  background: "none",
  border: "none",
  color: "#ef4444",
  fontWeight: "600",
  cursor: "pointer",
  padding: 0,
  font: "inherit",
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
  color: "#059669",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "13px",
  textAlign: "center",
};

export default OTPVerificationScreen;
