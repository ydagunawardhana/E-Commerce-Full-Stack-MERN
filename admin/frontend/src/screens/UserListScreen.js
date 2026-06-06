import React, { useEffect, useState } from "react";
import axios from "axios";

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;

        if (!userInfo || !userInfo.token) {
          setErrorMsg("No User Token found. Please Login again.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const API_URL = process.env.REACT_APP_API_URL; 

        const { data } = await axios.get(
          `${API_URL}/api/users`,
          config
        );

        console.log("API Response Data:", data);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMsg(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container" style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>
        User Management
      </h2>

      {/* Error Message Box */}
      {errorMsg && (
        <div
          style={{
            padding: "10px",
            background: "#ffebee",
            color: "red",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid red",
          }}
        >
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      <div className="table-container" style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead style={{ backgroundColor: "#007bff", color: "white" }}>
            <tr>
              <th style={{ padding: "15px", textAlign: "left" }}>User Info</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Loading Users...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={
                          user.avatar ||
                          user.image ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="user"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid #ddd",
                        }}
                      />
                      <span style={{ fontWeight: "500" }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <a
                      href={`mailto:${user.email}`}
                      style={{ color: "#3498db", textDecoration: "none" }}
                    >
                      {user.email}
                    </a>
                  </td>
                  <td style={{ padding: "15px" }}>
                    {user.role === "ADMIN" || user.isAdmin === true ? (
                      <span
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                        }}
                      >
                        Admin
                      </span>
                    ) : (
                      <span
                        style={{
                          backgroundColor: "#ffc107",
                          color: "black",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                        }}
                      >
                        User
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#777",
                  }}
                >
                  No users found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListScreen;
