import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./ReportForm.css";
import  "..components/image/image.png";
import Navbar from "../components/ui/nav";

const ReportForm = () => {
  const [issueType, setIssueType] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState("No file selected");

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
    e.preventDefault();
    setSubmitting(true);
    const uniqid=uuidv4();

    const formData = new FormData();
    formData.append("id",uniqid);
    formData.append("issueType", issueType);
    formData.append("photo", photoFile);
    formData.append("location", location);
    formData.append("description", description);

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
  };

  return (
    <div>
      <Navbar />

      <div className="top">
        <h1>Report Infrastructure Issues</h1>
        <p>
          Help improve your community by reporting infrastructure problems.
          Your report will be tracked and escalated if necessary.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="formContainer">
        <h2>Submit Your Report</h2>
        <p>
          Provide details about the infrastructure issue you've encountered. All
          fields are required.
        </p>

        <label className="formLabel" htmlFor="issueType">
          Issue Type *
        </label>
        <select
          id="issueType"
          className="formSelect"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          required
        >
          <option value="">Select the type of infrastructure issue</option>
          <option value="pothole">Pothole</option>
          <option value="streetlight">Broken Streetlight</option>
          <option value="water_leak">Water Leak</option>
          <option value="other">Other</option>
        </select>

        <div className="formLabel file-upload" tabIndex="0">
          <span>Photo Evidence *</span>
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            required
            ref={fileInputRef}
            className="file-upload__input"
            aria-describedby="photo-file-name"
          />
          <p id="photo-file-name" className="file-upload__filename">
            {fileName}
          </p>
        </div>

        {photoFile && (
          <img
            src={URL.createObjectURL(photoFile)}
            alt="Preview"
            className="imagePreview"
          />
        )}

        <label className="formLabel" htmlFor="location">
          Location *
        </label>
        <input
          id="location"
          type="text"
          placeholder="Enter address or use GPS"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="formInput"
          required
        />

        <label className="formLabel" htmlFor="description">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          className="formTextarea"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="submitButton"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>

        <p>
          Your report will be reviewed and forwarded to the appropriate
          authorities. You'll receive a complaint ID for tracking.
        </p>
      </form>
    </div>
  );
};

export default ReportForm;
