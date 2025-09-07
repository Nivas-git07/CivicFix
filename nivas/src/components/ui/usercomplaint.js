import React, { useEffect, useState } from "react";

export default function ComplaintList({ onSelectId }) {
    const [complaints, setComplaints] = useState([]);
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch("http://localhost:5000/api/complaints", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("Fetched complaints:", data);

                if (!response.ok) throw new Error(data.error || "Failed to fetch complaints");

                const parsed = data.complaint_ids?.match(/\d+/g) || [];
                setComplaints(parsed);
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
                        className="inline-flex items-center bg-black text-white font-semibold rounded-md px-4 py-1.5 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
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
