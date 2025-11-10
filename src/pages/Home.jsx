import React from "react";
import { FaRecycle, FaLeaf, FaTrashAlt, FaSeedling, FaTint } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="page home-page">

      {/* Hero Section */}
      <motion.div
        className="hero-up"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaLeaf className="hero-icon" />
        <h1 className="hero-title-up">Welcome to EcoBin</h1>
        <p className="hero-subtitle-up">
          Reduce waste. Recycle smart. Save the planet — one step at a time.
        </p>
      </motion.div>

      {/* Waste Management Info Section */}
      <section className="wm-section">
        <h2 className="section-title">How to Manage Waste ♻️</h2>

        <div className="wm-grid">
          <motion.div className="wm-card" whileHover={{ scale: 1.05 }}>
            <FaRecycle className="wm-icon" />
            <h3>Recycle Properly</h3>
            <p>Separate plastic, paper, glass, and metal for proper recycling.</p>
          </motion.div>

          <motion.div className="wm-card" whileHover={{ scale: 1.05 }}>
            <FaSeedling className="wm-icon" />
            <h3>Compost Organic Waste</h3>
            <p>Turn food scraps into nutrient-rich compost for plants.</p>
          </motion.div>

          <motion.div className="wm-card" whileHover={{ scale: 1.05 }}>
            <FaTrashAlt className="wm-icon" />
            <h3>Avoid Single-Use Plastics</h3>
            <p>Use reusable bottles, bags, and containers whenever possible.</p>
          </motion.div>

          <motion.div className="wm-card" whileHover={{ scale: 1.05 }}>
            <FaTint className="wm-icon" />
            <h3>Dispose Hazardous Waste</h3>
            <p>Batteries, oils, e-waste must be taken to special collection centers.</p>
          </motion.div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="steps-section">
        <h2 className="section-title">Your Smart Waste Routine 🧭</h2>

        <div className="steps-wrapper">
          {[
            "Sort your waste into Wet & Dry",
            "Check if items can be reused",
            "Recycle plastics, paper & glass",
            "Compost biodegradable waste",
            "Dispose toxic waste safely"
          ].map((step, i) => (
            <motion.div
              key={i}
              className="step-card"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <span className="step-number">{i + 1}</span>
              <p>{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.div
        className="cta-box"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Ready to Scan Your Waste?</h2>
        <p>Use our AI to instantly identify and manage waste efficiently.</p>
        <a href="/scan" className="btn-green cta-btn">Start Scanning</a>
      </motion.div>

    </div>
  );
}