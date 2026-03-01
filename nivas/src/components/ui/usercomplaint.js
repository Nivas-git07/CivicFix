import React, { useEffect, useState } from "react";

export default function ComplaintList({ onSelectId }) {
  // ✅ Default Complaint IDs
  const DEFAULT_IDS = ["CF-101", "CF-102", "CF-103"];

  const [complaints, setComplaints] = useState(DEFAULT_IDS);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; 

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
        
        // Handling potential different data structures from backend
        const rawIds = data.complaint_ids || data;
        let parsed = [];

        if (typeof rawIds === 'string') {
            parsed = rawIds.match(/\d+/g) || [];
        } else if (Array.isArray(rawIds)) {
            parsed = rawIds;
        }

        if (parsed.length > 0) {
          // Ensure they follow the CF-XXX format
          setComplaints(parsed.map((id) => id.toString().startsWith("CF-") ? id : `CF-${id}`));
        }
      } catch (err) {
        console.error("Fetch error:", err);
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
            className="group relative flex items-center gap-2 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-xl px-4 py-2 hover:border-black hover:text-black transition-all active:scale-95 shadow-sm"
            onClick={() => onSelectId(id)}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full group-hover:animate-ping"></span>
            {id}
          </button>
        ))
      ) : (
        <p className="text-sm text-gray-400 italic">No recent complaints found.</p>
      )}
    </div>
  );
}