// Update navbar
function updateNavbar() {
    const user = getUser();
    const navAuth = document.getElementById("navAuth");

    if (!user) {
        window.location.href = "login.html";
        return;
    }

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

// Show alert
function showAlert(message, type = 'success') {
    const alert = document.getElementById("alertMessage");
    alert.textContent = message;
    alert.className = `alert show ${type}`;
    if (type === 'success') {
        setTimeout(() => {
            alert.classList.remove("show");
        }, 5000);
    }
}

// Handle add property
async function handleAddProperty() {
    const title = document.getElementById("title").value.trim();
    const type = document.getElementById("type").value.trim();
    const location = document.getElementById("location").value.trim();
    const price = document.getElementById("price").value.trim();
    const bedrooms = document.getElementById("bedrooms").value.trim();
    const bathrooms = document.getElementById("bathrooms").value.trim();
    const area = document.getElementById("area").value.trim();
    const imageUrl = document.getElementById("imageUrl").value.trim();
    const description = document.getElementById("description").value.trim();

    // Validate inputs
    let hasError = false;
    const errors = document.querySelectorAll(".form-group .error");
    errors.forEach(err => err.classList.remove("show"));

    if (!title) {
        document.querySelectorAll(".form-group")[0].querySelector(".error").textContent = "Title is required";
        document.querySelectorAll(".form-group")[0].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!type) {
        document.querySelectorAll(".form-group")[1].querySelector(".error").textContent = "Type is required";
        document.querySelectorAll(".form-group")[1].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!location) {
        document.querySelectorAll(".form-group")[2].querySelector(".error").textContent = "Location is required";
        document.querySelectorAll(".form-group")[2].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!price || price <= 0) {
        document.querySelectorAll(".form-group")[3].querySelector(".error").textContent = "Valid price is required";
        document.querySelectorAll(".form-group")[3].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!bedrooms) {
        document.querySelectorAll(".form-group")[4].querySelector(".error").textContent = "Bedrooms is required";
        document.querySelectorAll(".form-group")[4].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!bathrooms) {
        document.querySelectorAll(".form-group")[5].querySelector(".error").textContent = "Bathrooms is required";
        document.querySelectorAll(".form-group")[5].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!area || area <= 0) {
        document.querySelectorAll(".form-group")[6].querySelector(".error").textContent = "Valid area is required";
        document.querySelectorAll(".form-group")[6].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!imageUrl) {
        document.querySelectorAll(".form-group")[7].querySelector(".error").textContent = "Image URL is required";
        document.querySelectorAll(".form-group")[7].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!description) {
        document.querySelectorAll(".form-group")[8].querySelector(".error").textContent = "Description is required";
        document.querySelectorAll(".form-group")[8].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (hasError) return;

    try {
        const property = {
            title: title,
            type: type,
            location: location,
            price: parseFloat(price),
            bedrooms: parseInt(bedrooms),
            bathrooms: parseInt(bathrooms),
            area: parseFloat(area),
            imageUrl: imageUrl,
            description: description,
            createdAt: new Date()
        };

        // Create property via API
        const response = await fetch("https://localhost:7144/api/property", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(property)
        });

        if (!response.ok) {
            throw new Error("Failed to create property");
        }

        const result = await response.json();
        showAlert("✓ Property listed successfully!", "success");

        // Clear form
        document.querySelectorAll("input, textarea, select").forEach(el => {
            if (el.type !== "button") el.value = "";
        });

        setTimeout(() => {
            window.location.href = "properties.html";
        }, 2000);
    } catch (error) {
        console.error("Error:", error);
        showAlert("✗ Failed to list property. Please try again.", "error");
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});