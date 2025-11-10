// src/utils/storage.js

const STORAGE_KEY = "ecobin_pickups_v2";

// ---- LOAD ALL PICKUPS ----
export function loadPickups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = JSON.parse(raw) || [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// ---- SAVE ALL PICKUPS ----
export function savePickups(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save", err);
  }
}

// ---- ADD ONE PICKUP ----
export function addPickup(item) {
  const list = loadPickups();
  list.unshift(item);
  savePickups(list);
}

// ---- DELETE PICKUP ----
export function deletePickupById(id) {
  const list = loadPickups().filter((p) => p.id !== id);
  savePickups(list);
}

// ---- HELPERS ----
export function toDateObj(dateStr, timeStr) {
  if (!dateStr) return new Date(NaN);
  return new Date(`${dateStr}T${timeStr || "00:00"}`);
}