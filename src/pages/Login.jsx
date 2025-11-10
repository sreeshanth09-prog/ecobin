import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaLeaf } from "react-icons/fa";
import "./login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");

    localStorage.setItem("ecobin_logged_in", "yes");
    localStorage.setItem("ecobin_user", form.email);

    window.location.href = "/";
  };

  return (
    <div className="login-bg-4">
      {/* Parallax Leaves */}
      <FaLeaf className="leaf4 leaf4-1" />
      <FaLeaf className="leaf4 leaf4-2" />
      <FaLeaf className="leaf4 leaf4-3" />

      <div className="login-box-4">
        <h1 className="login-title-4">EcoBin</h1>
        <p className="login-sub-4">Welcome back 👋</p>

        <form onSubmit={onSubmit} className="login-form-4">

          <div className="input-4">
            <FaUser className="icon-4" />
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Email"
              onChange={onChange}
              required
            />
          </div>

          <div className="input-4">
            <FaLock className="icon-4" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              placeholder="Password"
              onChange={onChange}
              required
            />
            <span
              className="eye-4"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error-4">{error}</p>}

          <button className="btn-login-4">Login</button>
        </form>
      </div>
    </div>
  );
}