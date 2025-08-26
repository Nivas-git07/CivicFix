import "../css/home.css"
import React from "react";

function Banner() {
    return (
        <div class="banner">
            <div class="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8 py-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="banner-icon">
                            <div class="banner-icon-inner"></div>
                        </div>
                        <span class="banner-text">
                            Join CivicFix to report and track civic issues in your community
                        </span>
                    </div>
                    <button class="btn btn-primary">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Banner;