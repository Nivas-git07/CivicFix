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
    name: "avaniyapuram",
    level: "high",
    center: [9.9252, 78.1198],
    reports: 1847,
    breakdown: {
      garbage: 58,
      pothole: 24,
      drainage: 18
    },
    status: {
      pending: 615,
      inProgress: 832,
      completed: 400
    }
  },
  {
    name: "villapuram",
    level: "moderate",
    center: [9.93, 78.125],
    reports: 650,
    breakdown: {
      garbage: 40,
      pothole: 35,
      drainage: 25
    },
    status: {
      pending: 200,
      inProgress: 250,
      completed: 200
    }
  },
  {
    name: "periyar bus stand",
    level: "low",
    center: [9.92, 78.11],
    reports: 120,
    breakdown: {
      garbage: 30,
      pothole: 40,
      drainage: 30
    },
    status: {
      pending: 40,
      inProgress: 30,
      completed: 50
    }
  }
];

/* ===========================
   HEATMAP LAYER
=========================== */

function HeatLayer({ data }) {
  const map = useMap();

  useEffect(() => {
    const heatData = data.map((area) => {
      let intensity = 0.3;
      if (area.level === "high") intensity = 1.2;
      if (area.level === "moderate") intensity = 0.7;
      if (area.level === "low") intensity = 0.4;

      return [area.center[0], area.center[1], intensity];
    });

    const heat = L.heatLayer(heatData, {
      radius: 90,     // 🔥 LARGE AREA
      blur: 70,       // 🔥 Smooth blending
      maxZoom: 17,
      gradient: {
        0.2: "#22c55e",   // Green
        0.4: "#eab308",   // Yellow
        0.7: "#ef4444",   // Red
        1.0: "#b91c1c"
      }
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
}

/* ===========================
   MAIN COMPONENT
=========================== */

export default function CivicTransparencyMap() {
  return (
    <MapContainer
      center={[9.9252, 78.1198]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Heat Layer */}
      <HeatLayer data={areas} />

      {/* Clickable Large Areas */}
      {areas.map((area, index) => (
        <Circle
          key={index}
          center={area.center}
          radius={600}   // 🔥 LARGE CLICK ZONE
          pathOptions={{
            color:
              area.level === "high"
                ? "#ef4444"
                : area.level === "moderate"
                ? "#eab308"
                : "#22c55e",
            fillOpacity: 0.15
          }}
        >
          <Popup>
            <div style={{ fontFamily: "system-ui", minWidth: "240px" }}>
              <h3 style={{ marginBottom: "8px" }}>
                {area.name} ({area.level.toUpperCase()})
              </h3>

              <p><strong>Total Reports:</strong> {area.reports}</p>

              <hr />

              <p><strong>Complaint Type:</strong></p>
              <ul style={{ paddingLeft: "18px", fontSize: "14px" }}>
                <li>Garbage: {area.breakdown.garbage}%</li>
                <li>Pothole: {area.breakdown.pothole}%</li>
                <li>Drainage: {area.breakdown.drainage}%</li>
              </ul>

              <hr />

              <p><strong>Status:</strong></p>
              <ul style={{ paddingLeft: "18px", fontSize: "14px" }}>
                <li>Pending: {area.status.pending}</li>
                <li>In Progress: {area.status.inProgress}</li>
                <li>Completed: {area.status.completed}</li>
              </ul>
            </div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}