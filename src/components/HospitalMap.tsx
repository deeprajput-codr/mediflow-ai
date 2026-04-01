import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Hospital } from "@/data/hospitals";
import { type CrowdLevel } from "@/data/hospitals";
import { useNavigate } from "react-router-dom";

const crowdColors: Record<CrowdLevel, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
};

interface HospitalMapProps {
  selectedFilter?: string;
  hospitalsData: Hospital[];
  userLocation: { lat: number; lng: number } | null;
}

const HospitalMap = ({ selectedFilter, hospitalsData, userLocation }: HospitalMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();

  // Whenever hospitals data changes, physically adapt the map bounds so the user is never staring at empty land
  useEffect(() => {
    if (mapRef.current && hospitalsData.length > 0) {
      const bounds = L.latLngBounds(hospitalsData.map(h => [h.lat, h.lng]));
      if (bounds.isValid()) {
        mapRef.current.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: true, duration: 1 });
      }
    } else if (mapRef.current && userLocation) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 12);
    }
  }, [hospitalsData, userLocation]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([28.62, 77.21], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      // Create a dedicated layer group for our markers to ensure perfect cleanup
      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    const map = mapRef.current;
    if (!markersLayerRef.current) return;

    // Bulletproof clear of all existing markers using the dedicated layer
    markersLayerRef.current.clearLayers();

    // Add markers securely
    hospitalsData.forEach((hospital) => {
      const isOsm = !hospital.isRegistered;
      const color = isOsm ? "#3b82f6" : crowdColors[hospital.crowdLevel];

      const iconHTML = isOsm ? `
        <div style="
          width: 24px; height: 24px; border-radius: 50%;
          background: ${color};
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          opacity: 0.8;
        "></div>
      ` : `
        <div style="
          width: 32px; height: 32px; border-radius: 50%;
          background: ${color};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M3 21h18M9 8h6M12 2v6M9 21V12h6v9"/>
          </svg>
        </div>
      `;

      const icon = L.divIcon({
        html: iconHTML,
        className: "",
        iconSize: isOsm ? [24, 24] : [32, 32],
        iconAnchor: isOsm ? [12, 12] : [16, 32],
      });

      const marker = L.marker([hospital.lat, hospital.lng], { icon }).addTo(markersLayerRef.current!);

      const crowdBadge = isOsm ? 
         '<span style="color:#666;font-style:italic">Unregistered Data</span>' : 
        (hospital.crowdLevel === "Low"
          ? '<span style="color:#22c55e;font-weight:600">● Low</span>'
          : hospital.crowdLevel === "Medium"
          ? '<span style="color:#f59e0b;font-weight:600">● Medium</span>'
          : '<span style="color:#ef4444;font-weight:600">● High</span>');

      const waitInfo = isOsm ? "" : `<p style="font-size:12px;margin:0 0 8px">Wait: ~${hospital.waitingTime} min</p>`;

      marker.bindPopup(`
        <div style="min-width:200px;font-family:Inter,sans-serif">
          <h3 style="font-weight:700;font-size:14px;margin:0 0 4px">${hospital.name}</h3>
          <p style="font-size:12px;color:#666;margin:0 0 8px">${hospital.address}</p>
          <div style="margin-bottom:6px;font-size:12px">${isOsm ? "" : "Crowd: "}${crowdBadge}</div>
          ${waitInfo}
        </div>
      `);
    });

  }, [hospitalsData]);

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
