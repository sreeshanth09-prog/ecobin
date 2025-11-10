import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  loadPickups,
  toDateObj
} from "../utils/storage";

import {
  FaCalendarAlt,
  FaClock,
  FaRecycle,
  FaTag,
  FaCheckCircle
} from "react-icons/fa";

import "./report.css";

export default function Report() {
  const [rows, setRows] = useState([]);

  // Load storage once
  useEffect(() => {
    setRows(loadPickups());
  }, []);

  // Split upcoming + history
  const now = new Date();
  const upcoming = [];
  const history = [];

  rows.forEach((p) => {
    const dt = toDateObj(p.date, p.time);
    if (isNaN(dt.getTime())) history.push(p);
    else if (dt >= now) upcoming.push(p);
    else history.push(p);
  });

  // Waste type summary
  const byType = {};
  rows.forEach((p) => {
    byType[p.type] = (byType[p.type] || 0) + 1;
  });

  const cardAnim = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 }
  };

  return (
    <div className="page report-page">
      <h2 className="page-title">Waste Report</h2>

      {/* -------- TOP STATS -------- */}
      <div className="report-grid">
        <motion.div className="card stat-card" {...cardAnim}>
          <FaRecycle className="stat-icon" />
          <div>
            <h4>Total Pickups</h4>
            <div className="stat-value">{rows.length}</div>
          </div>
        </motion.div>

        <motion.div className="card stat-card" {...cardAnim}>
          <FaCalendarAlt className="stat-icon" />
          <div>
            <h4>Upcoming</h4>
            <div className="stat-value">{upcoming.length}</div>
          </div>
        </motion.div>

        <motion.div className="card stat-card" {...cardAnim}>
          <FaCheckCircle className="stat-icon" />
          <div>
            <h4>Completed</h4>
            <div className="stat-value">{history.length}</div>
          </div>
        </motion.div>
      </div>

      {/* -------- WASTE TYPE SUMMARY -------- */}
      <motion.div className="card type-card" {...cardAnim}>
        <h3 className="section-subtitle">Waste Type Summary</h3>

        <div className="type-grid">
          {Object.keys(byType).length === 0 && (
            <p className="empty">No records yet</p>
          )}

          {Object.entries(byType).map(([type, count]) => (
            <div className="type-item" key={type}>
              <FaTag /> {type} — <b>{count}</b>
            </div>
          ))}
        </div>
      </motion.div>

      {/* -------- RECENT PICKUPS -------- */}
      <motion.div className="card list-card" {...cardAnim}>
        <h3 className="section-subtitle">Recent Pickups</h3>

        {rows.length === 0 && <p className="empty">Nothing recorded yet.</p>}

        <div className="timeline-container">
          {rows.slice(0, 10).map((p) => (
            <div className="timeline-card" key={p.id}>
              <div className="timeline-info">
                <h4 className="item-title">{p.name}</h4>

                <div className="meta">
                  <span className="pill">
                    <FaClock /> {p.date} • {p.time}
                  </span>
                  <span className="pill">
                    <FaTag /> {p.type}
                  </span>
                </div>

                {p.notes && <div className="notes">📝 {p.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}