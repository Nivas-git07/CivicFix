import React, { useEffect, useState } from "react";
import Content from "./content";
import photo from "../image/drain.jpeg";
export default function ReportCard() {
  const DEFAULT_COMPLAINTS = [
    {
      id: 1,
      status: "Pending",
      views: 124,
      description: "Pothole near Anna Nagar signal causing traffic issues.",
      location: "Anna Nagar, Madurai",
      time: "2 hours ago",
      vote: 15,
      like: 2,
      comment: 4,
      issueid: "CIV-101",
      image: photo,
    },
    {
      id: 2,
      status: "In Progress",
      views: 210,
      description: "Garbage overflowing near bus stand.",
      location: "Periyar Bus Stand",
      time: "5 hours ago",
      vote: 30,
      like: 3,
      comment: 8,
      issueid: "CIV-102",
      image: photo,
    },
    {
      id: 3,
      status: "Resolved",
      views: 89,
      description: "Streetlight repaired near school zone.",
      location: "KK Nagar",
      time: "1 day ago",
      vote: 8,
      like: 1,
      comment: 2,
      issueid: "CIV-103",
      image: photo,
    },
  ];

  const [complaints, setComplaints] = useState(DEFAULT_COMPLAINTS);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return; // no token → keep default

        const response = await fetch(
          "https://quiz.selfmade.express/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        if (data?.complaints?.length > 0) {
          setComplaints(data.complaints);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        // fallback stays default
      }
    };

    fetchComplaints();
  }, []);

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
        {complaints.map((complaint) => (
          <Content
            key={complaint.id}
            status={complaint.status}
            counter={complaint.views}
            title={complaint.description}
            location={complaint.location}
            time={complaint.time}
            upvotes={complaint.vote}
            disvotes={complaint.like}
            comment={complaint.comment}
            issueid={complaint.issueid}
            image={complaint.image}
          />
        ))}
      </div>
    </section>
  );
}