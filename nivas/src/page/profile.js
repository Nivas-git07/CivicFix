import react from "react";
import Navbar from "../components/ui/nav";
import UserProfileCard from "../components/ui/profileuser";
import Report from "../components/ui/report";

import ProfilePage from "../components/ui/reportcontent";
export default function Profile() {
    return (
        <div>
            <Navbar />
            <main class="max-w-7xl mx-auto px-6 py-6">
                <UserProfileCard />
                <Report />
                <ProfilePage />





            </main>
        </div>

    )
}
