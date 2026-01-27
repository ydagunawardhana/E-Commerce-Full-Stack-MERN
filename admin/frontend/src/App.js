import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaBars, FaUser, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

// Components
import Sidebar from "./components/Sidebar";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import AdminRegisterScreen from "./screens/AdminRegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import ProfileScreen from "./screens/ProfileScreen";

// Screens
import DashboardScreen from "./screens/DashboardScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import ProductListScreen from "./screens/ProductListScreen";
import AddProductScreen from "./screens/AddProductScreen";
import EditProductScreen from "./screens/EditProductScreen";
import ViewProductScreen from "./screens/ViewProductScreen";
import BannerManagementScreen from "./screens/BannerManagementScreen";
import AddBannerScreen from "./screens/AddBannerScreen";
import EditHomeSlideScreen from "./screens/EditHomeSlideScreen";
import CategoryListScreen from "./screens/CategoryListScreen";
import AddCategoryScreen from "./screens/AddCategoryScreen";
import EditCategoryScreen from "./screens/EditCategoryScreen";
import SubCategoryListScreen from "./screens/SubCategoryListScreen";
import AddSubCategoryScreen from "./screens/AddSubCategoryScreen";
import EditSubCategoryScreen from "./screens/EditSubCategoryScreen";

import ManageLogoScreen from "./screens/ManageLogoScreen";
import defaultLogo from "./images/logo.jpeg";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(defaultLogo);

  // Profile Dropdown state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);

  // User Info State
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchLogo = async () => {
    try {
      const { data } = await axios.get("/api/logo");
      if (data.image) {
        setCurrentLogo(`http://localhost:5000${data.image}`);
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      {!userInfo ? (
        <Routes>
          <Route path="/login" element={<AdminLoginScreen />} />
          <Route path="/register" element={<AdminRegisterScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/verify-otp" element={<OTPVerificationScreen />} />
          <Route path="*" element={<AdminLoginScreen />} />
        </Routes>
      ) : (
        <div className="app-layout">
          <header className="top-header">
            <div className="header-left">
              <img
                src={currentLogo}
                alt="NexaMart"
                className="header-logo"
                style={{ width: "60px", height: "60px", objectFit: "contain" }}
              />
              <h2 className="brand-name">NexaMart</h2>
              <FaBars className="toggle-btn" onClick={toggleSidebar} />
            </div>

            <div className="header-center">
              <h2>Admin Panel</h2>
            </div>

            {/* Header Right Side (Profile) */}
            <div
              className="header-right"
              style={{ position: "relative" }}
              ref={dropdownRef}
            >
              <div
                className="user-profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "10px",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {userInfo.name}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: "#444",
                    }}
                  >
                    {userInfo.email}
                  </span>
                </div>

                <img
                  src={
                    userInfo.image
                      ? userInfo.image
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid #e5e7eb",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaUser size={14} /> Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt size={14} /> Sign Out
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="main-container">
            <Sidebar isOpen={isSidebarOpen} />

            <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
              <div className="content-body">
                <Routes>
                  <Route path="/" element={<DashboardScreen />} />

                  {/* Profile Route */}
                  <Route path="/profile" element={<ProfileScreen />} />

                  {/* Orders & Users */}
                  <Route
                    path="/admin/orderlist"
                    element={<OrderListScreen />}
                  />
                  <Route path="/admin/userlist" element={<UserListScreen />} />

                  {/* Banners */}
                  <Route
                    path="/admin/banners"
                    element={<BannerManagementScreen />}
                  />
                  <Route
                    path="/admin/add-banner"
                    element={<AddBannerScreen />}
                  />
                  <Route
                    path="/banner/:id/edit"
                    element={<EditHomeSlideScreen />}
                  />

                  {/* Products */}
                  <Route path="/products" element={<ProductListScreen />} />
                  <Route path="/add-product" element={<AddProductScreen />} />
                  <Route
                    path="/product/:id/edit"
                    element={<EditProductScreen />}
                  />
                  <Route path="/product/:id" element={<ViewProductScreen />} />

                  {/* Categories */}
                  <Route path="/categories" element={<CategoryListScreen />} />
                  <Route path="/add-category" element={<AddCategoryScreen />} />
                  <Route
                    path="/category/:id/edit"
                    element={<EditCategoryScreen />}
                  />

                  {/* Sub Categories */}
                  <Route
                    path="/subcategories"
                    element={<SubCategoryListScreen />}
                  />
                  <Route
                    path="/add-subcategory"
                    element={<AddSubCategoryScreen />}
                  />
                  <Route
                    path="/subcategory/:id/edit"
                    element={<EditSubCategoryScreen />}
                  />

                  {/* Settings */}
                  <Route path="/manage-logo" element={<ManageLogoScreen />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
