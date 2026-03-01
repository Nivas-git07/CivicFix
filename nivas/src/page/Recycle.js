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
    rates: { plastic: 15, metal: 40, paper: 7, glass: 4, "e-waste": 45 },
  },
];

export default function RecycleSmartMap() {
  const [showModal, setShowModal] = useState(true);
  const [material, setMaterial] = useState("plastic"); 
  const [weight, setWeight] = useState("1.0"); 
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => console.log("Location denied")
      );
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsProcessing(true);
    setIsVerified(false);

    // SIMULATED AI 
    setTimeout(() => {
      setIsProcessing(false);
      setIsVerified(true);
    
      setMaterial("plastic"); 
    
    }, 1500);
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
          
          {userLocation && <Marker position={userLocation}><Popup>You are here 📍</Popup></Marker>}
          
          {!showModal && stores.map((store) => {
             
              const currentRate = store.rates[material] || 0;
              const total = (parseFloat(weight) || 0) * currentRate;
              const dist = userLocation ? calculateDistance(userLocation[0], userLocation[1], store.lat, store.lng) : 0;
              
              return (
                <Marker key={store.id} position={[store.lat, store.lng]}>
                  <Popup>
                    <div style={popupCardStyle}>
                      <div style={popupHeaderStyle}>🏢 {store.name}</div>
                      <div style={popupBodyStyle}>
                        <div style={popupRowStyle}><span>📍 Distance:</span><strong>{dist.toFixed(1)} km</strong></div>
                        <div style={popupRowStyle}><span>🏷️ Rate:</span><strong>₹{currentRate}/kg</strong></div>
                        <hr style={{margin: '5px 0', border: '0', borderTop: '1px solid #eee'}}/>
                        <div style={popupRowStyle}><span style={{color: '#66748b'}}>Total Pay:</span><strong style={{ color: "#10b981", fontSize: '15px' }}>₹{total}</strong></div>
                      </div>
                      <button style={popupRouteButtonStyle} onClick={() => getRoute(store)}>Direction</button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          {route.length > 0 && <Polyline positions={route} color="#3b82f6" weight={5} />}
        </MapContainer>

        {showModal && (
          <div style={overlayStyle}>
            <div style={modalStyle}>
              <h2 style={titleStyle}>Recycle Verification</h2>

              <label style={uploadStyle}>
                {isProcessing ? "🔄 Verifying..." : "📤 Click to Upload Photo"}
                <input type="file" style={{ display: "none" }} onChange={handleFileUpload} />
              </label>

              {imagePreview && (
                <div style={{ position: "relative", marginTop: "15px" }}>
                  <img src={imagePreview} alt="preview" style={previewStyle} />
                  {isVerified && <div style={verifiedTagStyle}>AI VERIFIED</div>}
                  {isProcessing && <div style={processingOverlayStyle}><div className="spinner"></div></div>}
                </div>
              )}

              {isVerified && (
                <div style={verifiedBadgeStyle}>
                  <div style={{textAlign: 'left'}}>
                    <p style={{fontSize: '10px', margin: 0, fontWeight: 'bold'}}>MATERIAL TYPE</p>
                    <p style={{fontSize: '22px', margin: 0, fontWeight: '900', textTransform: 'uppercase'}}>{material}</p>
                  </div>
                  <div style={{fontSize: '30px'}}>🛡️</div>
                </div>
              )}

              <div style={{ marginTop: "20px", textAlign: "left" }}>
                <label style={labelStyle}>QUANTITY (KG)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button
                style={{ ...submitStyle, background: isVerified ? '#10b981' : '#cbd5e1' }}
                disabled={!isVerified}
                onClick={() => setShowModal(false)}
              >
                Find Best Local Rates
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .spinner { border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid #fff; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

const overlayStyle = { position: "fixed", inset: 0, backdropFilter: "blur(10px)", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 };
const modalStyle = { background: "#fff", padding: "30px", borderRadius: "24px", width: "360px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" };
const titleStyle = { fontSize: "22px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" };
const uploadStyle = { display: "block", padding: "20px", border: "2px dashed #e2e8f0", borderRadius: "15px", cursor: "pointer", color: "#64748b" };
const previewStyle = { width: "100%", borderRadius: "12px", maxHeight: "180px", objectFit: "cover" };
const verifiedTagStyle = { position: "absolute", top: "10px", right: "10px", background: "#10b981", color: "white", padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: "bold" };
const processingOverlayStyle = { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" };
const verifiedBadgeStyle = { marginTop: "15px", padding: "15px", borderRadius: "15px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", display: "flex", justifyContent: 'space-between', alignItems: 'center' };
const labelStyle = { fontSize: "11px", fontWeight: "bold", color: "#94a3b8" };
const inputStyle = { width: "100%", padding: "12px", marginTop: "5px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "16px", outline: "none" };
const submitStyle = { width: "100%", marginTop: "20px", padding: "15px", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" };
const popupCardStyle = { width: "150px" };
const popupHeaderStyle = { fontWeight: "800", marginBottom: "5px" };
const popupBodyStyle = { fontSize: "12px" };
const popupRowStyle = { display: "flex", justifyContent: "space-between", margin: '2px 0' };
const popupRouteButtonStyle = { marginTop: "10px", width: "100%", padding: "8px", borderRadius: "8px", background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer" };