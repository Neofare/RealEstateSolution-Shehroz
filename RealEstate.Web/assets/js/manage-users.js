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

function showUsersAlert(message, type = "success") {
    const alertBox = document.getElementById("usersAlert");

    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `alert show ${type}`;

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 4000);
}

function getCurrentAdminId() {
    const user = getLoggedInUser();
    return user?.id || user?.Id || null;
}

async function loadUsers() {
    const tableBody = document.getElementById("usersTableBody");

    try {
        const users = await getAdminUsers();
        const currentAdminId = getCurrentAdminId();

        tableBody.innerHTML = "";

        if (!users || users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding: 30px; color:#999;">
                        No users found.
                    </td>
                </tr>
            `;
            return;
        }

        users.forEach(user => {
            const row = document.createElement("tr");

            const isSuspended = user.isSuspended;
            const statusText = isSuspended ? "Suspended" : "Active";
            const statusClass = isSuspended ? "status-suspended" : "status-active";

            const isCurrentAdmin = Number(user.id) === Number(currentAdminId);

            row.innerHTML = `
                <td>${user.id}</td>

                <td>
                    <strong>${user.fullName || "Unknown User"}</strong>
                    ${isCurrentAdmin ? `<br><small style="color:#4facfe;">Current Admin</small>` : ""}
                </td>

                <td>
                    <a href="mailto:${user.email}" class="table-link">
                        ${user.email || "N/A"}
                    </a>
                </td>

                <td>${user.phone || "N/A"}</td>

                <td>
                    <span class="role-badge ${user.role === "Admin" ? "role-admin" : "role-user"}">
                        ${user.role || "User"}
                    </span>
                </td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${statusText}
                    </span>
                </td>

                <td>
                    <div class="manage-actions">
                        ${isCurrentAdmin
                    ? `<button class="disabled-action-btn" disabled>Protected</button>`
                    : isSuspended
                        ? `<button class="activate-btn" onclick="confirmActivateUser(${user.id})">Activate</button>`
                        : `<button class="delete-btn" onclick="confirmSuspendUser(${user.id})">Suspend</button>`
                }
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load users:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding: 30px; color:red;">
                    Failed to load users. Make sure backend is running.
                </td>
            </tr>
        `;
    }
}

async function confirmSuspendUser(id) {
    const confirmed = confirm("Are you sure you want to suspend this user? They will not be able to login.");

    if (!confirmed) return;

    try {
        await suspendUser(id);

        showUsersAlert("User suspended successfully.", "success");

        await loadUsers();

    } catch (error) {
        console.error("Failed to suspend user:", error);
        showUsersAlert("Failed to suspend user.", "error");
    }
}

async function confirmActivateUser(id) {
    const confirmed = confirm("Activate this user account again?");

    if (!confirmed) return;

    try {
        await activateUser(id);

        showUsersAlert("User activated successfully.", "success");

        await loadUsers();

    } catch (error) {
        console.error("Failed to activate user:", error);
        showUsersAlert("Failed to activate user.", "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allowed = protectAdminPage();

    if (allowed) {
        loadUsers();
    }
});