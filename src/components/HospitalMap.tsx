import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { hospitals, type CrowdLevel } from "@/data/hospitals";
import { useNavigate } from "react-router-dom";

const crowdColors: Record<CrowdLevel, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
};

const HospitalMap = ({ selectedFilter }: { selectedFilter?: string }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filtered =
    selectedFilter && selectedFilter !== "All"
      ? hospitals.filter((h) => h.type === selectedFilter)
      : hospitals;

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([28.62, 77.21], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers
    filtered.forEach((hospital) => {
      const color = crowdColors[hospital.crowdLevel];

      const icon = L.divIcon({
        html: `<div style="
          width: 32px; height: 32px; border-radius: 50%;
          background: ${color};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M3 21h18M9 8h6M12 2v6M9 21V12h6v9"/>
          </svg>
        </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([hospital.lat, hospital.lng], { icon }).addTo(map);

      const crowdBadge =
        hospital.crowdLevel === "Low"
          ? '<span style="color:#22c55e;font-weight:600">● Low</span>'
          : hospital.crowdLevel === "Medium"
          ? '<span style="color:#f59e0b;font-weight:600">● Medium</span>'
          : '<span style="color:#ef4444;font-weight:600">● High</span>';

      marker.bindPopup(`
        <div style="min-width:200px;font-family:Inter,sans-serif">
          <h3 style="font-weight:700;font-size:14px;margin:0 0 4px">${hospital.name}</h3>
          <p style="font-size:12px;color:#666;margin:0 0 8px">${hospital.address}</p>
          <div style="margin-bottom:6px;font-size:12px">Crowd: ${crowdBadge}</div>
          <p style="font-size:12px;margin:0 0 8px">Wait: ~${hospital.waitingTime} min</p>
          <a href="/hospital/${hospital.id}" style="font-size:12px;font-weight:600;color:#2563eb;text-decoration:none">View Details →</a>
        </div>
      `);
    });

    return () => {};
  }, [filtered]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl z-0"
      style={{ minHeight: "400px" }}
    />
  );
};

export default HospitalMap;
