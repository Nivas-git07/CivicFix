import React from "react";

export default function ReportCard() {
  return (
    <section className="border border-gray-300 shadow-md rounded-lg overflow-hidden">
    
      <div className="grid grid-cols-3 text-sm text-gray-600 bg-gray-100 border-b border-gray-200">
        <div className="text-center py-3 font-semibold border-r border-gray-200">
          My Reports
        </div>
        <div className="text-center py-3 font-semibold border-r border-gray-200">
          Activity
        </div>
        <div className="text-center py-3 font-semibold">Settings</div>
      </div>

      
      <div className="grid grid-cols-3 gap-6 p-6">
        
        <div className="border border-gray-300 shadow-md rounded-lg overflow-hidden min-h-[280px] flex flex-col">
          <div className="relative flex-shrink-0 h-48">
            <img
              src="https://storage.googleapis.com/a1aa/image/f28469f3-a597-4719-702c-fe0769bc9981.jpg"
              alt="Sunset over a street with a large pothole reflecting the colorful sky and buildings on the sides"
              className="w-full h-full object-cover"
              width={320}
              height={192}
            />
            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded">
              In Progress
            </span>
          </div>

          <div className="p-4 text-gray-700 flex-grow flex flex-col justify-between text-sm">
            <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
              Damaged Road near Main Street
            </h3>

            <p className="flex items-center space-x-3 text-gray-400 mb-3">
              <i className="fas fa-map-marker-alt text-sm" />
              <span>123 Main Street, Downtown</span>
              <i className="fas fa-circle text-[6px]" />
              <span>2 hours ago</span>
            </p>

            <p className="flex items-center space-x-6 text-gray-400">
              <span className="flex items-center space-x-2">
                <i className="fas fa-thumbs-up text-sm" />
                <span>24 votes</span>
              </span>
              <span className="flex items-center space-x-2">
                <i className="fas fa-comments text-sm" />
                <span>5 comments</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
