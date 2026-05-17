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
        document.getElementById("additionalImages").value = currentProperty.additionalImages || "";
        document.getElementById("description").value = currentProperty.description || "";

    } catch (error) {
        console.error("Failed to load property:", error);
        showAlert("Failed to load property. Make sure backend is running.", "error");
    }
}





async function handleUpdateProperty() {
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

    if (bedrooms === "" || Number(bedrooms) < 0) {
        showFieldError("bedrooms", "Valid bedrooms value is required.");
        hasError = true;
    }

    if (bathrooms === "" || Number(bathrooms) < 0) {
        showFieldError("bathrooms", "Valid bathrooms value is required.");
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
        additionalImages: additionalImages,
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