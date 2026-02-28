import React, { useEffect, useState } from "react";

export default function ComplaintList({ onSelectId }) {
  // ✅ Default Complaint IDs
  const DEFAULT_IDS = ["CF-101", "CF-102", "CF-103"];

  const [complaints, setComplaints] = useState(DEFAULT_IDS);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // keep default if no token

        const response = await fetch(
          "https://quiz.selfmade.express/complaints",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        console.log("Fetched complaints:", data);

        const parsed = data.complaint_ids?.match(/\d+/g) || [];

        if (parsed.length > 0) {
          setComplaints(parsed.map((num) => `CF-${num}`));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // fallback stays DEFAULT_IDS
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="mt-2 flex justify-center gap-3 flex-wrap">
      {complaints.length > 0 ? (
        complaints.map((id) => (
          <button
            key={id}
            type="button"
            className="inline-flex items-center bg-black text-white font-semibold rounded-md px-4 py-1.5 hover:bg-gray-900 transition"
            onClick={() => onSelectId(id)}
          >
            {id}
          </button>
        ))
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
}