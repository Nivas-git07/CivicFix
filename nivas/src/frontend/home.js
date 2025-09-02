import Navbar from "../components/ui/nav";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../components/css/home.css";
import Banner from "../components/ui/banner";
import Search from "../components/ui/search";
import Report from "../components/ui/report";
import Content from "../components/ui/content";




export default function Home() {
    const [complaints, setComplaints] = useState([]); // <-- array, not string

    useEffect(() => {
        fetch("http://localhost:5000/api/complaints")
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
                <div class="issues-grid">
                    {complaints.map((c) => (
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
                            image={c.image}
                        />
                    ))}
                </div>
            </main>
        </div>


    )
}

