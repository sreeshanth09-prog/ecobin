import React, { useState, useRef, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import { motion } from "framer-motion";
import "./scan.css";

export default function WasteScan() {

  // AUTO-DETECT correct asset path
  const MODEL_URL = import.meta.env.BASE_URL + "tm-model/";

  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraMode, setCameraMode] = useState("auto");

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // ---------------------------
  // LOAD MODEL
  // ---------------------------
  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await tmImage.load(
          MODEL_URL + "model.json",
          MODEL_URL + "metadata.json"
        );
        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        console.error("Model load failed", err);
        alert("Model load failed");
      }
    }
    loadModel();
  }, []);

  // ---------------------------
  // CAMERA CONSTRAINT SELECTOR
  // ---------------------------
  function getConstraints() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (cameraMode === "auto") {
      return {
        facingMode: isMobile ? { ideal: "environment" } : "user",
      };
    }
    if (cameraMode === "user") {
      return { facingMode: "user" };
    }
    if (cameraMode === "environment") {
      return { facingMode: { ideal: "environment" } };
    }
    return { facingMode: "user" };
  }

  // ---------------------------
  // START CAMERA
  // ---------------------------
  const startCamera = async () => {
    if (!model) return alert("Model not ready yet.");

    try {
      const constraints = getConstraints();

      const webcam = new tmImage.Webcam(350, 350, false);
      webcamRef.current = webcam;

      // ⛔ WRONG: await webcam.setup({ video: constraints });
      // ✔ RIGHT:
      await webcam.setup({ facingMode: constraints.facingMode });

      await webcam.play();
      setCameraOn(true);

      loop();
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access failed.");
    }
  };

  // ---------------------------
  // STOP CAMERA
  // ---------------------------
  const stopCamera = () => {
    if (webcamRef.current) {
      webcamRef.current.stop();
    }
    setCameraOn(false);
    setLevels(null);
  };

  // ---------------------------
  // PREDICTION LOOP
  // ---------------------------
  const loop = async () => {
    if (!webcamRef.current) return;

    webcamRef.current.update();

    if (canvasRef.current) {
      webcamRef.current.canvas = canvasRef.current;
      const predictions = await model.predict(canvasRef.current);

      const levelsObject = {};
      predictions.forEach((p) => {
        levelsObject[p.className] = Math.round(p.probability * 100);
      });

      setLevels(levelsObject);
    }

    requestAnimationFrame(loop);
  };

  return (
    <div className="scan-page">
      <motion.div
        className="scan-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="scan-title">AI Waste Scanner ♻️</h2>

        {/* Camera Mode Selector */}
        <div className="camera-select">
          <label>Camera Mode</label>
          <select
            value={cameraMode}
            onChange={(e) => setCameraMode(e.target.value)}
          >
            <option value="auto">Auto</option>
            <option value="user">Front Camera</option>
            <option value="environment">Rear Camera</option>
          </select>
        </div>

        {/* CAMERA + START/STOP */}
        <div className="camera-box">
          {!cameraOn ? (
            <button className="start-btn" onClick={startCamera}>
              Start Scan
            </button>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                className="scan-view"
                width="350"
                height="350"
              />
              <button className="stop-btn" onClick={stopCamera}>
                Stop
              </button>
            </>
          )}
        </div>

        {/* AI LEVEL RESULTS */}
        {levels && (
          <div className="levels-box">
            <h3>Waste Detection Levels</h3>
            {Object.entries(levels).map(([label, value]) => (
              <div className="level-row" key={label}>
                <span className="level-label">{label}</span>
                <div className="level-bar">
                  <div
                    className="level-fill"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span className="level-num">{value}%</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
