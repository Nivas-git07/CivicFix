import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ setCoords, checkLocationType }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      // 🔍 Validate Location
      const isAllowed = await checkLocationType(lat, lng);

      if (!isAllowed) return;

      setPosition([lat, lng]);
      setCoords({ lat, lng });
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function PinMapModal({ onClose, setCoords, checkLocationType })  {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Select Location</h3>

        <MapContainer
          center={[9.9252, 78.1198]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
         <LocationMarker 
  setCoords={setCoords} 
  checkLocationType={checkLocationType}
/>
        </MapContainer>

        <button style={buttonStyle} onClick={onClose}>
          Confirm Location
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "600px",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "8px 16px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
};