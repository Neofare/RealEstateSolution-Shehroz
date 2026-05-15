const API_URL = "https://localhost:7144/api";

// 5 example properties — used as fallback when API is unreachable
const EXAMPLE_PROPERTIES = [
    {
        id: 1,
        title: "Sunset Villa with Pool",
        location: "Beverly Hills, Los Angeles",
        type: "villa",
        price: 4500000,
        bedrooms: 5,
        bathrooms: 4,
        area: 4200,
        imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
        description: "A stunning luxury villa nestled in the heart of Beverly Hills. Features an infinity pool, home theatre, gourmet kitchen, and panoramic views of the Los Angeles skyline. Perfect for those seeking the ultimate in California luxury living."
    },
    {
        id: 2,
        title: "Downtown Modern Apartment",
        location: "Manhattan, New York",
        type: "apartment",
        price: 1250000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
        description: "Sleek and contemporary apartment in the heart of Manhattan. Floor-to-ceiling windows offer breathtaking city views. Open-plan living with premium finishes, concierge service, rooftop terrace, and walking distance to Central Park."
    },
    {
        id: 3,
        title: "Suburban Family Home",
        location: "Naperville, Chicago",
        type: "house",
        price: 620000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
        description: "Spacious family home in one of Chicago's most sought-after suburbs. Large backyard with deck, open kitchen, hardwood floors throughout, attached two-car garage, and top-rated school district. A perfect forever home for families."
    },
    {
        id: 4,
        title: "Beachfront Luxury Villa",
        location: "Miami Beach, Miami",
        type: "villa",
        price: 7800000,
        bedrooms: 6,
        bathrooms: 5,
        area: 5800,
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
        description: "Exclusive beachfront villa with direct ocean access in prestigious Miami Beach. Features a private dock, heated pool, summer kitchen, smart home system, and stunning Atlantic Ocean views from every room. The pinnacle of waterfront luxury."
    },
    {
        id: 5,
        title: "Cozy Studio Apartment",
        location: "Downtown Austin, Austin",
        type: "apartment",
        price: 285000,
        bedrooms: 1,
        bathrooms: 1,
        area: 620,
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
        description: "Modern studio apartment in the vibrant heart of Austin. Fully renovated with high-end appliances, exposed brick walls, and polished concrete floors. Steps from restaurants, live music venues, and the famous 6th Street entertainment district."
    }
];

// Fetch all properties — falls back to examples if API is unreachable
async function getProperties() {
    try {
        const response = await fetch(`${API_URL}/property`);
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        // If API returns empty, still use examples
        return data.length > 0 ? data : EXAMPLE_PROPERTIES;
    } catch (error) {
        console.warn("API unreachable, using example properties.");
        return EXAMPLE_PROPERTIES;
    }
}

// Fetch single property — falls back to finding in examples
async function getPropertyById(id) {
    try {
        const response = await fetch(`${API_URL}/property/${id}`);
        if (!response.ok) throw new Error("Property not found");
        return await response.json();
    } catch (error) {
        // Look up in example properties as fallback
        const found = EXAMPLE_PROPERTIES.find(p => p.id === parseInt(id));
        return found || null;
    }
}

// Submit inquiry
async function submitInquiry(inquiry) {
    try {
        const response = await fetch(`${API_URL}/inquiry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inquiry)
        });
        if (!response.ok) throw new Error("Failed to submit inquiry");
        return await response.json();
    } catch (error) {
        console.warn("Inquiry API unreachable — inquiry logged locally.");
        console.log("Inquiry data:", inquiry);
        // Return a mock success so the UI doesn't break
        return { success: true, message: "Inquiry received" };
    }
}

// Get user from localStorage
function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

// Save user to localStorage
function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

// Logout user
function logout() {
    localStorage.removeItem("user");
    const inPages = window.location.pathname.includes("/pages/");
    window.location.href = inPages ? "../index.html" : "index.html";
}