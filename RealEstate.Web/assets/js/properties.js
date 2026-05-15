// Update navbar
function updateNavbar() {
    const user = getUser();
    const navAuth = document.getElementById("navAuth");

    if (user) {
        navAuth.innerHTML = `
            <div class="user-menu">
                <button onclick="toggleDropdown()">👤 ${user.name}</button>
                <div class="dropdown" id="userDropdown">
                    <a href="add-property.html">+ Add Property</a>
                    <button onclick="logout()">Logout</button>
                </div>
            </div>
        `;
    } else {
        navAuth.innerHTML = `
            <div class="auth-buttons">
                <a href="login.html" class="login-btn">Login</a>
                <a href="signup.html" class="signup-btn">Sign Up</a>
            </div>
        `;
    }
}

function toggleDropdown() {
    const dropdown = document.getElementById("userDropdown");
    dropdown?.classList.toggle("active");
}

document.addEventListener("click", (e) => {
    const userMenu = document.querySelector(".user-menu");
    if (!userMenu?.contains(e.target)) {
        document.getElementById("userDropdown")?.classList.remove("active");
    }
});

// Load and filter properties
async function loadProperties() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");
        const search = urlParams.get("search");
        const bedrooms = urlParams.get("bedrooms");
        const maxPrice = urlParams.get("maxPrice");

        const allProperties = await getProperties();
        const container = document.getElementById("properties");

        container.innerHTML = "";

        if (!allProperties || allProperties.length === 0) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px; color: #999;'>No properties found.</p>";
            updatePageTitle(allProperties);
            return;
        }

        // Apply filters
        let filtered = allProperties;

        if (type) {
            filtered = filtered.filter(p => p.type?.toLowerCase() === type.toLowerCase());
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.title?.toLowerCase().includes(searchLower) ||
                p.location?.toLowerCase().includes(searchLower) ||
                p.type?.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower)
            );
        }

        if (bedrooms) {
            filtered = filtered.filter(p => p.bedrooms >= parseInt(bedrooms));
        }

        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
        }

        if (filtered.length === 0) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px; color: #999;'>No properties match your criteria.</p>";
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
        document.getElementById("properties").innerHTML =
            "<p style='grid-column: 1/-1; color: red; text-align: center; padding: 40px;'>Error loading properties. Please try again.</p>";
    }
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
    window.location.href = `property-details.html?id=${propertyId}`;
}

function updatePageTitle(properties) {
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");
        const search = urlParams.get("search");

        if (search) {
            pageTitle.textContent = `Search Results for "${search}" (${properties.length} found)`;
        } else if (type) {
            pageTitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Properties (${properties.length} found)`;
        } else {
            pageTitle.textContent = `All Properties (${properties.length} found)`;
        }
    }
}

function filterProperties() {
    const bedrooms = document.getElementById("bedroomsFilter")?.value;
    const maxPrice = document.getElementById("priceFilter")?.value;
    const type = document.getElementById("typeFilter")?.value;

    const params = new URLSearchParams();
    if (bedrooms) params.append("bedrooms", bedrooms);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (type) params.append("type", type);

    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has("search")) params.append("search", currentParams.get("search"));

    window.location.href = `properties.html?${params.toString()}`;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    loadProperties();
});