function Content({ status, counter, title, discription, location, time, upvotes, disvotes, comment, issueid, image }) {
    return (
         
        <div class="issue-card">
            <div class="issue-image-container">
                <img
                    src={image ? `data:image/png;base64,${image}` : "https://via.placeholder.com/400x250"}
                    alt={title}
                    className="issue-image"
                />
                <div class="status-badge progress">{status}</div>
                <div class="image-counter">{counter}</div>
            </div>

            <div class="issue-content">
                <h3 class="issue-title">{title}</h3>
                <p class="issue-description">{discription}</p>

                <div class="issue-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {location}
                </div>

                <div class="issue-time">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    {time} ago
                </div>

                <div class="issue-actions">
                    <div class="action-buttons">
                        <button class="action-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M7 10v12l5-3 5 3V10"></path>
                                <path d="M9 2h6a2 2 0 0 1 2 2v5l-3-2.5L11 9V4a2 2 0 0 1 2-2Z"></path>
                            </svg>
                            {upvotes}
                        </button>
                        <button class="action-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 14V2"></path>
                                <path d="M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path>
                            </svg>
                            {disvotes}
                        </button>
                        <button class="action-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            {comment}
                        </button>
                    </div>
                    <div class="issue-meta">
                        <button class="share-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16,6 12,2 8,6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                        </button>
                        <span class="issue-id">{issueid}</span>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
export default Content;