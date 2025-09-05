import react from "react";
import Navbar from "../components/ui/nav";
import UserProfileCard from "../components/ui/profileuser";
import Report from "../components/ui/report";
export default function Profile(){
    return(
        <div>
        <Navbar />
        <main class="max-w-7xl mx-auto px-6 py-6">
            <UserProfileCard />
            <section class="border border-gray-300 shadow-md rounded-lg overflow-hidden">
                <Report />
                
                
            </section>

        </main>
        </div>

    )
}
