function getLoggedInUser() {
    const userData = localStorage.getItem("loggedInUser");

    if (!userData) return null;

    try {
        return JSON.parse(userData);
    } catch {
        localStorage.removeItem("loggedInUser");
        return null;
    }
}

function protectAdminPage() {
    const user = getLoggedInUser();

    if (!user) {
        alert("You must login as admin to access this page.");
        window.location.href = "login.html";
        return false;
    }

    if (user.role !== "Admin") {
        alert("Access denied. Admins only.");
        window.location.href = "../index.html";
        return false;
    }

    return true;
}

function showAlert(message, type = "success") {
    const alertBox = document.getElementById("alertMessage");

    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `alert show ${type}`;

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 5000);
}

function clearErrors() {
    const errors = document.querySelectorAll(".form-group .error");

    errors.forEach(error => {
        error.textContent = "";
        error.classList.remove("show");
    });
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);

    if (!field) return;

    const formGroup = field.closest(".form-group");
    const errorBox = formGroup?.querySelector(".error");

    if (!errorBox) return;

    errorBox.textContent = message;
    errorBox.classList.add("show");
}

function getFieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : "";
}

function clearForm() {
    const fields = document.querySelectorAll("input, textarea, select");

    fields.forEach(field => {
        field.value = "";
    });
}

async function handleAddProperty() {
    clearErrors();

    const title = getFieldValue("title");
    const type = getFieldValue("type");
    const location = getFieldValue("location");
    const price = getFieldValue("price");
    const bedrooms = getFieldValue("bedrooms");
    const bathrooms = getFieldValue("bathrooms");
    const area = getFieldValue("area");
    const imageUrl = getFieldValue("imageUrl");
    const additionalImages = getFieldValue("additionalImages");
    const description = getFieldValue("description");

    let hasError = false;

    if (!title) {
        showFieldError("title", "Property title is required.");
        hasError = true;
    }

    if (!type) {
        showFieldError("type", "Property type is required.");
        hasError = true;
    }

    if (!location) {
        showFieldError("location", "Location is required.");
        hasError = true;
    }

    if (!price || Number(price) <= 0) {
        showFieldError("price", "Valid price is required.");
        hasError = true;
    }

    if (!bedrooms || Number(bedrooms) <= 0) {
        showFieldError("bedrooms", "Bedrooms are required.");
        hasError = true;
    }

    if (!bathrooms || Number(bathrooms) <= 0) {
        showFieldError("bathrooms", "Bathrooms are required.");
        hasError = true;
    }

    if (!area || Number(area) <= 0) {
        showFieldError("area", "Valid area is required.");
        hasError = true;
    }

    if (!imageUrl) {
        showFieldError("imageUrl", "Main image URL is required.");
        hasError = true;
    }

    if (!description) {
        showFieldError("description", "Description is required.");
        hasError = true;
    }

    if (hasError) return;

    const propertyData = {
        title: title,
        type: type,
        location: location,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: parseFloat(area),
        imageUrl: imageUrl,
        additionalImages: additionalImages,
        description: description,
        createdAt: new Date().toISOString()
    };

    try {
        await createProperty(propertyData);

        showAlert("✓ Property listed successfully!", "success");

        clearForm();

        setTimeout(() => {
            window.location.href = "manage-properties.html";
        }, 1200);

    } catch (error) {
        console.error("Failed to add property:", error);
        showAlert("✗ Failed to list property. Please make sure backend is running.", "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    protectAdminPage();
});