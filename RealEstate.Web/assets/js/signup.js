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
function showAlert(message, type = "success") {
    const alert = document.getElementById("alertMessage");

    alert.textContent = message;
    alert.className = `alert show ${type}`;

    setTimeout(() => {
        alert.classList.remove("show");
    }, 5000);
}

// Handle signup
async function handleSignup() {

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const terms = document.getElementById("terms").checked;

    let hasError = false;

    const errors = document.querySelectorAll(".form-group .error");

    errors.forEach(err => {
        err.textContent = "";
        err.classList.remove("show");
    });

    // Full name validation
    if (!fullname || fullname.length < 3) {
        document.querySelectorAll(".form-group")[0]
            .querySelector(".error").textContent =
            "Full name must be at least 3 characters";

        document.querySelectorAll(".form-group")[0]
            .querySelector(".error").classList.add("show");

        hasError = true;
    }

    // Email validation
    if (!email || !validateEmail(email)) {
        document.querySelectorAll(".form-group")[1]
            .querySelector(".error").textContent =
            "Valid email is required";

        document.querySelectorAll(".form-group")[1]
            .querySelector(".error").classList.add("show");

        hasError = true;
    }

    // Phone validation
    if (!phone || !validatePhone(phone)) {
        document.querySelectorAll(".form-group")[2]
            .querySelector(".error").textContent =
            "Valid phone number is required";

        document.querySelectorAll(".form-group")[2]
            .querySelector(".error").classList.add("show");

        hasError = true;
    }

    // Password validation
    if (!password || password.length < 6) {
        document.querySelectorAll(".form-group")[3]
            .querySelector(".error").textContent =
            "Password must be at least 6 characters";

        document.querySelectorAll(".form-group")[3]
            .querySelector(".error").classList.add("show");

        hasError = true;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        document.querySelectorAll(".form-group")[4]
            .querySelector(".error").textContent =
            "Passwords do not match";

        document.querySelectorAll(".form-group")[4]
            .querySelector(".error").classList.add("show");

        hasError = true;
    }

    // Terms validation
    if (!terms) {
        showAlert("✗ You must agree to the Terms and Conditions", "error");
        hasError = true;
    }

    if (hasError) return;

    try {

        const response = await fetch(API.authRegister, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullname,
                email: email,
                phone: phone,
                password: password
            })
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            showAlert(
                "✗ " + (result?.message || result || "Signup failed."),
                "error"
            );
            return;
        }

        // Save logged in user
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(result.user)
        );

        showAlert(
            "✓ Account created successfully! Redirecting...",
            "success"
        );

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {

        console.error(error);

        showAlert(
            "✗ Server error. Make sure backend is running.",
            "error"
        );
    }
}

// Allow Enter key to submit
document.addEventListener("keypress", (e) => {

    if (e.key === "Enter" &&
        document.getElementById("confirm-password")) {

        handleSignup();
    }
});