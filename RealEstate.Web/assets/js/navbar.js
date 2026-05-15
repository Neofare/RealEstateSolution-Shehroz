function updateNavbar() {
    const user = getUser();
    const navAuth = document.getElementById("navAuth");
    if (!navAuth) return;

    // Detect if we're in the pages/ subfolder or at root
    const inPages = window.location.pathname.includes("/pages/");
    const base = inPages ? "" : "pages/";
    const rootBase = inPages ? "../" : "";

    if (user) {
        navAuth.innerHTML = `
            <div class="user-menu">
                <button onclick="toggleDropdown()">👤 ${user.name}</button>
                <div class="dropdown" id="userDropdown">
                    <a href="${base}add-property.html">+ Add Property</a>
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

document.addEventListener("click", (e) => {
    const userMenu = document.querySelector(".user-menu");
    if (!userMenu?.contains(e.target)) {
        document.getElementById("userDropdown")?.classList.remove("active");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});

// PAGE TRANSITIONS
document.addEventListener("DOMContentLoaded", () => {
    // Fade in on load
    requestAnimationFrame(() => {
        document.body.classList.add("page-ready");
    });

    // Intercept all internal link clicks
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");

        if (!link) return;
        if (!link.href) return;
        if (link.target === "_blank") return;
        if (link.href.startsWith("mailto:")) return;
        if (link.href.startsWith("tel:")) return;
        if (link.href === window.location.href) return;

        // Only intercept same-origin links
        if (link.origin !== window.location.origin) return;

        e.preventDefault();
        const destination = link.href;

        // Play exit animation then navigate
        document.body.classList.add("page-exit");

        setTimeout(() => {
            window.location.href = destination;
        }, 250);
    });
});