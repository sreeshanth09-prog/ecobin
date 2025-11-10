// src/pages/Profile.jsx
import React from "react";
import "./profile.css";
import { FaUserCircle, FaSignOutAlt, FaEnvelope } from "react-icons/fa";

export default function Profile() {
  const user = localStorage.getItem("ecobin_user") || "Guest";

  const logout = () => {
    localStorage.removeItem("ecobin_logged_in");
    localStorage.removeItem("ecobin_user");
    window.location.href = "/login";
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <FaUserCircle className="profile-icon" />

        <h2 className="profile-name">{user}</h2>

        <div className="profile-info">
          <FaEnvelope /> <span>{user}</span>
        </div>

        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}