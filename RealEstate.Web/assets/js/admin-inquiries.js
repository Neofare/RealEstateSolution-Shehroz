let allInquiries = [];

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

function shortenMessage(message, maxLength = 80) {
    if (!message) return "No message";

    if (message.length <= maxLength) return message;

    return message.substring(0, maxLength) + "...";
}

function getStatusClass(status) {
    const normalized = (status || "New").toLowerCase();

    if (normalized === "resolved") return "status-resolved";
    if (normalized === "replied") return "status-replied";

    return "status-new";
}

function showInquiryAlert(message, type = "success") {
    const alertBox = document.getElementById("inquiriesAlert");

    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `alert show ${type}`;

    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 4000);
}

async function loadInquiries() {
    const tableBody = document.getElementById("inquiriesTableBody");

    try {
        allInquiries = await getInquiries();

        tableBody.innerHTML = "";

        if (!allInquiries || allInquiries.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; padding: 30px; color:#999;">
                        No inquiries found.
                    </td>
                </tr>
            `;
            return;
        }

        allInquiries.forEach(inquiry => {
            const row = document.createElement("tr");

            const status = inquiry.status || "New";

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

                <td>
                <strong>${inquiry.propertyId || "N/A"}</strong>
                <br>
                ${inquiry.propertyId
                                ? `<a href="property-details.html?id=${inquiry.propertyId}" class="table-link">link</a>`
                                : `<span style="color:#999;">No link</span>`
                }
                </td>

                <td>
                    <span class="status-badge ${getStatusClass(status)}">
                        ${status}
                    </span>
                </td>

                <td>
                    <span title="${inquiry.message || ""}">
                        ${shortenMessage(inquiry.message)}
                    </span>
                </td>

                <td>${formatDate(inquiry.createdAt)}</td>

                <td>
                    <div class="manage-actions">
                        <button class="view-btn" onclick="viewInquiry(${inquiry.id})">
                            View
                        </button>

                        <button class="edit-btn" onclick="markInquiryStatus(${inquiry.id}, 'Resolved')">
                            Resolved
                        </button>

                        <button class="reply-btn" onclick="markInquiryStatus(${inquiry.id}, 'Replied')">
                            Replied
                        </button>

                        <button class="delete-btn" onclick="confirmDeleteInquiry(${inquiry.id})">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load inquiries:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding: 30px; color:red;">
                    Failed to load inquiries. Make sure backend is running.
                </td>
            </tr>
        `;
    }
}

function viewInquiry(id) {
    const inquiry = allInquiries.find(i => i.id === id);

    if (!inquiry) {
        showInquiryAlert("Inquiry not found.", "error");
        return;
    }

    const content = document.getElementById("inquiryDetailsContent");

    content.innerHTML = `
        <div class="inquiry-detail-row">
            <strong>ID:</strong>
            <span>${inquiry.id}</span>
        </div>

        <div class="inquiry-detail-row">
            <strong>Name:</strong>
            <span>${inquiry.name || "N/A"}</span>
        </div>

        <div class="inquiry-detail-row">
            <strong>Email:</strong>
            <span>${inquiry.email || "N/A"}</span>
        </div>

        <div class="inquiry-detail-row">
    <strong>Property ID:</strong>
    <span>
        ${inquiry.propertyId || "N/A"}
        ${inquiry.propertyId
            ? `<br><a href="property-details.html?id=${inquiry.propertyId}" class="table-link">link</a>`
            : ""
        }
    </span>
</div>

        <div class="inquiry-detail-row">
            <strong>Status:</strong>
            <span class="status-badge ${getStatusClass(inquiry.status)}">
                ${inquiry.status || "New"}
            </span>
        </div>

        <div class="inquiry-detail-row">
            <strong>Date:</strong>
            <span>${formatDate(inquiry.createdAt)}</span>
        </div>

        <div class="inquiry-full-message">
            <strong>Full Message:</strong>
            <p>${inquiry.message || "No message provided."}</p>
        </div>
    `;

    const popup = document.getElementById("inquiryDetailsPopup");

    document.body.appendChild(popup);
    popup.classList.add("show");
    document.body.classList.add("popup-open");
}

function closeInquiryPopup() {
    const popup = document.getElementById("inquiryDetailsPopup");

    if (!popup) return;

    popup.classList.remove("show");
    document.body.classList.remove("popup-open");
}

async function markInquiryStatus(id, status) {
    try {
        await updateInquiryStatus(id, status);

        showInquiryAlert(`Inquiry marked as ${status}.`, "success");

        await loadInquiries();

    } catch (error) {
        console.error("Failed to update inquiry status:", error);
        showInquiryAlert("Failed to update inquiry status.", "error");
    }
}

async function confirmDeleteInquiry(id) {
    const confirmed = confirm("Are you sure you want to delete this inquiry? This action cannot be undone.");

    if (!confirmed) return;

    try {
        await deleteInquiry(id);

        showInquiryAlert("Inquiry deleted successfully.", "success");

        await loadInquiries();

    } catch (error) {
        console.error("Failed to delete inquiry:", error);
        showInquiryAlert("Failed to delete inquiry.", "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allowed = protectAdminPage();

    if (allowed) {
        loadInquiries();
    }
});