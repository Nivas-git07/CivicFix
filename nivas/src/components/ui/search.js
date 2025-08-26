import "../css/home.css"
import React from "react";
import Category from "./category";

function Search() {
    return (
        <div class="mb-8">
            <div class="search-container">
                
                <div class="search-wrapper">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" placeholder="Search by keyword or location ..." class="search-input" />
                </div>

                
                <button class="btn btn-outline filter-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
                    </svg>
                    Filter
                </button>
            </div>
        <Category />
        </div>
            )
}
export default Search;