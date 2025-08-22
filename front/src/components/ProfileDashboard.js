import React from "react";
import "./ProfileDashboard.css"; // Connects the CSS below
import avatarImg from "./avatar.png";
import logoImg from "./image.png";

const stats = [
  { label: "Total Reports", value: 6 },
  { label: "Resolved", value: 7 },
  { label: "In Progress", value: 0 },
  { label: "Open", value: 0 },
];

export default function ProfileDashboard() {
  return (
    <div className="dashboard-container">
      <header className="navbar">
        <div className="navbar-left">
          <img src={logoImg} alt="Logo" className="logo" />
          <span className="brand">CivicFix</span>
        </div>
        <nav className="nav-links">
          {["Home", "Report", "My Complaints", "Profile"].map((text) => (
            <a href="#" key={text}>
              {text}
            </a>
          ))}
          <button className="icon-button">🔔</button>
        </nav>
      </header>

      <section className="profile-card">
        <img src={avatarImg} alt="User Avatar" className="avatar" />
        <div className="profile-info">
          <h2>Sarah Johnson</h2>
          <p>sarah.johnson@email.com • Joined March 2023 • Downtown District</p>
        </div>
        <div className="profile-actions">
          <span className="reputation">85 Reputation</span>
          <button className="edit-button">Edit Profile</button>
        </div>
      </section>
      <section className="stats-cards">
        {stats.map(({ label, value }) => {
          // Determine the CSS class based on the label
          const valueClass =
            label === "Total Reports"
              ? "value-total"
              : label === "Resolved"
              ? "value-resolved"
              : label === "In Progress"
              ? "value-progress"
              : "value-default";

          return (
            <div key={label} className="stat-card">
              <span className="stat-label">{label}</span>
              <span className={`stat-value ${valueClass}`}>{value}</span>
            </div>
          );
        })}
      </section>

      <section className="reports-section">
        <h3>My Reports</h3>
        {/* Report cards carousel or grid goes here */}
      </section>
    </div>
  );
}
