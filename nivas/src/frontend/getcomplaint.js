import React, { useState } from "react";
import Navbar from "../components/ui/nav";
import "../components/css/home.css";
import "../components/css/complaint.css";

export default function TrackComplaint() {


    const [complaintId, setComplaintId] = useState("");
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!complaintId.trim()) {
            alert("Please enter a complaint ID");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/complaint_id/${complaintId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                throw new Error("Complaint not found");
            }

            const data = await res.json();
            setResponse(data);
            console.log(data);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">

                <main className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
                    <center>
                        <h1 className="text-3xl font-extrabold mb-1 text-center">Track Your Complaint</h1>
                    </center>
                    <p className="text-center text-gray-600 mb-8">Enter your complaint ID to view the current status and progress of your infrastructure report.</p>


                    <form onSubmit={handleSubmit} id="complaintForm" className="max-w-xl mx-auto mb-6">
                        <label htmlFor="complaintIdInput" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter Complaint ID
                            <span className="text-gray-400 font-normal text-xs">(e.g., CF-123456) to view the current status and progress.</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                               type="text"
              id="complaintIdInput"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="CF-123456"
              className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              autoComplete="off"
              spellCheck="false"
                            />
                            <button type="submit" aria-label="Track complaint button" className="inline-flex items-center bg-black text-white font-semibold rounded-md px-4 py-2 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1">
                                Track
                            </button>
                        </div>
                        <p className="mt-3 text-sm text-center text-gray-500">Try these demo complaint IDs</p>
                        <div className="mt-2 flex justify-center gap-3 flex-wrap">
                            <button 
                                type="button" 
                                onClick={() => setComplaintId("CF-123456")}
                                className="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                            >
                                CF-123456
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setComplaintId("CF-789012")}
                                className="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                            >
                                CF-789012
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setComplaintId("CF-345678")}
                                className="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                            >
                                CF-345678
                            </button>
                        </div>
                    </form>

                    {/* Response Display */}
                    {response && (
                        <div className="max-w-xl mx-auto mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800 mb-4">Complaint Details</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Complaint ID:</span> {response.complaint_id}</p>
                                <p><span className="font-medium">Title:</span> {response.title}</p>
                                <p><span className="font-medium">Location:</span> {response.location}</p>
                                <p><span className="font-medium">Description:</span> {response.description}</p>
                                <p><span className="font-medium">Status:</span> 
                                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                        response.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                        response.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {response.status}
                                    </span>
                                </p>
                                {response.time && (
                                    <p><span className="font-medium">Submitted:</span> {new Date(response.time).toLocaleString()}</p>
                                )}
                            </div>
                        </div>
                    )}

                </main>

            </div>
        </div>
    );
}
