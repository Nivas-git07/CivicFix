import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../components/css/ReportForm.css";
import  "../components/image/image.png";
import Navbar from "../components/ui/nav";



export default function ReportForm() {
  const [issueType, setIssueType] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState("No file selected");
  const [time, settime] = useState("")

  const fileInputRef = useRef(null);

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setFileName(file.name);
    } else {
      setPhotoFile(null);
      setFileName("No file selected");
    }
  };

  const handleSubmit = async (e) => {
    const now = new Date();
     const options = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // AM/PM
    };

    const formatted = now.toLocaleString("en-IN", options);
    settime(formatted);

    e.preventDefault();
    setSubmitting(true);
    const uniqid=uuidv4();

    const formData = new FormData();
    formData.append("id",uniqid);
    formData.append("issueType", issueType);
    formData.append("photo", photoFile);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("time", formatted);
    try {
      const response = await fetch("http://localhost:5000/api/report", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Submission failed");
      }
      alert("Report submitted successfully!");
      // Reset form
      setIssueType("");
      setPhotoFile(null);
      setFileName("No file selected");
      setLocation("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
    <Navbar />
    
    <div className="bg-transparent flex flex-col items-center px-4 py-10">
      {/* Top Section */}
      <h1 className="text-[#1B2430] font-extrabold text-2xl leading-7 text-center">
        Report Infrastructure Issue
      </h1>
      <p className="text-[#4B5563] text-center text-sm max-w-[400px] mt-2 leading-5">
        Help improve our community by reporting infrastructure problems. Your
        input helps us prioritize repairs and maintenance.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white mt-8 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] max-w-[600px] w-full p-6"
      >
        {/* Issue Type */}
        <label
          className="block text-[#374151] text-sm mb-1 font-normal"
          htmlFor="issueType"
        >
          Issue Type <span className="text-[#EF4444]">*</span>
        </label>
        <input
          id="issueType"
          name="issueType"
          type="text"
          required
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-[#374151] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Upload Photo */}
        <label
          className="block text-[#374151] text-sm mt-6 mb-2 font-normal"
          htmlFor="uploadPhoto"
        >
          Upload a Photo
        </label>
        <label
          htmlFor="uploadPhoto"
          className="cursor-pointer flex flex-col items-center justify-center border border-gray-300 rounded-md bg-[#F3F4F6] h-32 text-[#6B7280] text-sm select-none"
        >
          <img
            src="https://storage.googleapis.com/a1aa/image/e0a27f9d-05d3-4294-5fa4-aaf2a66a71c5.jpg"
            alt="Icon of a photo placeholder"
            width="24"
            height="24"
            className="mb-2"
          />
          Drag and drop a photo or click to browse
          <input
            id="uploadPhoto"
            name="uploadPhoto"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={onPhotoChange}
            required
          />
          <button
            type="button"
            className="mt-2 px-4 py-1 border border-blue-500 text-blue-500 rounded text-xs font-normal"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </button>
        </label>
        {fileName && (
          <p className="text-sm text-gray-600 mt-1">{fileName}</p>
        )}
        {photoFile && (
          <img
            src={URL.createObjectURL(photoFile)}
            alt="Preview"
            className="mt-2 max-h-40 rounded-md shadow"
          />
        )}

        {/* Location */}
        <label
          className="block text-[#374151] text-sm mt-6 mb-1 font-normal"
          htmlFor="location"
        >
          Location <span className="text-[#EF4444]">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Enter the location of the issue"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-[#6B7280] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            aria-label="Send location"
            className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md text-[#6B7280] hover:text-blue-600 hover:border-blue-600 transition"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>

        {/* Description */}
        <label
          className="block text-[#374151] text-sm mt-6 mb-1 font-normal"
          htmlFor="description"
        >
          Description <span className="text-[#EF4444]">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          placeholder="Describe the issue in detail. Include any safety concerns or urgency."
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-[#6B7280] text-sm placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-normal py-3 rounded-md transition"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>

        <p className="text-[#6B7280] text-xs mt-4 text-center max-w-[500px] mx-auto">
          Your report will be reviewed and forwarded to authorities. You'll
          receive a complaint ID for tracking.
        </p>
      </form>
    </div>
    </div>
  );
}
