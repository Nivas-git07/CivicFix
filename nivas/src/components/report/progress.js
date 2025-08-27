import "../css/home.css";
import { useState } from "react";


export default function Progress() {
    const [inProgressReports, setInProgressReports] = useState(234);
    return (
        <div class="stat-card">
            <div class="stat-content">
                <div>
                    <p class="stat-label">In Progress</p>
                    <p class="stat-number progress">{inProgressReports}</p>
                </div>
                <svg class="stat-icon progress" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
            </div>
        </div>
    )
}
