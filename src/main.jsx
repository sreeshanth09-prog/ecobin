import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles.css";   // your global stylesheet (optional)
import "./pages/login.css";
import "./pages/schedule.css";
import "./pages/report.css";
import "./pages/scan.css";
import "./pages/profile.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);