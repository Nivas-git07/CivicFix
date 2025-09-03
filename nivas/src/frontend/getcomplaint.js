import React, { useState } from "react";
import Navbar from "../components/ui/nav";
import "../components/css/home.css";
import "../components/css/complaint.css";
import "../components/css/trackcomplaint.css";

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
            <TrackComplaint />
            
          
        </div>
    );
}
