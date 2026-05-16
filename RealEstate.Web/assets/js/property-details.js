// Load property details
async function loadPropertyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("id");

    if (!propertyId) {
        document.getElementById("propertyContainer").innerHTML = `
            <p style="text-align: center; padding: 40px; color: #999;">
                Property not found.
            </p>
        `;
        return;
    }

    try {
        const property = await getPropertyById(propertyId);

        if (!property) {
            document.getElementById("propertyContainer").innerHTML = `
                <p style="text-align: center; padding: 40px; color: #999;">
                    Property not found.
                </p>
            `;
            return;
        }

        displayPropertyDetail(property);

    } catch (error) {
        console.error("Error loading property:", error);

        document.getElementById("propertyContainer").innerHTML = `
            <p style="text-align: center; padding: 40px; color: red;">
                Error loading property. Please make sure the backend is running.
            </p>
        `;
    }
}

function displayPropertyDetail(property) {
    const imageUrl = property.imageUrl || "https://via.placeholder.com/1000x500?text=No+Image";

    const price = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(property.price || 0);

    const html = `
        <div class="property-detail">
            <img 
                src="${imageUrl}" 
                alt="${property.title || "Property Image"}" 
                class="property-detail-image" 
                onerror="this.src='https://via.placeholder.com/1000x500?text=No+Image'"
            >

            <div class="property-detail-content">
                <h1>${property.title || "Untitled Property"}</h1>

                <div class="property-detail-price">
                    ${price}
                </div>

                <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
                    📍 ${property.location || "Location not available"}
                </p>

                <div class="property-detail-info">
                    <div class="info-item">
                        <h3>Property Type</h3>
                        <p>${property.type || "N/A"}</p>
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

                <h2 style="margin-top: 30px; margin-bottom: 15px;">
                    Description
                </h2>

                <div class="property-detail-description">
                    ${property.description || "No description available."}
                </div>

                <div class="inquiry-form">
                    <h2 style="margin-bottom: 20px;">
                        Interested in this property?
                    </h2>

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
                        <button type="button" onclick="submitPropertyInquiry(${property.id})">
                            Send Inquiry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("propertyContainer").innerHTML = html;

    autofillInquiryForm();
}

function autofillInquiryForm() {
    const userData = localStorage.getItem("loggedInUser");

    if (!userData) return;

    try {
        const user = JSON.parse(userData);

        const nameInput = document.getElementById("inquiryName");
        const emailInput = document.getElementById("inquiryEmail");

        if (nameInput && (user.fullName || user.name)) {
            nameInput.value = user.fullName || user.name;
        }

        if (emailInput && user.email) {
            emailInput.value = user.email;
        }

    } catch (error) {
        console.error("Invalid logged in user data:", error);
    }
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show inquiry alert
function showInquiryAlert(message, type = "success") {
    const alert = document.getElementById("inquiryAlert");

    if (!alert) return;

    alert.textContent = message;
    alert.className = `alert show ${type}`;

    setTimeout(() => {
        alert.classList.remove("show");
    }, 5000);
}

// Clear inquiry errors
function clearInquiryErrors() {
    const errors = document.querySelectorAll(".inquiry-form .error");

    errors.forEach(err => {
        err.textContent = "";
        err.classList.remove("show");
    });
}

// Show specific field error
function showFieldError(index, message) {
    const groups = document.querySelectorAll(".inquiry-form .form-group");
    const errorBox = groups[index]?.querySelector(".error");

    if (!errorBox) return;

    errorBox.textContent = message;
    errorBox.classList.add("show");
}

// Submit inquiry
async function submitPropertyInquiry(propertyId) {
    const name = document.getElementById("inquiryName").value.trim();
    const email = document.getElementById("inquiryEmail").value.trim();
    const message = document.getElementById("inquiryMessage").value.trim();

    clearInquiryErrors();

    let hasError = false;

    if (!name) {
        showFieldError(0, "Name is required");
        hasError = true;
    }

    if (!email || !validateEmail(email)) {
        showFieldError(1, "Valid email is required");
        hasError = true;
    }

    if (!message) {
        showFieldError(2, "Message is required");
        hasError = true;
    }

    if (hasError) return;

    const inquiry = {
        name: name,
        email: email,
        message: message,
        propertyId: parseInt(propertyId)
    };

    try {
        await sendInquiry(inquiry);

        showInquiryAlert(
            "✓ Inquiry sent successfully! We'll contact you soon.",
            "success"
        );

        document.getElementById("inquiryMessage").value = "";

    } catch (error) {
        console.error("Error submitting inquiry:", error);

        showInquiryAlert(
            "✗ Failed to send inquiry. Please make sure the backend is running.",
            "error"
        );
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadPropertyDetails();
});