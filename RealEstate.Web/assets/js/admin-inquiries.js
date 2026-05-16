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

function formatDate(dateValue) {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleString();
}

function shortenMessage(message, maxLength = 120) {
    if (!message) return "No message";

    if (message.length <= maxLength) return message;

    return message.substring(0, maxLength) + "...";
}

async function loadInquiries() {
    const tableBody = document.getElementById("inquiriesTableBody");

    try {
        const inquiries = await getInquiries();

        tableBody.innerHTML = "";

        if (!inquiries || inquiries.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding: 30px; color:#999;">
                        No inquiries found.
                    </td>
                </tr>
            `;
            return;
        }

        inquiries.forEach(inquiry => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${inquiry.id}</td>

                <td>
                    <strong>${inquiry.name || "Unknown"}</strong>
                </td>

                <td>
                    <a href="mailto:${inquiry.email}" class="table-link">
                        ${inquiry.email || "N/A"}
                    </a>
                </td>

                <td>${inquiry.propertyId || "N/A"}</td>

                <td>
                    <span title="${inquiry.message || ""}">
                        ${shortenMessage(inquiry.message)}
                    </span>
                </td>

                <td>${formatDate(inquiry.createdAt)}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load inquiries:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding: 30px; color:red;">
                    Failed to load inquiries. Make sure backend is running and GET /api/Inquiry exists.
                </td>
            </tr>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allowed = protectAdminPage();

    if (allowed) {
        loadInquiries();
    }
});