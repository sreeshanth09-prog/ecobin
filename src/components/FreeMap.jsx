import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Fix Vite/Webpack marker icon path issue (uses CDN)
const LeafletIconFix = () => {
  const iconUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png";
  const iconRetinaUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png";
  const shadowUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";
  L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });
};
LeafletIconFix();

export default function FreeMap({ form, setForm, latLng, setLatLng }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const providerRef = useRef(new OpenStreetMapProvider());

  useEffect(() => {
    // Create map once
    if (!mapRef.current) {
      mapRef.current = L.map("ecobin-map", {
        center: [latLng.lat, latLng.lng],
        zoom: 14,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(mapRef.current);

      markerRef.current = L.marker([latLng.lat, latLng.lng], {
        draggable: true,
      }).addTo(mapRef.current);

      // Drag marker -> update state + reverse geocode
      markerRef.current.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();
        setLatLng({ lat, lng });
        reverseGeocode(lat, lng);
      });

      // Click map -> move marker
      mapRef.current.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setLatLng({ lat, lng });
        markerRef.current.setLatLng([lat, lng]);
        reverseGeocode(lat, lng);
      });
    } else {
      // Keep marker & view in sync if latLng changes externally
      mapRef.current.setView([latLng.lat, latLng.lng]);
      markerRef.current.setLatLng([latLng.lat, latLng.lng]);
    }

    return () => {
      // Cleanup if component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latLng, setLatLng]);

  // Reverse geocode (FREE)
  async function reverseGeocode(lat, lng) {
    try {
      const url =
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          // polite header — Nominatim likes having a contact
          "User-Agent": "EcoBin-App (learning project)",
          "Referer": window.location.origin,
        },
      });
      const data = await res.json();
      if (data?.display_name) {
        setForm((f) => ({ ...f, address: data.display_name, lat, lng }));
      } else {
        setForm((f) => ({ ...f, lat, lng }));
      }
    } catch (_) {
      setForm((f) => ({ ...f, lat, lng }));
    }
  }

  // Forward geocode (search) — call from parent
  FreeMap.search = async (query, cb) => {
    if (!query?.trim()) return;
    const results = await providerRef.current.search({ query });
    if (results?.length) {
      const { x: lng, y: lat, label } = results[0];
      cb({ lat, lng, label });
    }
  };

  return <div id="ecobin-map" className="leaflet-container" />;
}