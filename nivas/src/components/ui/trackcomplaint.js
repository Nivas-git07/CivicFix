import React, { useState } from "react";
import Navbar from "../components/ui/nav";
import ComplaintDetails from "../components/ui/complaintdetails";
import ComplaintList from "../components/ui/usercomplaint";

export default function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!complaintId.trim()) {
      alert("Please enter a complaint ID");
      return;
    }

    // ✅ Timeline is an array of OBJECTS
    const defaultData = {
      status: "In Progress",
      complaint_id: complaintId,
      time: "Today, 3:45 PM",
      category: "Garbage Overflow",
      last_updated: "10 minutes ago",
      location: "Anna Nagar, Madurai",
      description: "Garbage bins are overflowing near the main road causing bad smell.",
      timeline: [
        { label: "Complaint Submitted", isCompleted: true, time: "3:45 PM" },
        { label: "Assigned to Department", isCompleted: false, time: "Pending" },
        { label: "Cleaning Scheduled", isCompleted: false, time: "Pending" },
      ],
    };

    setResponse(defaultData);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center py-12 px-4">
        <main className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-black text-center mb-8">Track Complaint</h1>
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-10">
            <div className="flex gap-2">
              <input
                type="text"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                placeholder="CF-101"
                className="flex-grow rounded-xl border border-gray-300 px-4 py-2"
              />
              <button type="submit" className="bg-black text-white px-6 py-2 rounded-xl font-bold">
                Track
              </button>
            </div>
            <ComplaintList onSelectId={setComplaintId} />
          </form>

          {/* This renders the details below */}
          {response && <ComplaintDetails response={response} />}
        </main>
      </div>
    </div>
  );
}