import React from "react";
import { Bell } from "lucide-react"; // notification icon
import { User } from "lucide-react"; // user icon
import { MapPin } from "lucide-react"; // map pin icon
import "../css/home.css"

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
            <a href="#" class="nav-link active">Home</a>
            <a href="#" class="nav-link">Report</a>
            <a href="#" class="nav-link">My Complaints</a>
            <a href="#" class="nav-link">Map View</a>
            <a href="#" class="nav-link">Profile</a>
            <a href="#" class="nav-link">Login</a>
            <a href="#" class="nav-link">Register</a>
          </nav>
        </div>
      </div>
    </header>

  );
}

export default Navbar;
