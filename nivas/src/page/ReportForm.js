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
  const [placeType, setPlaceType] = useState(null);

  const [coords, setCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  /* ===============================
   🔍 Reverse Geocoding + Validation
================================ */

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
   // 🚨 BLOCK PRIVATE / HOME RELATED AREAS
const blockedTypes = [
  "residential",
  "apartments",
  "house",
  "living_street",
  "service",
];

if (blockedTypes.includes(locationType)) {
  alert(
    "⚠️ This appears to be a private residential or housing street.\nPlease report only public civic issues."
  );
  return false;
}

    return true;
  } catch (error) {
    console.error("Reverse geocode failed:", error);
    return true; // allow if API fails
  }
};

  // 📍 Live Location
 const handleLiveLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const isAllowed = await checkLocationType(lat, lng);

      if (!isAllowed) return;

      setCoords({ lat, lng });
      alert("Live location shared successfully!");
    },
    () => alert("Location permission denied")
  );
};

  // 📌 Pin Location
  const handlePinLocation = () => {
    setShowMap(true);
  };

const onPhotoChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setPhotoFile(file);
  setFileName(file.name);

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      "https://civicfix.app.n8n.cloud/webhook/71fa5cc2-2978-43f6-85e7-82e34fb8f009",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Server error:", text);
      return;
    }

    const result = await response.json();
    console.log("n8n raw response:", result);
    

    // ✅ Extract AI text
    const aiText = result?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) return;

    // ✅ Remove ```json wrapper
    const cleaned = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    console.log("Parsed AI result:", parsed);
    alert(`AI detected category: ${parsed.category || "None"}`);
    

   
   // ✅ If AI says image is invalid
if (parsed.category === "invalid") {
  alert("⚠️ Please upload a correct image related to civic issue.");
  setIssueType("");
  return; // stop further execution
}

// ✅ If AI detected valid category
if (parsed.category) {
  setIssueType(parsed.category);
}

    // ✅ If AI provided coordinates
    if (parsed.latitude && parsed.longitude) {
      setCoords({
        lat: parsed.latitude,
        lng: parsed.longitude,
      });

      alert("📍 Location detected from image!");
    }

  } catch (error) {
    console.error("Upload failed:", error);
  }
};

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
     formData.append("latitude", coords?.lat || "");
formData.append("longitude", coords?.lng || "");


      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://backend.todayworld.in/api/report",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
         

          {/* Photo Upload */}
 <div className="uploadWrapper">
  <label className="uploadCard">
    <div className="uploadIconWrapper">
      <div className="cameraIcon">📷</div>
      <div className="uploadArrow">⬆</div>
    </div>

    <p className="uploadLabel">
      {fileName === "No file selected"
        ? "Upload Issue Image"
        : fileName}
    </p>

    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={onPhotoChange}
      required
      hidden
    />
  </label>
</div>

   {photoFile && (
  <div className="flex justify-center mb-6">
    <img
      src={URL.createObjectURL(photoFile)}
      alt="Preview"
      className="w-full max-w-[450px] h-[280px] object-cover rounded-xl shadow-md border border-gray-200"
    />
  </div>
)}

          {/* Location Options */}
<div className="locationButtons">
  <button
    type="button"
    onClick={handleLiveLocation}
    className="locationBtn blackBtn"
  >
    📍 Share Live Location
  </button>

  <button
    type="button"
    onClick={handlePinLocation}
    className="locationBtn grayBtn"
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
  <div className="locationInfoBox">
    <div>
      <strong>Latitude:</strong> {coords.lat}
    </div>
    <div>
      <strong>Longitude:</strong> {coords.lng}
    </div>

    {placeType && (
      <div className="placeTypeRow">
        <strong>Location Type:</strong>{" "}
        <span
          className={
            placeType === "residential" ||
            placeType === "apartments" ||
            placeType === "house"
              ? "residentialBadge"
              : "publicBadge"
          }
        >
          {placeType}
        </span>
      </div>
    )}
  </div>
)}

         

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-2 rounded"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>

      {/* Map Modal */}
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