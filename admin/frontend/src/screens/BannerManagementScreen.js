import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaImage,
  FaEdit,
  FaImages,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";

const BannerManagementScreen = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [selectedBanners, setSelectedBanners] = useState([]);

  // Fetch Banners
  const fetchBanners = async () => {
    try {
      const { data } = await axios.get("/api/banners");
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Select All
  const handleSelectAll = (e) => {
    if (selectedBanners.length === banners.length) {
      setSelectedBanners([]);
    } else {
      setSelectedBanners(banners.map((banner) => banner._id));
    }
  };

  // Select One
  const handleSelectOne = (id) => {
    if (selectedBanners.includes(id)) {
      setSelectedBanners(selectedBanners.filter((bId) => bId !== id));
    } else {
      setSelectedBanners([...selectedBanners, id]);
    }
  };

  // Delete Selected
  const deleteSelectedHandler = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedBanners.length} banners?`
      )
    ) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        await Promise.all(
          selectedBanners.map((id) =>
            axios.delete(`/api/banners/${id}`, config)
          )
        );

        alert("Selected Banners Deleted Successfully!");
        setSelectedBanners([]);
        fetchBanners();
      } catch (error) {
        alert("Error deleting banners");
      }
    }
  };

  // Delete Single
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        await axios.delete(`/api/banners/${id}`, config);
        fetchBanners();
      } catch (error) {
        alert("Error deleting banner");
      }
    }
  };

  const isAllSelected =
    banners.length > 0 && selectedBanners.length === banners.length;

  const API_URL = process.env.REACT_APP_API_URL;

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
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header Area */}
        <div
          style={{
            background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
            padding: "30px 40px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FaImages /> Home Banners
            </h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
              Manage the sliding banners on your home page.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {/* Delete Selected Button */}
            {selectedBanners.length > 0 && (
              <button
                onClick={deleteSelectedHandler}
                style={{
                  ...headerBtnStyle,
                  background: "#ef4444",
                  border: "1px solid #ef4444",
                  color: "white",
                }}
              >
                <FaTrash /> Delete ({selectedBanners.length})
              </button>
            )}
            <button
              onClick={() => navigate("/admin/add-banner")}
              style={{
                ...headerBtnStyle,
                background: "white",
                color: "#4361ee",
              }}
            >
              <FaPlus /> Add New Slide
            </button>
          </div>
        </div>

        {/* Master Checkbox Bar */}
        <div
          style={{
            padding: "20px 40px",
            borderBottom: "1px solid #f1f5f9",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            onClick={handleSelectAll}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600",
              color: "#334155",
              fontSize: "14px",
            }}
          >
            {isAllSelected ? (
              <FaCheckSquare size={20} color="#4361ee" />
            ) : (
              <FaSquare size={20} color="#cbd5e1" />
            )}
            <span>Select All Banners ({banners.length})</span>
          </div>
        </div>

        {/* Table Section */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "800px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#fff",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th style={{ ...thStyle, width: "50px" }}></th>
                <th style={thStyle}>BANNER PREVIEW</th>
                <th style={thStyle}>IMAGE URL</th>
                <th style={thStyle}>CREATED DATE</th>
                <th style={{ ...thStyle, textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <tr
                    key={banner._id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background: selectedBanners.includes(banner._id)
                        ? "#eff6ff"
                        : "white",
                      transition: "background 0.2s",
                    }}
                  >
                    {/* Checkbox */}
                    <td style={tdStyle}>
                      <div
                        onClick={() => handleSelectOne(banner._id)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {selectedBanners.includes(banner._id) ? (
                          <FaCheckSquare size={18} color="#4361ee" />
                        ) : (
                          <FaSquare size={18} color="#cbd5e1" />
                        )}
                      </div>
                    </td>

                    {/* Preview Image */}
                   <td style={tdStyle}>
  <div style={imgContainerStyle}>
    <img
      src={
        banner.image.startsWith("/")
          ? `${API_URL}${banner.image}` 
          : banner.image
      }
      alt="Banner"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </div>
</td>

                    {/* URL */}
                    <td
                      style={{
                        ...tdStyle,
                        fontSize: "13px",
                        color: "#64748b",
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {banner.image}
                    </td>

                    {/* Date */}
                    <td style={tdStyle}>
                      <span style={badgeStyle}>
                        {new Date(banner.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => navigate(`/banner/${banner._id}/edit`)}
                          style={{
                            ...actionBtn,
                            color: "#6366f1",
                            background: "#eef2ff",
                          }}
                          title="Edit Slide"
                        >
                          <FaEdit size={16} />
                        </button>

                        <button
                          onClick={() => deleteHandler(banner._id)}
                          style={{
                            ...actionBtn,
                            color: "#ef4444",
                            background: "#fef2f2",
                          }}
                          title="Delete Slide"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "60px",
                      color: "#94a3b8",
                    }}
                  >
                    <FaImage
                      size={40}
                      style={{ marginBottom: "15px", opacity: 0.2 }}
                    />
                    <br />
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>
                      No banners found. Add your first slide!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

//  STYLES
const headerBtnStyle = {
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const thStyle = {
  padding: "18px 25px",
  fontSize: "11px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  textAlign: "left",
};

const tdStyle = {
  padding: "18px 25px",
  verticalAlign: "middle",
  color: "#334155",
  fontSize: "14px",
};

const imgContainerStyle = {
  width: "160px",
  height: "70px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const badgeStyle = {
  background: "#f1f5f9",
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#475569",
  border: "1px solid #e2e8f0",
};

const actionBtn = {
  border: "none",
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.2s",
};

export default BannerManagementScreen;
