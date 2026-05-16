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

function setStatValue(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function setAllStatsToError() {
    setStatValue("totalProperties", "Error");
    setStatValue("totalInquiries", "Error");
    setStatValue("totalUsers", "Error");
    setStatValue("suspendedUsers", "Error");

    setStatValue("totalVillas", "Error");
    setStatValue("totalApartments", "Error");
    setStatValue("totalHouses", "Error");
}

async function loadAdminStats() {
    try {
        const stats = await getAdminStats();

        setStatValue("totalProperties", stats.totalProperties ?? 0);
        setStatValue("totalInquiries", stats.totalInquiries ?? 0);
        setStatValue("totalUsers", stats.totalUsers ?? 0);
        setStatValue("suspendedUsers", stats.suspendedUsers ?? 0);

        setStatValue("totalVillas", stats.totalVillas ?? 0);
        setStatValue("totalApartments", stats.totalApartments ?? 0);
        setStatValue("totalHouses", stats.totalHouses ?? 0);

    } catch (error) {
        console.error("Failed to load admin stats:", error);
        setAllStatsToError();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allowed = protectAdminPage();

    if (allowed) {
        loadAdminStats();
    }
});