import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

/* ===========================
    SIMULATED AREA DATA
=========================== */
const areas = [
  {
    name: "Avaniyapuram",
    level: "high",
    center: [9.9252, 78.1198],
    reports: 1847,
    breakdown: { garbage: 58, pothole: 24, drainage: 18 },
    status: { pending: 615, inProgress: 832, completed: 400 }
  },
  {
    name: "Villapuram",
    level: "moderate",
    center: [9.93, 78.125],
    reports: 650,
    breakdown: { garbage: 40, pothole: 35, drainage: 25 },
    status: { pending: 200, inProgress: 250, completed: 200 }
  },
  {
    name: "Periyar Bus Stand",
    level: "low",
    center: [9.92, 78.11],
    reports: 120,
    breakdown: { garbage: 30, pothole: 40, drainage: 30 },
    status: { pending: 40, inProgress: 30, completed: 50 }
  }
];

/* ===========================
    HEATMAP LAYER (Refined Gradient)
=========================== */
function HeatLayer({ data }) {
  const map = useMap();

  useEffect(() => {
    const heatData = data.map((area) => {
      // Adjusted intensities for realistic "glow"
      let intensity = 0.4;
      if (area.level === "high") intensity = 1.0;
      if (area.level === "moderate") intensity = 0.6;
      if (area.level === "low") intensity = 0.3;

      return [area.center[0], area.center[1], intensity];
    });

    const heat = L.heatLayer(heatData, {
      radius: 80,
      blur: 45, // More "real world" density
      maxZoom: 15,
      // Refined palette: Deep Emerald -> Golden Amber -> Vibrant Red -> Crimson
      gradient: {
        0.1: "#10b981", // Emerald Green
        0.4: "#f59e0b", // Amber
        0.7: "#ef4444", // Red
        1.0: "#991b1b"  // Dark Crimson
      }
    });

    heat.addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, data]);

  return null;
}

/* ===========================
    MAIN COMPONENT (Modernized UI)
=========================== */
export default function CivicTransparencyMap() {
  return (
    <MapContainer
      center={[9.9252, 78.1198]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <HeatLayer data={areas} />

      {areas.map((area, index) => (
        <Circle
          key={index}
          center={area.center}
          radius={600}
          pathOptions={{
            // Matches the HeatLayer colors for a unified look
            color: area.level === "high" ? "#ef4444" : area.level === "moderate" ? "#f59e0b" : "#10b981",
            fillOpacity: 0.1,
            weight: 1
          }}
        >
          <Popup>
            <div style={{ 
              fontFamily: "'Inter', sans-serif", 
              minWidth: "260px",
              padding: "5px"
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#111827" }}>{area.name}</h3>
                <span style={{ 
                  fontSize: "10px", 
                  fontWeight: "bold", 
                  padding: "2px 8px", 
                  borderRadius: "12px", 
                  background: area.level === "high" ? "#fee2e2" : area.level === "moderate" ? "#fef3c7" : "#dcfce7",
                  color: area.level === "high" ? "#b91c1c" : area.level === "moderate" ? "#92400e" : "#166534"
                }}>
                  {area.level.toUpperCase()}
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold", display: "block" }}>TOTAL REPORTS</span>
                <span style={{ fontSize: "24px", fontWeight: "900", color: "#111827" }}>{area.reports.toLocaleString()}</span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "bold", color: "#374151" }}>COMPLAINT DISTRIBUTION</p>
                <div style={{ display: "flex", height: "8px", borderRadius: "4px", overflow: "hidden", background: "#f3f4f6" }}>
                  <div style={{ width: `${area.breakdown.garbage}%`, background: "#3b82f6" }} />
                  <div style={{ width: `${area.breakdown.pothole}%`, background: "#f97316" }} />
                  <div style={{ width: `${area.breakdown.drainage}%`, background: "#8b5cf6" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginTop: "5px", color: "#6b7280" }}>
                  <span>Garbage {area.breakdown.garbage}%</span>
                  <span>Potholes {area.breakdown.pothole}%</span>
                </div>
              </div>

              <div style={{ background: "#f9fafb", padding: "10px", borderRadius: "8px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "bold", color: "#374151" }}>RESOLUTION STATUS</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", textAlign: "center" }}>
                  <div>
                    <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: "bold" }}>PENDING</span>
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>{area.status.pending}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", color: "#f59e0b", fontWeight: "bold" }}>ACTIVE</span>
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>{area.status.inProgress}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "bold" }}>SOLVED</span>
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>{area.status.completed}</div>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}