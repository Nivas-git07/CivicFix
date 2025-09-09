import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/css/RegisterPage.css"; // Import CSS

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    district: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false); // prevent multiple submits
  const navigate = useNavigate(); // redirect after success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // block if already submitting
    setLoading(true);

    // simple password check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.fullName, // change to fullName if backend expects it
          email: formData.email,
          district: formData.district,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Created successfully:", result);
      alert("Account created successfully!");

      // reset form
      setFormData({
        fullName: "",
        email: "",
        district: "",
        password: "",
        confirmPassword: "",
      });

      // redirect to login page
      navigate("/"); // this will take user to localhost:3000/
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Title */}
        <h2 className="register-title">Create Your Account</h2>
        <p className="register-subtitle">
          Join CivicFix to report and track civic issues in your community
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* District */}
          <div className="form-group">
            <label>District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            >
              <option value="">Select your district</option>
              <option value="Madurai">Madurai</option>
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Trichy">Trichy</option>
            </select>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Terms */}
        <p className="terms-text">
          Already have an account? <Link to="/">Sign in</Link>
        </p>

        <p className="terms-text">
          By creating an account, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
