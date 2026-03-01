import React from "react";


export default function ComplaintDetails({ response }) {
  if (!response) return null;

  return (
    <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in duration-500">
      {/* Header with Title and Badge */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md uppercase tracking-wide">
          {response.status}
        </span>
      </div>

      {/* Info Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
        <div>
          <p className="text-sm font-bold text-gray-900">Complaint ID</p>
          <p className="text-gray-600">{response.complaint_id}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Submitted</p>
          <p className="text-gray-600">{response.time}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Issue Type</p>
          <p className="text-gray-600">{response.category}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Last Updated</p>
          <p className="text-gray-600">{response.last_updated}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Location</p>
          <p className="text-gray-600">{response.location}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Assigned Department</p>
          <p className="text-gray-600">{response.district}</p>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-8">
        <p className="text-sm font-bold text-gray-900 mb-2">Description</p>
        <p className="text-gray-600 leading-relaxed">
          {response.description}
        </p>
      </div>

      {/* Photo Evidence Section */}
      <div className="mb-8">
        <p className="text-sm font-bold text-gray-900 mb-4">Photo Evidence</p>
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <img 
            src={response.image} 
            alt="Complaint Evidence" 
            className="w-full object-cover max-h-[400px]"
          />
        </div>
      </div>

      {/* Timeline Section (Optional but kept for functionality) */}
      <div className="mt-10 border-t border-gray-50 pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Processing Timeline</h3>
        <div className="relative space-y-6">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
          {response.timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-4 relative">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${item.isCompleted ? "bg-green-500" : "bg-gray-200"}`}>
                {item.isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-sm font-bold ${item.isCompleted ? "text-gray-900" : "text-gray-400"}`}>{item.label}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}