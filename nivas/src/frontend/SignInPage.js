import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/css/SignInPage.css"; // Import CSS

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        
        console.log("Login Success:", data);

        
        localStorage.setItem("user", JSON.stringify(data));

       
        navigate("/dashboard");
      } else {
        // ❌ Login failed
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Something went wrong. Please try again later.");
    }
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

export default SignInPage;
