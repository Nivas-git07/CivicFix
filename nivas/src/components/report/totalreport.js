import "../css/home.css";
import { useState, useEffect } from "react";


export default function Totalreport() {
  const [totalReports, setTotalReports] = useState(6);

  useEffect(() => {
    const fetchTotalReports = async () => {
      try {
        const response = await fetch("https://civicfix.selfmade.solutions/api/total-complaints");
        const data = await response.json();

        if (response.ok) {
          setTotalReports(Number(data.total));
          console.log("✅ Total reports fetched:", data.total);
        } else {
          console.error("❌ Error fetching total complaints:", data.message);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchTotalReports();
  }, []);

  return (
    <div className="stat-card">
      <div className="stat-content">
        <div>
          <p className="stat-label">Total report</p>
          <p className="stat-number">{totalReports}</p>
        </div>
        <svg
          className="stat-icon"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
        </svg>
      </div>
    </div>
  );
}
