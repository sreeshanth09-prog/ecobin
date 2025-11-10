// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import WasteScan from "./pages/WasteScan";

function RequireAuth({ children }) {
  const logged = localStorage.getItem("ecobin_logged_in") === "yes";
  return logged ? children : <Navigate to="/login" replace />;
}

// Wrap router so we can detect current path
function AppWrapper() {
  const location = useLocation();
  const hideUI = location.pathname === "/login";

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ecobin_theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("ecobin_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      {!hideUI && <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/schedule" element={<RequireAuth><Schedule /></RequireAuth>} />
        <Route path="/report" element={<RequireAuth><Report /></RequireAuth>} />
        <Route path="/scan" element={<RequireAuth><WasteScan /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideUI && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}