import "../css/home.css";


export default function Open() {
    return (
        <div class="stat-card">
            <div class="stat-content">
                <div>
                    <p class="stat-label">Open</p>
                    <p class="stat-number open">121</p>
                </div>
                <svg class="stat-icon open" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
        </div>


    )
}
