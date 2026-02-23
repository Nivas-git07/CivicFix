import React, { useEffect, useState } from "react";
import "../css/home.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("https://civicfix-nps2.onrender.com/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("Fetched user data:", data);

        if (!res.ok) throw new Error(data.error || "Failed to fetch user");
        setUser(data);

      } catch (err) {
        console.error("Error fetching user:", err.message);
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  const DEFAULT_AVATAR = "https://i.pinimg.com/474x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg?nii=t";
   const imageSrc =
    user && user.image
      ? `data:image/jpeg;base64,${user.image}`
      : DEFAULT_AVATAR;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="logo-circle">
              <div className="logo-inner-circle"></div>
            </div>
            <span className="logo-text">CivicFix</span>
          </div>

          <nav className="nav-desktop">
            <Link to="/home" className="nav-link active">Home</Link>
            <Link to="/report" className="nav-link">Report</Link>
            <Link to="/getcomplaint" className="nav-link">My Complaints</Link>
            <Link to="/map" className="nav-link">Map View</Link>
            <Link to="/profile" className="nav-link">Profile</Link>

            {user ? (
              <>
                <img
                  src={
                    imageSrc
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <Link to="#" className="nav-link">{user.username}</Link>
              </>
            ) : (
              <span className="text-gray-500">Loading...</span>  
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
