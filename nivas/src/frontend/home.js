import Navbar from "../components/ui/nav";
import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../components/css/home.css";
import Banner from "../components/ui/banner";
import Search from "../components/ui/search";
import Report from "../components/ui/report";



export default function Home() {
    return (
        <div class="min-h-screen bg-gray-50">
            <Navbar />
            <Banner />
            <main class="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8 py-8">
                <Search />
                <Report />
            </main>
        </div>


    )
}
