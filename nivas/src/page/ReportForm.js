import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/ui/nav";
import PinMapModal from "./PinMapModel";

export default function ReportForm() {
  const [issueType, setIssueType] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placeType, setPlaceType] = useState(null);
  const [coords, setCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  /* ===============================
     HANDLE FILE (Drag or Click)
  =============================== */

  const handleFile = async (file) => {
    setPhotoFile(file);

    // Optional AI check
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

      const cleaned = aiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (parsed.category === "invalid") {
        alert("⚠️ Please upload a valid civic issue image.");
        setPhotoFile(null);
        return;
      }

      if (parsed.category) {
        setIssueType(parsed.category);
      }

      if (parsed.latitude && parsed.longitude) {
        setCoords({
          lat: parsed.latitude,
          lng: parsed.longitude,
        });
      }
    } catch (err) {
      console.log("AI check failed (optional)", err);
    }
  };

  /* ===============================
     REVERSE GEOCODE VALIDATION
  =============================== */

  const checkLocationType = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      const locationType = data.type;
      setPlaceType(locationType);

      const blockedTypes = [
        "residential",
        "apartments",
        "house",
        "living_street",
        "service",
      ];

      if (blockedTypes.includes(locationType)) {
        alert(
          "⚠️ This appears to be a private residential area.\nPlease report only public civic issues."
        );
        return false;
      }

      return true;
    } catch (err) {
      console.error("Reverse geocode failed:", err);
      return true;
    }
  };

  /* ===============================
     LIVE LOCATION
  =============================== */

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const allowed = await checkLocationType(lat, lng);
      if (!allowed) return;

      setCoords({ lat, lng });
    });
  };

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photoFile) {
      alert("Upload photo first");
      return;
    }

    if (!coords) {
      alert("Select location first");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("id", uuidv4());
    formData.append("issueType", issueType);
    formData.append("photo", photoFile);
    formData.append("description", description);
    formData.append("latitude", coords.lat);
    formData.append("longitude", coords.lng);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://quiz.selfmade.express/api/report",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Submission failed");

      alert("Report submitted successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div>
      <Navbar />

      <div className="flex flex-col items-center px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">
          Report Infrastructure Issue
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[600px]"
        >
          {/* DRAG & DROP */}
          {/* <div
            className={`dragUploadBox ${
              isDragging ? "dragActive" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <div className="cameraIcon">📷</div>
            <p>Drag & Drop Image Here</p>
            <p className="text-sm text-gray-500">
              or click to browse
            </p>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFile(file);
              }}
            />
          </div> */}
          {/* BIG DRAG & DROP AREA */}
<div
  className={`bigUploadBox ${isDragging ? "dragActive" : ""}`}
  onDragOver={(e) => {
    e.preventDefault();
    setIsDragging(true);
  }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={(e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }}
  onClick={() => fileInputRef.current.click()}
>
  <div className="bigUploadContent">
    

    {/* <h3 className="bigUploadTitle">
      Drop your civic issue image here
    </h3> */}
    <h3 className="bigUploadTitle">
  {photoFile
    ? "✅ Image Selected Successfully"
    : isDragging
    ? "📂 Release to Upload"
    : "📸 Drag & Drop Your Civic Issue Image"}
</h3>

    <p className="bigUploadSub">
      PNG, JPG up to 10MB
    </p>

    <button
      type="button"
      className="browseBtn"
      onClick={() => fileInputRef.current.click()}
    >
      Browse Files
    </button>
  </div>

  <input
    ref={fileInputRef}
    type="file"
    hidden
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    }}
  />
</div>

          {/* PREVIEW */}
          {photoFile && (
            <div className="flex justify-center mt-4">
              <img
                src={URL.createObjectURL(photoFile)}
                alt="preview"
                className="w-full max-w-[450px] h-[280px] object-cover rounded-xl shadow-md"
              />
            </div>
          )}

          {/* LOCATION BUTTONS */}
          <div className="locationButtons mt-6">
            <button
              type="button"
              onClick={handleLiveLocation}
              className="locationBtn blackBtn"
            >
              📍 Live Location
            </button>

            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="locationBtn grayBtn"
            >
              📌 Pin Location
            </button>
          </div>

          {/* COORDS DISPLAY */}
          {coords && (
            <div className="locationInfoBox mt-4">
              <p>
                <strong>Lat:</strong> {coords.lat}
              </p>
              <p>
                <strong>Lng:</strong> {coords.lng}
              </p>
              {placeType && (
                <p>
                  <strong>Type:</strong>{" "}
                  {placeType}
                </p>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full border p-2 rounded mt-4"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 rounded mt-6"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>

      {showMap && (
        <PinMapModal
          setCoords={setCoords}
          onClose={() => setShowMap(false)}
          checkLocationType={checkLocationType}
        />
      )}
    </div>
  );
}