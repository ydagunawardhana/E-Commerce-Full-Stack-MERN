import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTh,
  FaImages,
  FaListAlt,
  FaBoxOpen,
  FaUsers,
  FaShoppingBag,
  FaBlog,
  FaLayerGroup,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState("");

  const handleMenuClick = (menuName, path) => {
    if (path) navigate(path);
    setOpenMenu(openMenu === menuName ? "" : menuName);
  };

  const toggleSubMenu = (e, menuName) => {
    e.stopPropagation();
    setOpenMenu(openMenu === menuName ? "" : menuName);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  const dotStyle = { fontSize: "6px", marginRight: "12px", opacity: 0.6 };

  // User Info State
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    window.location.href = "/login";
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <ul className="sidebar-menu">
        {/*  Dashboard */}
        <li>
          <div
            className="dropdown-header"
            onClick={() => handleMenuClick("dashboard", "/")}
          >
            <span className="menu-title">
              <FaTh className="icon" /> Dashboard
            </span>
          </div>
        </li>

        {/* Home Slides (Updated Text & Dots) */}
        <li
          className={`sidebar-dropdown ${
            openMenu === "homeslides" ? "open" : ""
          }`}
        >
          <div
            className="dropdown-header"
            onClick={() => handleMenuClick("homeslides")}
          >
            <span className="menu-title">
              <FaImages className="icon" /> Home Slides
            </span>
            <span onClick={(e) => toggleSubMenu(e, "homeslides")}>
              {openMenu === "homeslides" ? (
                <FaChevronDown className="arrow" />
              ) : (
                <FaChevronRight className="arrow" />
              )}
            </span>
          </div>
          {openMenu === "homeslides" && (
            <ul className="submenu-list">
              <li>
                <Link
                  to="/admin/banners"
                  className={isActive("/admin/banners")}
                >
                  <FaCircle style={dotStyle} /> Home Banners List
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/add-banner"
                  className={isActive("/admin/add-banner")}
                >
                  <FaCircle style={dotStyle} /> Add Home Banner Slide
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Category (Dots) */}
        <li
          className={`sidebar-dropdown ${
            openMenu === "category" ? "open" : ""
          }`}
        >
          <div
            className="dropdown-header"
            onClick={() => handleMenuClick("category")}
          >
            <span className="menu-title">
              <FaListAlt className="icon" /> Category
            </span>
            <span onClick={(e) => toggleSubMenu(e, "category")}>
              {openMenu === "category" ? (
                <FaChevronDown className="arrow" />
              ) : (
                <FaChevronRight className="arrow" />
              )}
            </span>
          </div>
          {openMenu === "category" && (
            <ul className="submenu-list">
              <li>
                <Link to="/categories" className={isActive("/categories")}>
                  <FaCircle style={dotStyle} /> Category List
                </Link>
              </li>
              <li>
                <Link to="/add-category" className={isActive("/add-category")}>
                  <FaCircle style={dotStyle} /> Add A Category
                </Link>
              </li>
              <li>
                <Link
                  to="/subcategories"
                  className={isActive("/subcategories")}
                >
                  <FaCircle style={dotStyle} /> Sub Category List
                </Link>
              </li>
              <li>
                <Link
                  to="/add-subcategory"
                  className={isActive("/add-subcategory")}
                >
                  <FaCircle style={dotStyle} /> Add A Sub Category
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/*  Products */}
        <li
          className={`sidebar-dropdown ${
            openMenu === "products" ? "open" : ""
          }`}
        >
          <div
            className="dropdown-header"
            onClick={() => handleMenuClick("products")}
          >
            <span className="menu-title">
              <FaBoxOpen className="icon" /> Products
            </span>
            <span onClick={(e) => toggleSubMenu(e, "products")}>
              {openMenu === "products" ? (
                <FaChevronDown className="arrow" />
              ) : (
                <FaChevronRight className="arrow" />
              )}
            </span>
          </div>
          {openMenu === "products" && (
            <ul className="submenu-list">
              <li>
                <Link to="/products" className={isActive("/products")}>
                  <FaCircle style={dotStyle} /> Product List
                </Link>
              </li>
              <li>
                <Link to="/add-product" className={isActive("/add-product")}>
                  <FaCircle style={dotStyle} /> Product Upload
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Users */}
        <li>
          <div
            className="dropdown-header"
            onClick={() => handleMenuClick("users", "/admin/userlist")}
          >
            <span className="menu-title">
              <FaUsers className="icon" /> Users
            </span>
          </div>
        </li>

        {/*  Orders */}
        <li>
          <div
            className="dropdown-header"
            onClick={() => handleMenuClick("orders", "/admin/orderlist")}
          >
            <span className="menu-title">
              <FaShoppingBag className="icon" /> Orders
            </span>
          </div>
        </li>

        {/*  Banners */}
        <li>
          <div
            className="dropdown-header"
            onClick={() => handleMenuClick("banners", "/admin/banners")}
          >
            <span className="menu-title">
              <FaImages className="icon" /> Banners
            </span>
          </div>
        </li>

        {/* Manage Logo */}
        <li>
          <div
            className="dropdown-header"
            onClick={() => handleMenuClick("logo", "/manage-logo")}
          >
            <span className="menu-title">
              <FaLayerGroup className="icon" /> Manage Logo
            </span>
          </div>
        </li>

        {/*  Logout */}
        <li>
          <div
            className="dropdown-header"
            onClick={() => handleLogout("/login")}
          >
            <span className="menu-title" style={{ color: "#ef4444" }}>
              <FaSignOutAlt className="icon" /> Logout
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
