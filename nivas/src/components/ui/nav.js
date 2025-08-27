import React from "react";
// import { Bell } from "lucide-react"; // notification icon
// import { User } from "lucide-react"; // user icon
// import { MapPin } from "lucide-react"; // map pin icon
import "../css/home.css"
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8">
        <div class="flex justify-between items-center h-16">

          <div class="flex items-center space-x-2">
            <div class="logo-circle">
              <div class="logo-inner-circle"></div>
            </div>
            <span class="logo-text">CivicFix</span>
          </div>


          <nav class="nav-desktop">
            <Link to="/home" className="nav-link active">Home</Link>
            <Link to="/report" className="nav-link">Report</Link>
            <Link to="/complaints" className="nav-link">My Complaints</Link>
            <Link to="/map" className="nav-link">Map View</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </nav>
        </div>
      </div>
    </header>

  );
}

export default Navbar;
