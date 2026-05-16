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

function showManageAlert(message, type = "success") {
    const alertBox = document.getElementById("manageAlert");

    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `alert show ${type}`;

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 4000);
}

async function loadManageProperties() {
    const tableBody = document.getElementById("propertiesTableBody");

    try {
        const properties = await getProperties();

        tableBody.innerHTML = "";

        if (!properties || properties.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding: 30px; color:#999;">
                        No properties found.
                    </td>
                </tr>
            `;
            return;
        }

        properties.forEach(property => {
            const row = document.createElement("tr");

            const imageUrl = property.imageUrl || "https://via.placeholder.com/80x60?text=No+Image";

            const price = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            }).format(property.price || 0);

            row.innerHTML = `
                <td>
                    <img 
                        class="manage-property-img"
                        src="${imageUrl}" 
                        alt="${property.title || "Property"}"
                        onerror="this.src='https://via.placeholder.com/80x60?text=No+Image'"
                    >
                </td>

                <td>
                    <strong>${property.title || "Untitled Property"}</strong>
                    <br>
                    <small>ID: ${property.id}</small>
                </td>

                <td>
                    <span class="type-badge">
                        ${property.type || "N/A"}
                    </span>
                </td>

                <td>${property.location || "N/A"}</td>

                <td>${price}</td>

                <td>
                    🛏 ${property.bedrooms || 0}
                    <br>
                    🛁 ${property.bathrooms || 0}
                </td>

                <td>
                    <div class="manage-actions">
                        <button class="view-btn" onclick="viewProperty(${property.id})">
                            View
                        </button>

                        <button class="delete-btn" onclick="confirmDeleteProperty(${property.id})">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load properties:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding: 30px; color:red;">
                    Failed to load properties. Make sure backend is running.
                </td>
            </tr>
        `;
    }
}

function viewProperty(id) {
    window.location.href = `property-details.html?id=${id}`;
}

async function confirmDeleteProperty(id) {
    const confirmed = confirm("Are you sure you want to delete this property? This action cannot be undone.");

    if (!confirmed) return;

    try {
        await deleteProperty(id);

        showManageAlert("Property deleted successfully.", "success");

        await loadManageProperties();

    } catch (error) {
        console.error("Delete failed:", error);

        showManageAlert("Failed to delete property. Please try again.", "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allowed = protectAdminPage();

    if (allowed) {
        loadManageProperties();
    }
});