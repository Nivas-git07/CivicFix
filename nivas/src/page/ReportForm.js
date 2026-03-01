import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/ui/nav";
import PinMapModal from "./PinMapModel";

export default function ReportForm() {
  const [issueType, setIssueType] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placeType, setPlaceType] = useState(null);
  const [coords, setCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // States for Success Pop-up
  const [showSuccess, setShowSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState("");

  const fileInputRef = useRef(null);

  /* ===============================
      HANDLE FILE (Logic remains the same)
  =============================== */
  const handleFile = async (file) => {
    setPhotoFile(file);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(
        "https://civicfix.app.n8n.cloud/webhook/71fa5cc2-2978-43f6-85e7-82e34fb8f009",
        { method: "POST", body: formData }
      );
      if (!response.ok) return;
      const result = await response.json();
      const aiText = result?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) return;
      const cleaned = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.category === "invalid") {
        alert("⚠️ Please upload a valid civic issue image.");
        setPhotoFile(null);
        return;
      }
      if (parsed.category) setIssueType(parsed.category);
      if (parsed.latitude && parsed.longitude) {
        setCoords({ lat: parsed.latitude, lng: parsed.longitude });
      }
    } catch (err) {
      console.log("AI check failed", err);
    }
  };

  /* ===============================
      REVERSE GEOCODE
  =============================== */
  const checkLocationType = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const locationType = data.type;
      setPlaceType(locationType);
      return true; 
    } catch (err) {
      return true;
    }
  };

  /* ===============================
      LIVE LOCATION
  =============================== */
  const handleLiveLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      await checkLocationType(lat, lng);
      setCoords({ lat, lng });
    });
  };

  /* ===============================
      DEFAULT SUBMIT (No Backend Dependency)
  =============================== */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photoFile) { alert("Upload photo first"); return; }
    if (!coords) { alert("Select location first"); return; }

    setSubmitting(true);

    // Simulate a network delay for realism
    setTimeout(() => {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setComplaintId(`CF-101`);
      setSubmitting(false);
      setShowSuccess(true);
    }, 1500); 
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans relative">
      <Navbar />

      <div className="flex flex-col items-center px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Report Infrastructure Issue
          </h1>
          <p className="text-gray-500 mt-2">Your report helps build a better city.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl shadow-blue-100/50 rounded-3xl p-8 w-full max-w-[620px] border border-gray-100"
        >
          {/* UPLOAD AREA */}
          <div
            className={`bigUploadBox ${isDragging ? "dragActive" : ""} ${photoFile ? "border-green-400 bg-green-50/30" : "border-blue-200"}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <div className="flex flex-col items-center pointer-events-none">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all shadow-sm ${photoFile ? "bg-green-100 text-green-600" : "bg-blue-50 text-blue-500"}`}>
                 {photoFile ? "✅" : "📸"}
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {photoFile ? "Image Ready" : "Upload Issue Photo"}
              </h3>
              <p className="text-sm text-gray-500 mt-1 font-medium text-center px-4">
                {photoFile ? photoFile.name : "Drag and drop or click to browse files"}
              </p>
            </div>
            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
          </div>

          {photoFile && (
            <div className="relative mt-6 group">
              <img src={URL.createObjectURL(photoFile)} alt="preview" className="w-full max-h-[300px] object-cover rounded-2xl shadow-xl border-4 border-white" />
              <button type="button" onClick={() => setPhotoFile(null)} className="absolute top-3 right-3 bg-red-500 text-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg">✕</button>
            </div>
          )}

          {/* LOCATION BUTTONS */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button type="button" onClick={handleLiveLocation} className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-black text-white font-bold transition-all hover:bg-gray-800 active:scale-95">
              📍 Live Location
            </button>
            <button type="button" onClick={() => setShowMap(true)} className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border-2 border-gray-100 bg-white text-gray-700 font-bold transition-all hover:border-black active:scale-95">
              📌 Pin on Map
            </button>
          </div>

          {/* DASHBOARD DISPLAY */}
          {(coords || issueType || placeType) && (
            <div className="mt-8 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coords && (
                  <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="text-xl">🌐</div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-blue-400">Coordinates</p>
                      <p className="text-sm font-mono font-bold text-blue-900">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>
                    </div>
                  </div>
                )}
                {placeType && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <div className="text-xl">🏠</div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-purple-400">Location Type</p>
                      <p className="text-sm font-bold text-purple-900 capitalize">{placeType.replace("_", " ")}</p>
                    </div>
                  </div>
                )}
              </div>
              {issueType && (
                <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="text-xl">🏷️</div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-500">AI Detection</p>
                    <p className="text-sm font-bold text-emerald-900 capitalize">{issueType.replace("_", " ")}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <label className="text-sm font-bold text-gray-700 mb-2 block ml-1">Issue Description</label>
            <textarea
              placeholder="Provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-black outline-none transition-all min-h-[120px] bg-gray-50/30"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl mt-8 font-extrabold text-lg transition-all shadow-xl ${
              submitting ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900 active:scale-95"
            }`}
          >
            {submitting ? "Processing..." : "Submit Report"}
          </button>
        </form>
      </div>

      {showMap && <PinMapModal setCoords={setCoords} onClose={() => setShowMap(false)} checkLocationType={checkLocationType} />}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
              ✅
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Submitted Successfully!</h2>
            <p className="text-gray-500 mb-8 font-medium">Your report has been logged in our system.</p>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 mb-8">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Your Complaint ID</p>
              <p className="text-2xl font-mono font-black text-blue-600 tracking-tighter">{complaintId}</p>
            </div>
            
            <button onClick={() => window.location.reload()} className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg">
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .bigUploadBox {
          border: 2.5px dashed;
          border-radius: 1.5rem;
          padding: 3rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .dragActive {
          background-color: #eff6ff !important;
          border-color: #2563eb !important;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}