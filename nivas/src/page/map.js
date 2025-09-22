import React from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom red circle marker using CSS
const redDivIcon = new L.DivIcon({
  html: '<div style="background:red;width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 0 6px rgba(0,0,0,0.5);"></div>',
  className: "", // prevent leaflet default styles
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

export default function MapPage() {
  const location = useLocation();
  const { address, coords } = location.state || {};

  if (!coords) {
    return <p style={{ textAlign: "center" }}>No location data provided</p>;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={coords} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords} icon={redDivIcon}>
          <Popup>
            <b>📍 Reported Location</b> <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
