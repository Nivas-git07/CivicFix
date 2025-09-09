import React, { useEffect, useState } from "react";
import Content from "./content";

export default function ReportCard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setComplaints(data.complaints);
        console.log(data.complaints);

      } catch (error) {
        console.error("Error fetching complaints:", error);
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
