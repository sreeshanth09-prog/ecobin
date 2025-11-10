// src/components/NavBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaHome,
  FaCalendarAlt,
  FaChartPie,
  FaCamera,
  FaUser
} from "react-icons/fa";

import "./navbar.css";

export default function NavBar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const active = (path) => (location.pathname === path ? "nav-active" : "");

  return (
    <nav className="nav-root">

      {/* LOGO */}
      <Link to="/" className="nav-logo">EcoBin</Link>

      {/* CENTER LINKS */}
      <div className="nav-center">
        <Link className={`nav-link ${active("/")}`} to="/">
          <FaHome /> Home
        </Link>
        <Link className={`nav-link ${active("/schedule")}`} to="/schedule">
          <FaCalendarAlt /> Schedule
        </Link>
        <Link className={`nav-link ${active("/report")}`} to="/report">
          <FaChartPie /> Report
        </Link>
        <Link className={`nav-link ${active("/scan")}`} to="/scan">
          <FaCamera /> Scan
        </Link>
      </div>

      {/* RIGHT ICONS */}
      <div className="nav-right">
        <button className="theme-btn" onClick={() => setDarkMode((m) => !m)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* PROFILE SHOULD NAVIGATE TO LOGIN */}
        <Link to="/login" className="profile-btn">
          <FaUser />
        </Link>
      </div>

    </nav>
  );
}