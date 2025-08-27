import "../css/home.css";
import { useState } from "react";

export default function Resolved() {
    const [resolvedReports, setResolvedReports] = useState(892);
    return (
        <div class="stat-card">
            <div class="stat-content">
                <div>
                    <p class="stat-label">Resolved</p>
                    <p class="stat-number resolved">{resolvedReports}</p>
                </div>
                <svg class="stat-icon resolved" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
            </div>
        </div>
    )
}
