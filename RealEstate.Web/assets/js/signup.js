// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone format
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

// Show alert
function showAlert(message, type = 'success') {
    const alert = document.getElementById("alertMessage");
    alert.textContent = message;
    alert.className = `alert show ${type}`;
    setTimeout(() => {
        alert.classList.remove("show");
    }, 5000);
}

// Handle signup
function handleSignup() {
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const terms = document.getElementById("terms").checked;

    // Validate inputs
    let hasError = false;
    const errors = document.querySelectorAll(".form-group .error");
    errors.forEach(err => err.classList.remove("show"));

    if (!fullname || fullname.length < 3) {
        document.querySelectorAll(".form-group")[0].querySelector(".error").textContent = "Full name must be at least 3 characters";
        document.querySelectorAll(".form-group")[0].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!email || !validateEmail(email)) {
        document.querySelectorAll(".form-group")[1].querySelector(".error").textContent = "Valid email is required";
        document.querySelectorAll(".form-group")[1].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!phone || !validatePhone(phone)) {
        document.querySelectorAll(".form-group")[2].querySelector(".error").textContent = "Valid phone number is required";
        document.querySelectorAll(".form-group")[2].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!password || password.length < 6) {
        document.querySelectorAll(".form-group")[3].querySelector(".error").textContent = "Password must be at least 6 characters";
        document.querySelectorAll(".form-group")[3].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.querySelectorAll(".form-group")[4].querySelector(".error").textContent = "Passwords do not match";
        document.querySelectorAll(".form-group")[4].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!terms) {
        showAlert("✗ You must agree to the Terms and Conditions", "error");
        hasError = true;
    }

    if (hasError) return;

    // For demo purposes, we'll use localStorage
    // In production, this should register with a backend API
    const newUser = {
        id: Date.now(),
        name: fullname,
        email: email,
        phone: phone,
        createdAt: new Date()
    };

    saveUser(newUser);
    showAlert("✓ Account created successfully! Redirecting...", "success");

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1500);
}

// Allow Enter key to submit
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && document.getElementById("confirm-password")) {
        handleSignup();
    }
});