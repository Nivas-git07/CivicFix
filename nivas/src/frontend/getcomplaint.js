import React, { useState } from "react";
import Navbar from "../components/ui/nav";
import "../components/css/home.css";
import "../components/css/complaint.css";

export default function TrackComplaint() {


    const [complaintId, setComplaintId] = useState("");
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ complaintId }),
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

                <main class="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
                    <center>
                        <h1 class="text-3xl font-extrabold mb-1 text-center">Track Your Complaint</h1>
                    </center>
                    <p class="text-center text-gray-600 mb-8">Enter your complaint ID to view the current status and progress of your infrastructure report.</p>


                    <form id="complaintForm" class="max-w-xl mx-auto mb-6">
                        <label for="complaintIdInput" class="block text-sm font-medium text-gray-700 mb-2">
                            Enter Complaint ID
                            <span class="text-gray-400 font-normal text-xs">(e.g., CF-123456) to view the current status and progress.</span>
                        </label>
                        <div class="flex gap-2">
                            <input
                                type="text"
                                id="complaintIdInput"
                                name="complaintIdInput"
                                placeholder="CF-123456"
                                aria-label="Complaint ID input"
                                class="flex-grow rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                autocomplete="off"
                                spellcheck="false"
                            />
                            <button type="submit" aria-label="Track complaint button" class="inline-flex items-center bg-black text-white font-semibold rounded-md px-4 py-2 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1">
                                Track
                            </button>
                        </div>
                        <p class="mt-3 text-sm text-center text-gray-500">Try these demo complaint IDs</p>
                        <div class="mt-2 flex justify-center gap-3 flex-wrap">
                            <button type="button" data-demoid="CF-123456" class="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1">CF-123456</button>
                            <button type="button" data-demoid="CF-789012" class="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1">CF-789012</button>
                            <button type="button" data-demoid="CF-345678" class="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1">CF-345678</button>
                        </div>
                    </form>

                </main>

            </div>
        </div>
    );
}
