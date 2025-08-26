import "../css/home.css"
function Category() {
    return (
        <div >
            <div class="category-tabs">
                <button class="btn btn-category active">All</button>
                <button class="btn btn-category">Roads</button>
                <button class="btn btn-category">Streetlights</button>
                <button class="btn btn-category">Drainage</button>
                <button class="btn btn-category">Other</button>
            </div>
            <div class="additional-filters">
                <span>All Districts</span>
                <span>Latest</span>
                <button class="map-view-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Map View
                </button>
            </div>
        </div>

    )
}
export default Category;