// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

// Handle login
async function handleLogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let hasError = false;
    const errors = document.querySelectorAll(".form-group .error");

    errors.forEach(err => {
        err.textContent = "";
        err.classList.remove("show");
    });

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

    try {
        const response = await fetch(API.authLogin, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            showAlert("✗ " + (result?.message || result || "Invalid email or password."), "error");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(result.user));

        showAlert("✓ Login successful! Redirecting...", "success");

        setTimeout(() => {
            if (result.user.role === "Admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "../index.html";
            }
        }, 1500);

    } catch (error) {
        console.error(error);
        showAlert("✗ Server error. Make sure backend is running.", "error");
    }
}

// Allow Enter key to submit
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && document.getElementById("password")) {
        handleLogin();
    }
});