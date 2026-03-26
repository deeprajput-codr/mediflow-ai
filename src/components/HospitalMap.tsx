import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { hospitals, type CrowdLevel } from "@/data/hospitals";
import CrowdBadge from "./CrowdBadge";
import { Link } from "react-router-dom";

const crowdColors: Record<CrowdLevel, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
};

const createMarkerIcon = (crowdLevel: CrowdLevel) => {
  return new DivIcon({
    html: `<div style="
      width: 32px; height: 32px; border-radius: 50%;
      background: ${crowdColors[crowdLevel]};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
        <path d="M3 21h18M9 8h6M12 2v6M9 21V12h6v9"/>
      </svg>
    </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const HospitalMap = ({ selectedFilter }: { selectedFilter?: string }) => {
  const filtered = selectedFilter && selectedFilter !== "All"
    ? hospitals.filter((h) => h.type === selectedFilter)
    : hospitals;

  return (
    <MapContainer
      center={[28.6200, 77.2100]}
      zoom={13}
      className="w-full h-full rounded-xl z-0"
      style={{ minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filtered.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.lat, hospital.lng]}
          icon={createMarkerIcon(hospital.crowdLevel)}
        >
          <Popup>
            <div className="p-1 min-w-[200px]">
              <h3 className="font-bold text-sm mb-1">{hospital.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{hospital.address}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs">Crowd:</span>
                <CrowdBadge level={hospital.crowdLevel} />
              </div>
              <p className="text-xs mb-2">Wait: ~{hospital.waitingTime} min</p>
              <Link
                to={`/hospital/${hospital.id}`}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default HospitalMap;
