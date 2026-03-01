import React, { useState } from "react";
import Navbar from "../components/ui/nav";
import "../components/css/home.css";
import "../components/css/complaint.css";
import ComplaintDetails from "./Complaintdetails";
import ComplaintList from "../components/ui/usercomplaint";
import image from "../components/image/drain.jpeg";

export default function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!complaintId.trim()) {
      alert("Please enter a complaint ID");
      return;
    }

    // ✅ Timeline objects: isCompleted: true for "Ready", false for "Not Ready"
    const defaultData = {
      status: "In Progress",
      complaint_id: complaintId,
      time: "Today, 3:45 PM",
      category: "Garbage Overflow",
      last_updated: "10 minutes ago",
      location: "Anna Nagar, Madurai",
      district: "Madurai Corporation",
      description:
        "Garbage bins are overflowing near the main road causing bad smell and inconvenience to residents.",
      image: image,
      timeline: [
        { label: "Complaint Submitted", isCompleted: true, time: "3:45 PM" },
        { label: "Assigned to Sanitation Department", isCompleted: false, time: "Waiting..." },
        { label: "Cleaning Scheduled", isCompleted: false, time: "Pending" },
      ],
    };

    setResponse(defaultData);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Track Your Complaint</h1>
            <p className="text-gray-500">Stay updated on the status of your infrastructure report.</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-10">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Complaint ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                placeholder="e.g., CF-101"
                className="flex-grow rounded-xl border-2 border-gray-100 px-4 py-3 focus:border-black focus:ring-0 outline-none transition-all"
              />
              <button 
                type="submit" 
                className="bg-black text-white font-bold rounded-xl px-8 py-3 hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Track
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest text-center mb-3">Quick Select Your Reports</p>
                <ComplaintList onSelectId={setComplaintId} />
            </div>
          </form>

          {/* This component will now handle the objects correctly */}
          {response && <ComplaintDetails response={response} />}
        </main>
      </div>
    </div>
  );
}