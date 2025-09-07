import React from "react";
import Navbar from "../components/ui/nav";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function PublicTransparencyMap() {
    const mapContainerStyle = {
        width: "100%",
        height: "500px",
        borderRadius: "8px",
    };

    const center = {
        lat: 9.9252,
        lng: 78.1198,
    };

    // Example complaint pins
    const complaints = [
        { id: 1, lat: 13.083, lng: 80.27, status: "Pending" },
        { id: 2, lat: 13.085, lng: 80.275, status: "In Progress" },
        { id: 3, lat: 13.081, lng: 80.265, status: "Resolved" },
    ];

    return (
        <div className="bg-white text-gray-900 font-sans min-h-screen">
            {/* Header */}
            <Navbar />


            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Title */}
                <section className="text-center max-w-xl mx-auto mb-8">
                    <h1 className="font-serif font-bold text-2xl leading-tight mb-3">
                        Public Transparency Map
                    </h1>
                    <p className="text-gray-600 text-base leading-relaxed">
                        View all reported infrastructure issues in your community. Track
                        progress and see how authorities are responding to citizen
                        complaints.
                    </p>
                </section>

                <section className="flex gap-8">
                    <div className="flex-1 relative rounded-md border border-gray-200">
                        <LoadScript googleMapsApiKey="">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={center}
                                zoom={14} 
                            >
                                {complaints.map((c) => (
                                    <Marker
                                        key={c.id}
                                        position={{ lat: c.lat, lng: c.lng }}
                                        icon={{
                                            url:
                                                c.status === "Pending"
                                                    ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                                    : c.status === "In Progress"
                                                        ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                                                        : c.status === "Resolved"
                                                            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                                                            : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
                                        }}
                                    />
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                    {/* Sidebar */}
                    <aside className="w-80 flex flex-col gap-8 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {/* Status Legend */}
                        <section className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-700">
                            <h2 className="font-semibold text-base mb-4 select-none">
                                Status Legend
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full bg-red-600 inline-block flex-shrink-0"></span>
                                    <span>Pending</span>
                                    <span className="ml-auto text-gray-400 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center select-none text-sm">
                                        1
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full bg-yellow-500 inline-block flex-shrink-0"></span>
                                    <span>In Progress</span>
                                    <span className="ml-auto text-gray-400 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center select-none text-sm">
                                        2
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full bg-green-600 inline-block flex-shrink-0"></span>
                                    <span>Resolved</span>
                                    <span className="ml-auto text-gray-400 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center select-none text-sm">
                                        2
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full bg-purple-500 inline-block flex-shrink-0"></span>
                                    <span>Escalated</span>
                                    <span className="ml-auto text-gray-400 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center select-none text-sm">
                                        1
                                    </span>
                                </li>
                            </ul>
                        </section>

                        {/* Statistics */}
                        <section className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-700">
                            <h2 className="font-semibold text-base mb-4 select-none">
                                Statistics
                            </h2>
                            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-gray-600">
                                <dt className="text-xs">Total Complaints</dt>
                                <dd className="text-right font-semibold text-base text-gray-900 select-none">
                                    6
                                </dd>
                                <dt className="text-xs">Resolution Rate</dt>
                                <dd className="text-right font-semibold text-base text-gray-900 select-none">
                                    33%
                                </dd>
                                <dt className="text-xs">Avg. Response Time</dt>
                                <dd className="text-right font-semibold text-base text-gray-900 select-none">
                                    <span className="font-bold">2.3</span> days
                                </dd>
                            </dl>
                        </section>

                        {/* Recent Reports */}
                        <section className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-700">
                            <h2 className="font-semibold text-base mb-4 select-none">
                                Recent Reports
                            </h2>
                            <ul className="space-y-4 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-tree text-white text-sm"></i>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold truncate max-w-[200px] text-base">
                                            Cracked sidewalk ne...
                                        </span>
                                        <span className="text-gray-500 truncate max-w-[200px] text-sm leading-tight">
                                            Elm Street Elementary School
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-exclamation-triangle text-white text-sm"></i>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold truncate max-w-[200px] text-base">
                                            Pothole repair in pr...
                                        </span>
                                        <span className="text-gray-500 truncate max-w-[200px] text-sm leading-tight">
                                            Downtown Main Avenue
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-sync-alt text-white text-sm"></i>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold truncate max-w-[200px] text-base">
                                            Streetlight fixed on...
                                        </span>
                                        <span className="text-gray-500 truncate max-w-[200px] text-sm leading-tight">
                                            Oakwood Neighborhood
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-question-circle text-white text-sm"></i>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold truncate max-w-[200px] text-base">
                                            Escalated water leak...
                                        </span>
                                        <span className="text-gray-500 truncate max-w-[200px] text-sm leading-tight">
                                            Riverbend Apartments
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-question text-white text-sm"></i>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold truncate max-w-[200px] text-base">
                                            Resolved park maint...
                                        </span>
                                        <span className="text-gray-500 truncate max-w-[200px] text-sm leading-tight">
                                            Central Park West
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </aside>
                </section>
            </main>

            {/* Footer Note */}
            <div className="fixed bottom-3 left-3 bg-white border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-600 select-none shadow-sm">
                Click on pins to view complaint details
            </div>
        </div>
    );
};

export default PublicTransparencyMap;
