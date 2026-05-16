let currentPropertyId = null;
let currentProperty = null;

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
    }, 4000);
}

function clearErrors() {
    const errors = document.querySelectorAll(".form-group .error");

    errors.forEach(error => {
        error.textContent = "";
        error.classList.remove("show");
    });
}

function showFieldError(index, message) {
    const groups = document.querySelectorAll(".form-group");
    const errorBox = groups[index]?.querySelector(".error");

    if (!errorBox) return;

    errorBox.textContent = message;
    errorBox.classList.add("show");
}

async function loadPropertyForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    currentPropertyId = urlParams.get("id");

    if (!currentPropertyId) {
        showAlert("Property ID is missing.", "error");
        return;
    }

    try {
        currentProperty = await getPropertyById(currentPropertyId);

        if (!currentProperty) {
            showAlert("Property not found.", "error");
            return;
        }

        document.getElementById("title").value = currentProperty.title || "";
        document.getElementById("type").value = currentProperty.type || "";
        document.getElementById("location").value = currentProperty.location || "";
        document.getElementById("price").value = currentProperty.price || "";
        document.getElementById("bedrooms").value = currentProperty.bedrooms || "";
        document.getElementById("bathrooms").value = currentProperty.bathrooms || "";
        document.getElementById("area").value = currentProperty.area || "";
        document.getElementById("imageUrl").value = currentProperty.imageUrl || "";
        document.getElementById("description").value = currentProperty.description || "";

    } catch (error) {
        console.error("Failed to load property:", error);
        showAlert("Failed to load property. Make sure backend is running.", "error");
    }
}

async function handleUpdateProperty() {
    clearErrors();

    const title = document.getElementById("title").value.trim();
    const type = document.getElementById("type").value.trim();
    const location = document.getElementById("location").value.trim();
    const price = document.getElementById("price").value;
    const bedrooms = document.getElementById("bedrooms").value;
    const bathrooms = document.getElementById("bathrooms").value;
    const area = document.getElementById("area").value;
    const imageUrl = document.getElementById("imageUrl").value.trim();
    const description = document.getElementById("description").value.trim();

    let hasError = false;

    if (!title) {
        showFieldError(0, "Property title is required.");
        hasError = true;
    }

    if (!type) {
        showFieldError(1, "Property type is required.");
        hasError = true;
    }

    if (!location) {
        showFieldError(2, "Location is required.");
        hasError = true;
    }

    if (!price || Number(price) <= 0) {
        showFieldError(3, "Valid price is required.");
        hasError = true;
    }

    if (bedrooms === "" || Number(bedrooms) < 0) {
        showFieldError(4, "Valid bedrooms value is required.");
        hasError = true;
    }

    if (bathrooms === "" || Number(bathrooms) < 0) {
        showFieldError(5, "Valid bathrooms value is required.");
        hasError = true;
    }

    if (!area || Number(area) <= 0) {
        showFieldError(6, "Valid area is required.");
        hasError = true;
    }

    if (!imageUrl) {
        showFieldError(7, "Image URL is required.");
        hasError = true;
    }

    if (!description) {
        showFieldError(8, "Description is required.");
        hasError = true;
    }

    if (hasError) return;

    const updatedProperty = {
        id: parseInt(currentPropertyId),
        title: title,
        type: type,
        location: location,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: parseFloat(area),
        imageUrl: imageUrl,
        description: description,

        // keep original created date if backend/model needs it
        createdAt: currentProperty?.createdAt || new Date().toISOString()
    };

    try {
        await updateProperty(currentPropertyId, updatedProperty);

        showAlert("Property updated successfully!", "success");

        setTimeout(() => {
            window.location.href = "manage-properties.html";
        }, 1200);

    } catch (error) {
        console.error("Update failed:", error);
        showAlert("Failed to update property. Please try again.", "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allowed = protectAdminPage();

    if (allowed) {
        loadPropertyForEdit();
    }
});