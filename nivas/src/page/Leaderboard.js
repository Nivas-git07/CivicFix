import React from "react";
import Navbar from "../components/ui/nav";
import "../components/css/leader.css";

export default function Leaderboard() {
  const users = [
    { id: 1, name: "Arun Kumar", reports: 42, points: 840 },
    { id: 2, name: "Meena S", reports: 37, points: 740 },
    { id: 3, name: "Ravi Kumar", reports: 30, points: 600 },
    { id: 4, name: "Priya R", reports: 22, points: 440 },
    { id: 5, name: "Karthik", reports: 18, points: 360 },
  ];

  return (
    <>
      <Navbar />
   
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="leaderboard-wrapper">

        <div className="leaderboard-title">
          <h2>🏆 Community Leaderboard</h2>
          <p>Top contributors improving civic infrastructure</p>
        </div>

        <div className="leaderboard-card">
          <div className="leaderboard-header">
            <span>Rank</span>
            <span>User</span>
            <span>Reports</span>
            <span>Points</span>
          </div>

          {users.map((user, index) => (
            <div key={user.id} className="leaderboard-row">
              <span className="rank">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && index + 1}
              </span>

              <span className="user-name">{user.name}</span>
              <span>{user.reports}</span>
              <span className="points">{user.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}