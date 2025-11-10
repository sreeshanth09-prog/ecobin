import React from "react";
import "./footer.css";
import { FaLeaf } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-root">
      <div className="footer-content">
        <FaLeaf className="footer-icon" />

        <p className="footer-title">EcoBin</p>

        <p className="footer-credit">
          Minor Project by <span className="highlight">Sreeshanth</span>
        </p>

        <p className="footer-copy">© {year} EcoBin — All Rights Reserved</p>
      </div>
    </footer>
  );
}