import Navbar from "../components/ui/nav";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../components/css/home.css";
import Banner from "../components/ui/banner";
import Search from "../components/ui/search";
import Report from "../components/ui/report";
import Content from "../components/ui/content";
import drain from "../components/image/drain.jpeg";
const defaultComplaints = [
  {
    id: 1,
    status: "Pending",
    views: 124,
    title: "Large Pothole Near Bus Stop",
    description: "Deep pothole causing traffic jams and bike accidents.",
    location: "Anna Nagar, Madurai",
    time: "2 hours ago",
    vote: 32,
    like: 4,
    comment: 6,
    complaint_id: "CIV-1001",
    image: "https://images.unsplash.com/photo-1600320254374-ce2d293c324e",
  },
  {
    id: 2,
    status: "In Progress",
    views: 210,
    title: "Garbage Overflowing in Market Area",
    description: "Trash not cleared for 3 days. Bad smell spreading.",
    location: "Periyar Bus Stand",
    time: "5 hours ago",
    vote: 48,
    like: 3,
    comment: 12,
    complaint_id: "CIV-1002",
    image: "https://images.unsplash.com/photo-1581579185169-1f1b9a6e13b6",
  },
  {
    id: 3,
    status: "Resolved",
    views: 89,
    title: "Streetlight Not Working",
    description: "Streetlight near school not functioning at night.",
    location: "KK Nagar",
    time: "1 day ago",
    vote: 15,
    like: 2,
    comment: 3,
    complaint_id: "CIV-1003",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  },
  {
    id: 4,
    status: "Pending",
    views: 300,
    title: "Drainage Water Leakage",
    description: "Open drainage leaking near residential street.",
    location: "Simmakkal",
    time: "30 minutes ago",
    vote: 65,
    like: 5,
    comment: 20,
    complaint_id: "CIV-1004",
    image: "https://images.unsplash.com/photo-1597006023440-7d3f45c7b2c1",
  },
];

export default function Home() {
  const [complaints, setComplaints] = useState([]);
 console.log(drain)
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://quiz.selfmade.express/complaints", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched complaints:", data);
        setComplaints(data);
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error);
      });
  }, []);

  return (
    <div class="min-h-screen bg-gray-50">
      <Navbar />
      <Banner />
      <main class="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8 py-8">
        <Search />
        <Report />
        <div className="issues-grid">
          {defaultComplaints.map((c) => (
            <Content
              key={c.id}
              status={c.status}
              counter={c.views}
              title={c.title}
              discription={c.description}
              location={c.location}
              time={c.time}
              upvotes={c.vote}
              disvotes={c.like}
              comment={c.comment}
              issueid={c.complaint_id}
              image={drain}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
