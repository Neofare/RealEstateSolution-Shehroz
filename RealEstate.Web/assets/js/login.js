// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

// Handle login
function handleLogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate inputs
    let hasError = false;
    const errors = document.querySelectorAll(".form-group .error");
    errors.forEach(err => err.classList.remove("show"));

    if (!email || !validateEmail(email)) {
        document.querySelectorAll(".form-group")[0].querySelector(".error").textContent = "Valid email is required";
        document.querySelectorAll(".form-group")[0].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (!password || password.length < 6) {
        document.querySelectorAll(".form-group")[1].querySelector(".error").textContent = "Password must be at least 6 characters";
        document.querySelectorAll(".form-group")[1].querySelector(".error").classList.add("show");
        hasError = true;
    }

    if (hasError) return;

    // For demo purposes, we'll use localStorage
    // In production, this should authenticate with a backend API
    const mockUser = {
        id: 1,
        name: email.split("@")[0],
        email: email,
        createdAt: new Date()
    };

    saveUser(mockUser);
    showAlert("✓ Login successful! Redirecting...", "success");

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1500);
}

// Allow Enter key to submit
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && document.getElementById("password")) {
        handleLogin();
    }
});