import React from "react";
import { Bell } from "lucide-react"; // notification icon

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3">
      {/* Left Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl">📍</span>
        <span className="text-xl font-semibold">CivicFix</span>
      </div>

      {/* Center Menu */}
      <div className="flex space-x-8 text-gray-800 font-medium">
        <a href="/home" className="hover:text-blue-600">
          Home
        </a>
        <a href="/report" className="hover:text-blue-600">
          Report
        </a>
        <a href="/complaints" className="hover:text-blue-600">
          My Complaints
        </a>
        <a href="/profile" className="font-bold text-black border-b-2 border-black">
          Profile
        </a>
      </div>

      {/* Right Notifications */}
      <div className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        <span className="absolute top-0 right-0 inline-flex w-2 h-2 bg-red-500 rounded-full"></span>
      </div>
    </nav>
  );
}

export default Navbar;
