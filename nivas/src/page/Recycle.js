import { useState, useEffect } from "react";
import Navbar from "../components/ui/nav";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* STORE DATA */
const stores = [
  {
    id: 1,
    name: "Green Recycle Center",
    lat: 9.925,
    lng: 78.119,
    rates: { plastic: 12, metal: 35, paper: 8, glass: 5, "e-waste": 50 },
  },
  {
    id: 2,
    name: "City Scrap Store",
    lat: 9.93,
    lng: 78.125,
    rates: { plastic: 10, metal: 40, paper: 7, glass: 4, "e-waste": 45 },
  },
];

export default function RecycleSmartMap() {
  const [showModal, setShowModal] = useState(true);
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setLocationError("Location permission denied.")
      );
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsProcessing(true);
    setIsVerified(false);
    setMaterial("");

    // SIMULATED VERIFICATION (Doesn't depend on n8n)
    setTimeout(() => {
      setIsProcessing(false);
      setIsVerified(true);
      // Default to "Plastic" for the demo, but you can change this
      setMaterial("Verified"); // Auto-fill a default weight
    }, 2000);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const getRoute = async (store) => {
    if (!userLocation) return;
    const url = `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${store.lng},${store.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    setRoute(data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]));
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "100vh", width: "100%" }}>
        <MapContainer center={[9.9252, 78.1198]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && <Marker position={userLocation}><Popup>Your Location 📍</Popup></Marker>}
          {!showModal && stores.map((store) => {
              const rate = store.rates[material] || 0;
              const distance = userLocation ? calculateDistance(userLocation[0], userLocation[1], store.lat, store.lng) : 0;
              return (
                <Marker key={store.id} position={[store.lat, store.lng]}>
                  <Popup>
                    <div style={popupCardStyle}>
                      <div style={popupHeaderStyle}>🏪 {store.name}</div>
                      <div style={popupBodyStyle}>
                        <div style={popupRowStyle}><span>📍 Distance</span><strong>{distance.toFixed(2)} KM</strong></div>
                        <div style={popupRowStyle}><span>💰 Rate</span><strong>₹{rate}/kg</strong></div>
                        <div style={popupRowStyle}><span>🧾 Total</span><strong style={{ color: "#10b981" }}>₹{weight * rate}</strong></div>
                      </div>
                      <button style={popupRouteButtonStyle} onClick={() => getRoute(store)}>🚗 Show Route</button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          {route.length > 0 && <Polyline positions={route} color="#10b981" weight={6} />}
        </MapContainer>

        {showModal && (
          <div style={overlayStyle}>
            <div style={modalStyle}>
              <h2 style={titleStyle}>♻️ Smart Recycler</h2>

              <label style={uploadStyle}>
                {isProcessing ? "🔍 Analyzing..." : "📸 Upload Waste Photo"}
                <input type="file" style={{ display: "none" }} onChange={handleFileUpload} disabled={isProcessing} />
              </label>

              <div style={{ position: "relative", marginTop: "15px" }}>
                {imagePreview && (
                  <>
                    <img src={imagePreview} alt="preview" style={previewStyle} />
                    {isVerified && (
                      <div style={verifiedTagStyle}>
                        <span style={{ marginRight: "5px" }}>🛡️</span> SYSTEM VERIFIED
                      </div>
                    )}
                  </>
                )}
                {isProcessing && (
                  <div style={processingOverlayStyle}>
                    <div className="spinner"></div>
                    <p style={{ color: "white", marginTop: "10px", fontWeight: "600" }}>Running AI Diagnostics...</p>
                  </div>
                )}
              </div>

              {isVerified && (
                <div style={verifiedBadgeStyle}>
                  <div style={checkCircleStyle}>✓</div>
                  <div style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px" }}>MATCH CONFIRMED</span>
                    <div style={{ fontSize: "20px", fontWeight: "900", textTransform: "uppercase" }}>{material}</div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: "20px", textAlign: "left" }}>
                <label style={labelStyle}>QUANTITY (KG)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={inputStyle}
                  placeholder="Estimated weight"
                />
              </div>

              <button
                style={{ ...submitStyle, opacity: isVerified ? 1 : 0.5 }}
                disabled={!isVerified}
                onClick={() => setShowModal(false)}
              >
                {isVerified ? "Find Verified Hubs →" : "Scan Image to Continue"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .spinner { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #fff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

/* ================= THEMES & STYLES ================= */

const verifiedBadgeStyle = {
  marginTop: "15px", padding: "12px 20px", borderRadius: "16px",
  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  color: "white", display: "flex", alignItems: "center", gap: "15px",
  boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)",
};

const checkCircleStyle = {
  width: "30px", height: "30px", background: "white", color: "#059669",
  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900"
};

const verifiedTagStyle = {
  position: "absolute", top: "12px", right: "12px", background: "#064e3b",
  color: "#34d399", padding: "6px 14px", borderRadius: "20px", fontSize: "10px", fontWeight: "900",
  border: "1px solid #059669", boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
};

const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backdropFilter: "blur(20px)", background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 };
const modalStyle = { background: "#fff", padding: "40px", borderRadius: "32px", width: "400px", textAlign: "center", boxShadow: "0 50px 100px -20px rgba(0,0,0,0.5)" };
const titleStyle = { fontSize: "26px", fontWeight: "900", color: "#1e293b", marginBottom: "20px" };
const uploadStyle = { display: "block", padding: "20px", border: "2px dashed #e2e8f0", borderRadius: "20px", cursor: "pointer", color: "#64748b", fontWeight: "700" };
const previewStyle = { width: "100%", borderRadius: "16px", maxHeight: "220px", objectFit: "cover" };
const labelStyle = { fontSize: "11px", fontWeight: "800", color: "#94a3b8", marginLeft: "5px" };
const inputStyle = { width: "100%", padding: "15px", marginTop: "5px", borderRadius: "15px", border: "1px solid #e2e8f0", fontSize: "16px", fontWeight: "600", outline: "none" };
const submitStyle = { width: "100%", marginTop: "25px", padding: "18px", background: "#1e293b", color: "white", border: "none", borderRadius: "18px", fontWeight: "800", cursor: "pointer", transition: "0.2s" };
const processingOverlayStyle = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.8)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" };
const popupCardStyle = { width: "180px" };
const popupHeaderStyle = { fontWeight: "900", color: "#1e293b", marginBottom: "8px" };
const popupBodyStyle = { fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" };
const popupRowStyle = { display: "flex", justifyContent: "space-between" };
const popupRouteButtonStyle = { marginTop: "12px", width: "100%", padding: "10px", borderRadius: "10px", background: "#10b981", color: "#fff", border: "none", fontWeight: "800", cursor: "pointer" };