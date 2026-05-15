document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedProperties();
});

// Load featured properties on home page
async function loadFeaturedProperties() {
    const properties = await getProperties();
    const container = document.getElementById("featuredProperties");

    if (!container) return;

    container.innerHTML = "";

    if (!properties || properties.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; color: #999;'>No properties available yet.</p>";
        return;
    }

    // Show only first 3 properties
    properties.slice(0, 3).forEach(property => {
        const card = createPropertyCard(property);
        container.appendChild(card);
    });
}

function createPropertyCard(property) {
    const div = document.createElement("div");
    div.className = "card";
    const imageUrl = property.imageUrl || "https://via.placeholder.com/300x200?text=No+Image";
    const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(property.price || 0);

    div.innerHTML = `
        <img src="${imageUrl}" alt="${property.title}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="card-content">
            <h3>${property.title}</h3>
            <p>📍 ${property.location}</p>
            <p class="price">${price}</p>
            <p>🛏️ ${property.bedrooms} Beds | 🛁 ${property.bathrooms} Baths | 📐 ${property.area} sqft</p>
            <p style="font-size: 12px; color: #999;">${property.type || 'Property'}</p>
        </div>
    `;

    div.style.cursor = "pointer";
    div.onclick = () => goToPropertyDetails(property.id);

    return div;
}

function goToPropertyDetails(propertyId) {
    window.location.href = `pages/property-details.html?id=${propertyId}`;
}

// Search functionality
function searchProperties() {
    const searchTerm = document.getElementById("heroSearch")?.value.trim();
    if (searchTerm) {
        window.location.href = `pages/properties.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Allow Enter key in search box
document.getElementById("heroSearch")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchProperties();
});