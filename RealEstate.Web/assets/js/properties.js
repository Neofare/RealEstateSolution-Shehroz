// Normalize text safely
function normalizeText(value) {
    return (value || "").toString().trim().toLowerCase();
}

// Load and filter properties
async function loadProperties() {
    try {
        const urlParams = new URLSearchParams(window.location.search);

        const type = normalizeText(urlParams.get("type"));
        const search = normalizeText(urlParams.get("search"));
        const bedrooms = urlParams.get("bedrooms");
        const maxPrice = urlParams.get("maxPrice");

        const allProperties = await getProperties();
        const container = document.getElementById("properties");

        container.innerHTML = "";

        syncFiltersWithUrl(type, bedrooms, maxPrice);

        if (!allProperties || allProperties.length === 0) {
            container.innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">
                    No properties are currently available.
                </p>
            `;
            updatePageTitle([]);
            return;
        }

        let filtered = allProperties;

        // Filter by property type
        if (type) {
            filtered = filtered.filter(p =>
                normalizeText(p.type) === type
            );
        }

        // Accurate SQL-backed frontend search
        if (search) {
            filtered = filtered.filter(p => {
                const title = normalizeText(p.title);
                const location = normalizeText(p.location);
                const propertyType = normalizeText(p.type);
                const description = normalizeText(p.description);

                return (
                    title.includes(search) ||
                    location.includes(search) ||
                    propertyType.includes(search) ||
                    description.includes(search)
                );
            });
        }

        // Filter by minimum bedrooms
        if (bedrooms) {
            const minBedrooms = parseInt(bedrooms);

            if (!isNaN(minBedrooms)) {
                filtered = filtered.filter(p =>
                    Number(p.bedrooms) >= minBedrooms
                );
            }
        }

        // Filter by maximum price
        if (maxPrice) {
            const max = parseFloat(maxPrice);

            if (!isNaN(max)) {
                filtered = filtered.filter(p =>
                    Number(p.price) <= max
                );
            }
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">
                    No properties match your search or filters.
                </p>
            `;
            updatePageTitle(filtered);
            return;
        }

        filtered.forEach(property => {
            const card = createPropertyCard(property);
            container.appendChild(card);
        });

        updatePageTitle(filtered);

    } catch (error) {
        console.error("Error loading properties:", error);

        document.getElementById("properties").innerHTML = `
            <p style="grid-column: 1/-1; color: red; text-align: center; padding: 40px;">
                Error loading properties from the backend. Please make sure the server is running.
            </p>
        `;
    }
}

function createPropertyCard(property) {
    const div = document.createElement("div");
    div.className = "card";

    const imageUrl = property.imageUrl || "https://via.placeholder.com/300x200?text=No+Image";

    const price = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(property.price || 0);

    div.innerHTML = `
        <img 
            src="${imageUrl}" 
            alt="${property.title || "Property Image"}" 
            onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
        >

        <div class="card-content">
            <h3>${property.title || "Untitled Property"}</h3>
            <p>📍 ${property.location || "Location not available"}</p>
            <p class="price">${price}</p>
            <p>
                🛏️ ${property.bedrooms || 0} Beds |
                🛁 ${property.bathrooms || 0} Baths |
                📐 ${property.area || 0} sqft
            </p>
            <p style="font-size: 12px; color: #999; text-transform: capitalize;">
                ${property.type || "Property"}
            </p>
        </div>
    `;

    div.style.cursor = "pointer";

    div.onclick = () => {
        goToPropertyDetails(property.id);
    };

    return div;
}

function goToPropertyDetails(propertyId) {
    window.location.href = `property-details.html?id=${propertyId}`;
}

function updatePageTitle(properties) {
    const pageTitle = document.getElementById("page-title");

    if (!pageTitle) return;

    const urlParams = new URLSearchParams(window.location.search);
    const type = normalizeText(urlParams.get("type"));
    const search = normalizeText(urlParams.get("search"));

    if (search) {
        pageTitle.textContent = `Search Results for "${search}" (${properties.length} found)`;
    } else if (type) {
        pageTitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Properties (${properties.length} found)`;
    } else {
        pageTitle.textContent = `All Properties (${properties.length} found)`;
    }
}

function filterProperties() {
    const bedrooms = document.getElementById("bedroomsFilter")?.value;
    const maxPrice = document.getElementById("priceFilter")?.value;
    const type = document.getElementById("typeFilter")?.value;

    const params = new URLSearchParams();

    if (type) params.append("type", type);
    if (bedrooms) params.append("bedrooms", bedrooms);
    if (maxPrice) params.append("maxPrice", maxPrice);

    const currentParams = new URLSearchParams(window.location.search);

    if (currentParams.has("search")) {
        const searchValue = currentParams.get("search")?.trim();

        if (searchValue) {
            params.append("search", searchValue);
        }
    }

    const queryString = params.toString();

    window.location.href = queryString
        ? `properties.html?${queryString}`
        : "properties.html";
}

function syncFiltersWithUrl(type, bedrooms, maxPrice) {
    const typeFilter = document.getElementById("typeFilter");
    const bedroomsFilter = document.getElementById("bedroomsFilter");
    const priceFilter = document.getElementById("priceFilter");

    if (typeFilter && type) {
        typeFilter.value = type;
    }

    if (bedroomsFilter && bedrooms) {
        bedroomsFilter.value = bedrooms;
    }

    if (priceFilter && maxPrice) {
        priceFilter.value = maxPrice;
    }
}

// Initialize properties only
document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
});