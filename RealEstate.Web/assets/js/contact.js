// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show field error
function showFieldError(index, message) {
    const group = document.querySelectorAll(".form-group")[index];
    const error = group.querySelector(".error");
    if (error) {
        error.textContent = message;
        error.classList.add("show");
    }
}

// Show alert banner
function showAlert(message, type = "success") {
    const alert = document.getElementById("alertMessage");
    alert.textContent = message;
    alert.className = `alert show ${type}`;
    setTimeout(() => alert.classList.remove("show"), 5000);
}

// Popup
function showPopup() {
    const popup = document.getElementById("successPopup");

    if (!popup) return;

    popup.classList.add("show");
    document.body.classList.add("popup-open");
}

function closePopup() {
    const popup = document.getElementById("successPopup");

    if (!popup) return;

    popup.classList.remove("show");
    document.body.classList.remove("popup-open");
}



// Send contact message
async function sendContact() {
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    // Clear previous errors
    document.querySelectorAll(".form-group .error").forEach(e => e.classList.remove("show"));

    // Validate — no empty fields
    let hasError = false;

    if (!name) {
        showFieldError(0, "Name is required.");
        hasError = true;
    }

    if (!email || !validateEmail(email)) {
        showFieldError(1, "A valid email address is required.");
        hasError = true;
    }

    if (!subject) {
        showFieldError(2, "Subject is required.");
        hasError = true;
    }

    if (!message) {
        showFieldError(3, "Message is required.");
        hasError = true;
    }

    if (hasError) return;

    // Build inquiry object matching your backend Inquiry model
    const inquiry = {
        name: name,
        email: email,
        message: `Subject: ${subject}\n\n${message}`,
        propertyId: 0
    };

    try {
        const response = await fetch("https://localhost:7144/api/Inquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inquiry)
        });

        if (response.ok) {
            // Clear form
            document.getElementById("contactName").value = "";
            document.getElementById("contactEmail").value = "";
            document.getElementById("contactSubject").value = "";
            document.getElementById("contactMessage").value = "";
            // Show success popup
            showPopup();
        } else {
            showAlert("✗ Failed to send message. Please try again.", "error");
        }

    } catch (error) {
        console.error("Contact form error:", error);
        showAlert("✗ Could not reach the server. Is your backend running?", "error");
    }
}

// Close popup when clicking outside the box
document.addEventListener("click", (e) => {
    const popup = document.getElementById("successPopup");
    if (e.target === popup) closePopup();
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});