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

// Load property details
async function loadPropertyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("id");

    if (!propertyId) {
        document.getElementById("propertyContainer").innerHTML = "<p style='text-align: center; padding: 40px; color: #999;'>Property not found.</p>";
        return;
    }

    try {
        const property = await getPropertyById(propertyId);
        if (!property) {
            document.getElementById("propertyContainer").innerHTML = "<p style='text-align: center; padding: 40px; color: #999;'>Property not found.</p>";
            return;
        }

        displayPropertyDetail(property);
    } catch (error) {
        console.error("Error loading property:", error);
        document.getElementById("propertyContainer").innerHTML = "<p style='text-align: center; padding: 40px; color: red;'>Error loading property.</p>";
    }
}

function displayPropertyDetail(property) {
    const imageUrl = property.imageUrl || "https://via.placeholder.com/1000x500?text=No+Image";
    const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(property.price || 0);

    const html = `
        <div class="property-detail">
            <img src="${imageUrl}" alt="${property.title}" class="property-detail-image" onerror="this.src='https://via.placeholder.com/1000x500?text=No+Image'">

            <div class="property-detail-content">
                <h1>${property.title}</h1>
                <div class="property-detail-price">${price}</div>
                <p style="color: #666; font-size: 16px; margin-bottom: 20px;">📍 ${property.location}</p>

                <div class="property-detail-info">
                    <div class="info-item">
                        <h3>Property Type</h3>
                        <p>${property.type || 'N/A'}</p>
                    </div>
                    <div class="info-item">
                        <h3>Area</h3>
                        <p>${property.area || 0} sqft</p>
                    </div>
                    <div class="info-item">
                        <h3>Bedrooms</h3>
                        <p>${property.bedrooms || 0}</p>
                    </div>
                    <div class="info-item">
                        <h3>Bathrooms</h3>
                        <p>${property.bathrooms || 0}</p>
                    </div>
                </div>

                <h2 style="margin-top: 30px; margin-bottom: 15px;">Description</h2>
                <div class="property-detail-description">
                    ${property.description || 'No description available.'}
                </div>

                <div class="inquiry-form">
                    <h2 style="margin-bottom: 20px;">Interested in this property?</h2>
                    <div id="inquiryAlert" class="alert"></div>

                    <div class="form-group">
                        <label for="inquiryName">Your Name *</label>
                        <input id="inquiryName" type="text" placeholder="John Doe">
                        <div class="error"></div>
                    </div>

                    <div class="form-group">
                        <label for="inquiryEmail">Your Email *</label>
                        <input id="inquiryEmail" type="email" placeholder="john@example.com">
                        <div class="error"></div>
                    </div>

                    <div class="form-group">
                        <label for="inquiryMessage">Message *</label>
                        <textarea id="inquiryMessage" placeholder="Tell us more about your interest..."></textarea>
                        <div class="error"></div>
                    </div>

                    <div class="form-group">
                        <button onclick="submitPropertyInquiry(${property.id})">Send Inquiry</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("propertyContainer").innerHTML = html;
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show alert
function showAlert(message, type = 'success') {
    const alert = document.getElementById("inquiryAlert");
    if (!alert) return;
    alert.textContent = message;
    alert.className = `alert show ${type}`;
    setTimeout(() => {
        alert.classList.remove("show");
    }, 5000);
}

// Submit inquiry
async function submitPropertyInquiry(propertyId) {
    const name = document.getElementById("inquiryName").value.trim();
    const email = document.getElementById("inquiryEmail").value.trim();
    const message = document.getElementById("inquiryMessage").value.trim();

    // Validate
    let hasError = false;
    const errors = document.querySelectorAll(".inquiry-form .error");
    errors.forEach(err => err.classList.remove("show"));

    if (!name) {
        document.querySelectorAll(".inquiry-form .form-group")[0].querySelector(".error").textContent = "Name is required";
        document.querySelectorAll(".inquiry-form .form-group")[0].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!email || !validateEmail(email)) {
        document.querySelectorAll(".inquiry-form .form-group")[1].querySelector(".error").textContent = "Valid email is required";
        document.querySelectorAll(".inquiry-form .form-group")[1].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!message) {
        document.querySelectorAll(".inquiry-form .form-group")[2].querySelector(".error").textContent = "Message is required";
        document.querySelectorAll(".inquiry-form .form-group")[2].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (hasError) return;

    try {
        const inquiry = {
            name: name,
            email: email,
            message: message,
            propertyId: propertyId
        };

        const result = await submitInquiry(inquiry);
        if (result) {
            showAlert("✓ Inquiry sent successfully! We'll contact you soon.", "success");
            document.getElementById("inquiryName").value = "";
            document.getElementById("inquiryEmail").value = "";
            document.getElementById("inquiryMessage").value = "";
        } else {
            showAlert("✗ Failed to send inquiry. Please try again.", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showAlert("✗ An error occurred. Please try again.", "error");
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    loadPropertyDetails();
});