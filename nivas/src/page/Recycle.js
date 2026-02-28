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
    rates: { plastic: 12, metal: 35, paper: 8 },
  },
  {
    id: 2,
    name: "City Scrap Store",
    lat: 9.93,
    lng: 78.125,
    rates: { plastic: 10, metal: 40, paper: 7 },
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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in KM
  };

  /* AUTO GPS ON LOAD */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          setLocationError("Location permission denied.");
        },
      );
    } else {
      setLocationError("Geolocation not supported.");
    }
  }, []);

  const detectMaterial = () => {
    const types = ["plastic", "metal", "paper"];
    const random = types[Math.floor(Math.random() * types.length)];
    setMaterial(random);
  };

  const getRoute = async (store) => {
    if (!userLocation) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${store.lng},${store.lat}?overview=full&geometries=geojson`;

    const res = await fetch(url);
    const data = await res.json();

    const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);

    setRoute(coords);
  };

  const handleSubmit = () => {
    if (!imagePreview) {
      alert("Please upload a waste photo first.");
      return;
    }

    if (!weight) {
      alert("Please enter weight in kg.");
      return;
    }

    if (!userLocation) {
      alert("Waiting for GPS location.");
      return;
    }

    // Calculate distance to each store
    stores.forEach((store) => {
      const distance = calculateDistance(
        userLocation[0],
        userLocation[1],
        store.lat,
        store.lng,
      );

      console.log(`${store.name} is ${distance.toFixed(2)} KM away`);
    });

    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "100vh", width: "100%" }}>
        <MapContainer
          center={[9.9252, 78.1198]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Your Location 📍</Popup>
            </Marker>
          )}

          {!showModal &&
            stores.map((store) => {
              const rate = store.rates[material] || 0;
              const estimated = weight * rate;

              const distance = calculateDistance(
                userLocation[0],
                userLocation[1],
                store.lat,
                store.lng,
              );

              return (
                <Marker key={store.id} position={[store.lat, store.lng]}>
                  <Popup>
                    <div style={popupCardStyle}>
                      <div style={popupHeaderStyle}>🏪 {store.name}</div>

                      <div style={popupBodyStyle}>
                        <div style={popupRowStyle}>
                          <span>📍 Distance</span>
                          <strong>{distance.toFixed(2)} KM</strong>
                        </div>

                        <div style={popupRowStyle}>
                          <span>💰 Rate</span>
                          <strong>₹{rate}/kg</strong>
                        </div>

                        <div style={popupRowStyle}>
                          <span>🧾 Estimated Earnings</span>
                          <strong style={{ color: "#10b981" }}>
                            ₹{estimated}
                          </strong>
                        </div>
                      </div>

                      <button
                        style={popupRouteButtonStyle}
                        onClick={() => getRoute(store)}
                      >
                        🚗 Show Route
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {route.length > 0 && <Polyline positions={route} color="#2563eb" />}
        </MapContainer>

        {showModal && (
          <div style={overlayStyle}>
            <div style={modalStyle}>
              <h2 style={titleStyle}>♻ Sell Your Waste</h2>

              <label style={uploadStyle}>
                Upload Photo
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setImagePreview(URL.createObjectURL(file));

                    // 🔥 SEND IMAGE TO N8N
                    const formData = new FormData();
                    formData.append("image", file); // parameter name = image

                    try {
                      const response = await fetch(
                        "https://civicfix.app.n8n.cloud/webhook/d99da71e-0cf7-4a0a-b9f7-47c55a9a4f92",
                        {
                          method: "POST",
                          body: formData,
                        }
                      );

                      const result = await response.json();

                      console.log("AI Response:", result);

                      if (result.status === "valid") {
                        setMaterial(result.category);
                      } else {
                        alert("Invalid image: " + result.reason);
                      }

                    } catch (error) {
                      console.error("Upload error:", error);
                      alert("Failed to process image.");
                    }
                  }}
                />
              </label>

              {imagePreview && (
                <img src={imagePreview} alt="preview" style={previewStyle} />
              )}

              {material && (
                <p style={{ marginTop: "8px" }}>
                  Detected: <strong>{material}</strong>
                </p>
              )}

              {locationError && (
                <div style={gpsCardStyle}>
                  <div style={gpsIconStyle}>📍</div>
                  <h4>Location Required</h4>
                  <p style={{ fontSize: "13px" }}>
                    Please turn on GPS to continue.
                  </p>
                  <button
                    style={gpsRetryButton}
                    onClick={() => {
                      setLocationError("");
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setUserLocation([
                            pos.coords.latitude,
                            pos.coords.longitude,
                          ]);
                        },
                        () => {
                          setLocationError("Location permission denied.");
                        },
                      );
                    }}
                  >
                    Turn On Location
                  </button>
                </div>
              )}

              <input
                type="number"
                placeholder="Enter weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={inputStyle}
              />

              <button style={submitStyle} onClick={handleSubmit}>
                Find Best Stores
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ================= PREMIUM STYLES ================= */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  backdropFilter: "blur(8px)",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const popupCardStyle = {
  width: "220px",
  padding: "10px",
  borderRadius: "12px",
  fontFamily: "sans-serif",
};

const popupHeaderStyle = {
  fontWeight: "700",
  fontSize: "15px",
  marginBottom: "8px",
  color: "#111827",
};

const popupBodyStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  fontSize: "13px",
  color: "#374151",
};

const popupRowStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const popupRouteButtonStyle = {
  marginTop: "10px",
  width: "100%",
  padding: "6px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(to right, #10b981, #3b82f6)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};
const modalStyle = {
  background: "rgba(255,255,255,0.95)",
  padding: "30px",
  borderRadius: "20px",
  width: "380px",
  textAlign: "center",
  boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
   maxHeight: "90vh",        // ✅ Prevent overflow
  overflowY: "auto",
};

const titleStyle = {
  fontSize: "22px",
  fontWeight: "700",
  marginBottom: "15px",
  background: "linear-gradient(to right, #10b981, #3b82f6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const uploadStyle = {
  display: "block",
  padding: "12px",
  border: "2px dashed #3b82f6",
  borderRadius: "12px",
  cursor: "pointer",
};

const previewStyle = {
  width: "100%",
  borderRadius: "12px",
  marginTop: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const submitStyle = {
  width: "100%",
  marginTop: "15px",
  padding: "12px",
  background: "linear-gradient(to right, #10b981, #3b82f6)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const routeButtonStyle = {
  marginTop: "8px",
  padding: "6px 10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const gpsCardStyle = {
  marginTop: "15px",
  padding: "15px",
  borderRadius: "14px",
  background: "linear-gradient(to right, #fee2e2, #fecaca)",
  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
};

const gpsIconStyle = {
  fontSize: "28px",
  marginBottom: "5px",
};

const gpsRetryButton = {
  marginTop: "10px",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(to right, #ef4444, #dc2626)",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};
