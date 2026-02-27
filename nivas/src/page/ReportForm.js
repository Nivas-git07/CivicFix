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

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // 📍 Live Location
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
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
      const response = await fetch("https://civicfix.app.n8n.cloud/webhook/71fa5cc2-2978-43f6-85e7-82e34fb8f009", {
        method: "POST",
        body: new FormData().append("image", file)
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server error:", text);
        return;
      }

      const result = await response.json();
      console.log("n8n response:", result);

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
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      

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

      {/* Map Modal */}
      {showMap && (
        <PinMapModal
          setCoords={setCoords}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}