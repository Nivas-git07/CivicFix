import React from "react";

const ComplaintDetails = ({ response }) => {
  if (!response) return null; // don't render if no data

  return (
    <section
      id="complaintDetails"
      className="border border-gray-200 rounded-md p-6 bg-gray-50 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Complaint Details</h2>
        <span id="statusLabel" className="status-label select-none">
          {response.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700 text-sm">
        <div>
          <span className="font-semibold">Complaint ID</span> <br />
          <span id="detailComplaintId" className="text-gray-900">
            {response.complaint_id}
          </span>
        </div>
        <div>
          <span className="font-semibold">Submitted</span> <br />
          <time id="detailSubmitted" className="text-gray-900">
            {response.time}
          </time>
        </div>
        <div>
          <span className="font-semibold">Issue Type</span> <br />
          <span id="detailIssueType" className="text-gray-900">
            {response.category}
          </span>
        </div>
        <div>
          <span className="font-semibold">Last Updated</span> <br />
          <time id="detailLastUpdated" className="text-gray-900">
            {response.last_updated || "—"}
          </time>
        </div>
        <div>
          <span className="font-semibold">Location</span> <br />
          <span id="detailLocation" className="text-gray-900">
            {response.location}
          </span>
        </div>
        <div>
          <span className="font-semibold">Assigned Department</span> <br />
          <span id="detailDepartment" className="text-gray-900">
            {response.district}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <span className="font-semibold">Description</span>
        <p id="detailDescription" className="mt-1 text-gray-800">
          {response.description}
        </p>
      </div>

      <div className="mb-6">
        <span className="font-semibold">Photo Evidence</span>
        <div className="mt-3 rounded border border-gray-300 overflow-hidden max-w-full max-h-[320px] shadow-md">
          <img
            id="detailPhoto"
            src={`data:image/png;base64,${response.image}`}
            alt="Photo evidence"
            className="w-full h-auto object-cover"
          />

        </div>
      </div>

      <div>
        <span className="font-semibold">Progress Timeline</span>
        <ul
          id="progressTimeline"
          className="mt-3 space-y-4 text-sm text-gray-700"
        >
          {response.timeline && response.timeline.length > 0 ? (
            response.timeline.map((step, index) => <li key={index}>{step}</li>)
          ) : (
            <li>No updates yet</li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default ComplaintDetails;
