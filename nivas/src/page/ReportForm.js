import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/ui/nav";
import { useNavigate } from "react-router-dom";
import PinMapModal from "./PinMapModel";

export default function ReportForm() {
  const [issueType, setIssueType] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState("No file selected");

  const [coords, setCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [placeType, setPlaceType] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /* ===============================
     🔍 Reverse Geocoding + Validation
  =============================== */

  const checkLocationType = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      const locationClass = data.class;
      const locationType = data.type;

      console.log("Class:", locationClass);
      console.log("Type:", locationType);

      setPlaceType(locationType);

      // 🚨 BLOCK PRIVATE RESIDENTIAL
      if (
        locationType === "residential" ||
        locationType === "apartments" ||
        locationType === "house"
      ) {
        console.log("Blocked location type:", locationType);
        alert(
          "⚠️ This appears to be a private residential building.\nPlease use municipal bins for household waste."
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Reverse geocode failed:", error);
      return true; // allow if API fails
    }
  };

  /* ===============================
     📍 Live Location
  =============================== */

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const allowed = await checkLocationType(lat, lng);
        if (!allowed) return;

        setCoords({ lat, lng });
        alert("Live location shared successfully!");
      },
      () => alert("Location permission denied")
    );
  };

  /* ===============================
     📌 Pin Location
  =============================== */

  const handlePinLocation = () => {
    setShowMap(true);
  };

  /* ===============================
     📷 Photo Upload
  =============================== */

  const onPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setFileName(file.name);
  };

  /* ===============================
     🚀 Submit Report
  =============================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!photoFile) {
        alert("Please upload a photo.");
        return;
      }

      if (!coords) {
        alert("Please select a location (Live or Pin).");
        return;
      }

      const formData = new FormData();
      formData.append("id", uuidv4());
      formData.append("issueType", issueType);
      formData.append("photo", photoFile);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);

      const formdataForN8n = new FormData();
      formdataForN8n.append("image", photoFile);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://backend.todayworld.in/api/report",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formdataForN8n,
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }

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
          {/* Issue Type */}
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">Select Issue Type</option>
            <option value="pothole">Pothole</option>
            <option value="streetlight">Broken Streetlight</option>
            <option value="water_leak">Water Leak</option>
          </select>

          {/* Photo Upload */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onPhotoChange}
            required
            className="mb-3"
          />

          {photoFile && (
            <img
              src={URL.createObjectURL(photoFile)}
              alt="Preview"
              className="mb-4 max-h-40 rounded"
            />
          )}

          {/* Location Options */}
          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={handleLiveLocation}
              className="flex-1 bg-green-600 text-white py-2 rounded"
            >
              📍 Share Live Location
            </button>

            <button
              type="button"
              onClick={handlePinLocation}
              className="flex-1 bg-blue-600 text-white py-2 rounded"
            >
              📌 Pin Location
            </button>
          </div>

          {/* Manual Address */}
          <input
            type="text"
            placeholder="Or type address manually"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          {/* Show Selected Coords */}
          {coords && (
            <div className="text-sm text-gray-600 mb-3">
              Lat: {coords.lat} | Lng: {coords.lng}
              <br />
              Place Type: {placeType}
            </div>
          )}

          {/* Description */}
          <textarea
            rows="4"
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border p-2 rounded mb-4"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 rounded"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>

      {/* Pin Map Modal */}
      {showMap && (
        <PinMapModal
          setCoords={async (latlng) => {
            const allowed = await checkLocationType(
              latlng.lat,
              latlng.lng
            );

            if (!allowed) return;

            setCoords(latlng);
            setShowMap(false);
          }}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}