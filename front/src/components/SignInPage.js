import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignInPage.css"; // Import the CSS file

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Add login logic here
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        {/* Title */}
        <h2 className="signin-title">Welcome Back</h2>
        <p className="signin-subtitle">
          Sign in to your CivicFix account to continue reporting and tracking
          civic issues
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="signin-form">
          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          </div>

          {/* Sign in button */}
          <button type="submit" className="signin-btn">
            Sign In
          </button>
        </form>

        {/* Register link */}
        <p className="register-link">
          Don’t have an account? <Link to="/register">Create one here</Link>
        </p>
        {/* Demo Instructions */}
        <div className="demo-box">
          <p className="demo-title">Demo Instructions:</p>
          <p>
            First register an account, then use those credentials to log in. The
            system stores user data locally for demonstration purposes. In a
            production environment, this would connect to a secure backend
            authentication service.
          </p>
        </div>
      </div>
    </div>
  );
}
