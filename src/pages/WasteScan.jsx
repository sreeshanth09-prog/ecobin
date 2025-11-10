import React, { useState, useRef, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import { motion } from "framer-motion";
import "./scan.css";

export default function WasteScan() {

  // AUTO-DETECT correct base path (localhost / deploy)
  const MODEL_URL = import.meta.env.BASE_URL + "tm-model/";

  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

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
        console.error("Model load failed:", err);
        alert("Model load failed");
      }
    }

    loadModel();
  }, []);


  // ---------------------------
  // START CAMERA
  // ---------------------------
  const startCamera = async () => {
  if (!model) return alert("Model not ready yet.");

  // Detect mobile device
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Camera constraints
  const constraints = {
    audio: false,
    video: isMobile
      ? { facingMode: { ideal: "environment" } } // Mobile → Rear
      : { facingMode: "user" }                   // Desktop → Front
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const webcam = new tmImage.Webcam(350, 350, false);
    webcamRef.current = webcam;

    // Setup webcam with same rule
    await webcam.setup({
      facingMode: isMobile ? "environment" : "user"
    });
    await webcam.play();

    videoRef.current = webcam.webcam;
    setCameraOn(true);
    loop();

  } catch (err) {
    console.warn("Primary camera load failed:", err);

    // Fallback for mobile
    if (isMobile) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter((d) => d.kind === "videoinput");

        // Pick rear camera (usually index 1)
        const rearCam = cams[1];

        if (!rearCam) {
          alert("Rear camera not available.");
          return;
        }

        const fallbackConstraints = {
          video: { deviceId: { exact: rearCam.deviceId } }
        };

        const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);

        const webcam = new tmImage.Webcam(350, 350, false);
        webcamRef.current = webcam;

        await webcam.setup({ deviceId: rearCam.deviceId });
        await webcam.play();

        videoRef.current = webcam.webcam;
        setCameraOn(true);
        loop();
      } catch (fallbackErr) {
        console.error("Fallback failed:", fallbackErr);
        alert("Unable to access rear camera.");
      }
    } else {
      alert("Camera access failed on desktop.");
    }
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="scan-title">AI Waste Scanner ♻️</h2>

        {loading ? (
          <p className="loading-text">Loading AI model...</p>
        ) : (
          <>
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
          </>
        )}
      </motion.div>
    </div>
  );
}
