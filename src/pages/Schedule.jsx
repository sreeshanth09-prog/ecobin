import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaTrashAlt, FaRegClock, FaTag } from "react-icons/fa";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";

/* STORAGE KEY — must match Report.jsx */
const LS_KEY = "ecobin_pickups_v2";

/* Default map center (India) */
const DEFAULT_CENTER = [20.5937, 78.9629];

/* Convert local date+time to Date */
function toDateObj(dateStr, timeStr) {
  if (!dateStr) return new Date(NaN);
  try {
    return new Date(`${dateStr}T${timeStr || "00:00"}`);
  } catch {
    return new Date(NaN);
  }
}

/* Map click handler to pick coords */
function MapClick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

/* Color helper for badges/markers */
function badgeColor(type) {
  switch (type) {
    case "Organic":
      return "#27ae60";
    case "Plastic":
      return "#e67e22";
    case "Metal":
      return "#8e44ad";
    case "E-waste":
      return "#c0392b";
    case "Paper":
      return "#2980b9";
    default:
      return "#27ae60";
  }
}

export default function Schedule() {
  /* ---------------- Form state ---------------- */
  const [step, setStep] = useState(1); // 1: name only, 2: full details
  const [form, setForm] = useState({
    name: "",
    type: "Organic",
    date: "",
    time: "",
    coords: null, // [lat, lng]
    notes: "",
  });

  /* ---------------- Map state ---------------- */
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [mapReady, setMapReady] = useState(false);
  const [picked, setPicked] = useState(null);
  const mapRef = useRef(null);

  /* ---------------- Data state ---------------- */
  const [allPickups, setAllPickups] = useState([]);

  /* Load from localStorage once */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setAllPickups(parsed);
    } catch {
      setAllPickups([]);
    }
  }, []);

  /* Persist to localStorage on change */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(allPickups));
    } catch {}
  }, [allPickups]);

  /* Map ready + geolocation */
  useEffect(() => {
    setMapReady(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  /* Split into Upcoming & History (same logic as Report) */
  const { upcoming, history } = useMemo(() => {
    const now = new Date();
    const up = [];
    const hist = [];

    for (const p of allPickups) {
      const dt = toDateObj(p.date, p.time);
      if (!isNaN(dt.getTime()) && dt >= now) up.push(p);
      else hist.push(p);
    }

    up.sort((a, b) => toDateObj(a.date, a.time) - toDateObj(b.date, b.time));
    hist.sort((a, b) => toDateObj(b.date, b.time) - toDateObj(a.date, a.time));
    return { upcoming: up, history: hist };
  }, [allPickups]);

  /* Handlers */
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onPickLocation = (coords) => {
    setPicked(coords);
    setForm((f) => ({ ...f, coords }));
    // smooth fly on select
    if (mapRef.current && mapRef.current.flyTo) {
      mapRef.current.flyTo(coords, 14, { duration: 0.5 });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter a pickup name.");
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    if (!form.date || !form.time) {
      alert("Please select date & time.");
      return;
    }
    if (!form.coords) {
      alert("Please tap the map to set a location.");
      return;
    }

    const newPickup = {
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString(), // Report can use this if needed
    };

    // Save at the top so Report sees it immediately
    setAllPickups((list) => [newPickup, ...list]);

    // Reset back to step 1 (name)
    setForm({
      name: "",
      type: "Organic",
      date: "",
      time: "",
      coords: null,
      notes: "",
    });
    setPicked(null);
    setStep(1);
  };

  const deletePickup = (id) =>
    setAllPickups((list) => list.filter((p) => p.id !== id));

  return (
    <div className="page schedule-page">
      <h2 className="page-title">Schedule Pickup</h2>

      {/* Top: Form + Map */}
      <div className="schedule-grid">
        {/* Form card */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <form className="form" onSubmit={onSubmit}>
            {/* STEP 1 — only name */}
            {step === 1 && (
              <div className="row-grid">
                <input
                  className="form-control"
                  name="name"
                  placeholder="Pickup Name (e.g., Society Block A)"
                  value={form.name}
                  onChange={onChange}
                />
                <button type="submit" className="btn-green">
                  Continue
                </button>
              </div>
            )}

            {/* STEP 2 — full details */}
            {step === 2 && (
              <>
                <label className="input-label">Waste Type</label>
                <select
                  className="form-control"
                  name="type"
                  value={form.type}
                  onChange={onChange}
                >
                  <option>Organic</option>
                  <option>Plastic</option>
                  <option>Metal</option>
                  <option>E-waste</option>
                  <option>Paper</option>
                </select>

                <div className="row-2">
                  <div>
                    <label className="input-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={form.date}
                      onChange={onChange}
                    />
                  </div>
                  <div>
                    <label className="input-label">Time</label>
                    <input
                      type="time"
                      name="time"
                      className="form-control"
                      value={form.time}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <textarea
                  className="form-control"
                  name="notes"
                  placeholder="Notes (optional)"
                  rows={2}
                  value={form.notes}
                  onChange={onChange}
                />

                <p className="hint">
                  <FaMapMarkerAlt style={{ marginRight: 6 }} />
                  Tap on the map to set the pickup location
                </p>

                <div className="row-grid end">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setStep(1);
                      setForm((f) => ({
                        ...f,
                        type: "Organic",
                        date: "",
                        time: "",
                        notes: "",
                      }));
                    }}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-green">
                    Add Pickup
                  </button>
                </div>
              </>
            )}
          </form>
        </motion.div>

        {/* Map card */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <h3 className="section-subtitle">Select Location</h3>

          {mapReady && (
            <MapContainer
              center={picked || center}
              zoom={12}
              whenCreated={(map) => (mapRef.current = map)}
              className="map"
              scrollWheelZoom
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Picked marker */}
              {picked && (
                <CircleMarker
                  center={picked}
                  radius={8}
                  pathOptions={{
                    color: "#27ae60",
                    fillColor: "#27ae60",
                    fillOpacity: 0.9,
                  }}
                >
                  <Popup>New pickup here</Popup>
                </CircleMarker>
              )}

              {/* Existing pickups */}
              {allPickups
                .filter((p) => p.coords)
                .map((p) => (
                  <CircleMarker
                    key={p.id}
                    center={p.coords}
                    radius={6}
                    pathOptions={{
                      color: "transparent",
                      fillColor: badgeColor(p.type),
                      fillOpacity: 0.9,
                    }}
                  >
                    <Popup>
                      <b>{p.name}</b>
                      <br />
                      <FaTag /> {p.type}
                      <br />
                      <FaRegClock /> {p.date} {p.time}
                      {p.notes ? (
                        <>
                          <br />
                          📝 {p.notes}
                        </>
                      ) : null}
                    </Popup>
                  </CircleMarker>
                ))}

              <MapClick onPick={onPickLocation} />
            </MapContainer>
          )}
        </motion.div>
      </div>

      {/* Bottom: Upcoming + History */}
      <div className="schedule-grid bottom">
        {/* Upcoming */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <h3 className="section-subtitle">Upcoming</h3>

          {upcoming.length === 0 ? (
            <p className="empty">No upcoming pickups</p>
          ) : (
            <div className="timeline-container">
              {upcoming.map((p) => (
                <div className="timeline-card" key={p.id}>
                  <div className="timeline-info">
                    <h4 className="item-title">{p.name}</h4>
                    <div className="meta">
                      <span className="pill">
                        <FaRegClock /> {p.date} • {p.time}
                      </span>
                      <span
                        className="pill"
                        style={{
                          color: badgeColor(p.type),
                          borderColor: badgeColor(p.type),
                        }}
                      >
                        <FaTag /> {p.type}
                      </span>
                      {p.coords && (
                        <span className="pill">
                          <FaMapMarkerAlt />{" "}
                          {p.coords[0].toFixed(3)}, {p.coords[1].toFixed(3)}
                        </span>
                      )}
                    </div>
                    {p.notes && <p className="notes">📝 {p.notes}</p>}
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deletePickup(p.id)}
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* History */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <h3 className="section-subtitle">History</h3>

          {history.length === 0 ? (
            <p className="empty">No history yet</p>
          ) : (
            <div className="timeline-container">
              {history.map((p) => (
                <div className="timeline-card faded" key={p.id}>
                  <div className="timeline-info">
                    <h4 className="item-title">{p.name}</h4>
                    <div className="meta">
                      <span className="pill">
                        <FaRegClock /> {p.date} • {p.time}
                      </span>
                      <span
                        className="pill"
                        style={{
                          color: badgeColor(p.type),
                          borderColor: badgeColor(p.type),
                        }}
                      >
                        <FaTag /> {p.type}
                      </span>
                      {p.coords && (
                        <span className="pill">
                          <FaMapMarkerAlt />{" "}
                          {p.coords[0].toFixed(3)}, {p.coords[1].toFixed(3)}
                        </span>
                      )}
                    </div>
                    {p.notes && <p className="notes">📝 {p.notes}</p>}
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deletePickup(p.id)}
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}