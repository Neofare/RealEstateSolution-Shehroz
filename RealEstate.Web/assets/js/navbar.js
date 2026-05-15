function getUser() {
    const userData = localStorage.getItem("loggedInUser");

    if (!userData) return null;

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error("Invalid user data:", error);
        localStorage.removeItem("loggedInUser");
        return null;
    }
}

function isInsidePagesFolder() {
    return window.location.pathname.includes("/pages/");
}

function getBasePath() {
    return isInsidePagesFolder() ? "" : "pages/";
}

function getHomePath() {
    return isInsidePagesFolder() ? "../index.html" : "index.html";
}

function updateNavbar() {
    const user = getUser();
    const navAuth = document.getElementById("navAuth");

    if (!navAuth) return;

    const base = getBasePath();

    if (user) {
        const displayName = user.fullName || user.name || user.email || "User";
        const isAdmin = user.role === "Admin";

        navAuth.innerHTML = `
            <div class="user-menu">
                <button onclick="toggleDropdown()">
                    👤 ${displayName}
                </button>

                <div class="dropdown" id="userDropdown">
                    ${isAdmin ? `<a href="${base}add-property.html">+ Add Property</a>` : ""}
                    ${isAdmin ? `<a href="${base}admin.html">Admin Panel</a>` : ""}
                    <button onclick="logout()">Logout</button>
                </div>
            </div>
        `;
    } else {
        navAuth.innerHTML = `
            <div class="auth-buttons">
                <a href="${base}login.html" class="login-btn">Login</a>
                <a href="${base}signup.html" class="signup-btn">Sign Up</a>
            </div>
        `;
    }
}

function toggleDropdown() {
    document.getElementById("userDropdown")?.classList.toggle("active");
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = getHomePath();
}

document.addEventListener("click", (e) => {
    const userMenu = document.querySelector(".user-menu");

    if (!userMenu?.contains(e.target)) {
        document.getElementById("userDropdown")?.classList.remove("active");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();

    requestAnimationFrame(() => {
        document.body.classList.add("page-ready");
    });

    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");

        if (!link) return;
        if (!link.href) return;
        if (link.target === "_blank") return;
        if (link.href.startsWith("mailto:")) return;
        if (link.href.startsWith("tel:")) return;
        if (link.href === window.location.href) return;

        if (link.origin !== window.location.origin) return;

        e.preventDefault();

        const destination = link.href;

        document.body.classList.add("page-exit");

        setTimeout(() => {
            window.location.href = destination;
        }, 250);
    });
});