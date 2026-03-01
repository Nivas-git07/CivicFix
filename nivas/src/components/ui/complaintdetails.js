import React from "react";
import photo from "../image/drain.jpeg";
const defaultResponse = {
  status: "Pending",
  complaint_id: "CIV-2025-001",
  time: "Today, 2:30 PM",
  category: "Drainage Issue",
  last_updated: "—",
  location: "Anna Nagar, Madurai",
  district: "Madurai Corporation",
  description:
    "Open drainage leakage causing bad smell and mosquito breeding. Needs immediate cleaning and repair.",
  image: photo , 
  timeline: [
    "Complaint Submitted",
    "Assigned to Sanitation Department",
    "Inspection Scheduled",
  ],
};

const ComplaintDetails = ({ response }) => {

  const data = response || defaultResponse;

  return (
    <section
      id="complaintDetails"
      className="border border-gray-200 rounded-md p-6 bg-gray-50 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Complaint Details</h2>
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${
            data.status === "Pending"
              ? "bg-red-100 text-red-600"
              : data.status === "In Progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-600"
          }`}
        >
          {data.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700 text-sm">
        <div>
          <span className="font-semibold">Complaint ID</span> <br />
          <span className="text-gray-900">{data.complaint_id}</span>
        </div>
        <div>
          <span className="font-semibold">Submitted</span> <br />
          <time className="text-gray-900">{data.time}</time>
        </div>
        <div>
          <span className="font-semibold">Issue Type</span> <br />
          <span className="text-gray-900">{data.category}</span>
        </div>
        <div>
          <span className="font-semibold">Last Updated</span> <br />
          <time className="text-gray-900">
            {data.last_updated || "—"}
          </time>
        </div>
        <div>
          <span className="font-semibold">Location</span> <br />
          <span className="text-gray-900">{data.location}</span>
        </div>
        <div>
          <span className="font-semibold">Assigned Department</span> <br />
          <span className="text-gray-900">{data.district}</span>
        </div>
      </div>

      <div className="mb-6">
        <span className="font-semibold">Description</span>
        <p className="mt-1 text-gray-800">{data.description}</p>
      </div>

      <div className="mb-6">
        <span className="font-semibold">Photo Evidence</span>
        <div className="mt-3 rounded border border-gray-300 overflow-hidden max-w-full max-h-[320px] shadow-md">
          
            <img
              src={photo}
              alt="Photo evidence"
              className="w-full h-auto object-cover"
            />
         
          
        </div>
      </div>

      <div>
        <span className="font-semibold">Progress Timeline</span>
        <ul className="mt-3 space-y-4 text-sm text-gray-700">
          {data.timeline && data.timeline.length > 0 ? (
            data.timeline.map((step, index) => (
              <li key={index}>• {step}</li>
            ))
          ) : (
            <li>No updates yet</li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default ComplaintDetails;