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

async function loadAdminStats() {
    try {
        const properties = await getProperties();

        const totalProperties = document.getElementById("totalProperties");

        if (totalProperties) {
            totalProperties.textContent = properties.length;
        }

    } catch (error) {
        console.error("Failed to load admin stats:", error);

        const totalProperties = document.getElementById("totalProperties");

        if (totalProperties) {
            totalProperties.textContent = "Error";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allowed = protectAdminPage();

    if (allowed) {
        loadAdminStats();
    }
});