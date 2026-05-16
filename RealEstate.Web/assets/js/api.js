const API_BASE_URL = "/api";

const API = {
    authRegister: `${API_BASE_URL}/Auth/register`,
    authLogin: `${API_BASE_URL}/Auth/login`,
    properties: `${API_BASE_URL}/Property`,
    inquiries: `${API_BASE_URL}/Inquiry`,
    adminStats: `${API_BASE_URL}/Admin/stats`
};

async function getProperties() {
    const response = await fetch(API.properties);

    if (!response.ok) {
        throw new Error("Failed to fetch properties from SQL Server.");
    }

    return await response.json();
}

async function getPropertyById(id) {
    const response = await fetch(`${API.properties}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch property details from SQL Server.");
    }

    return await response.json();
}

async function createProperty(propertyData) {
    const response = await fetch(API.properties, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(propertyData)
    });

    if (!response.ok) {
        throw new Error("Failed to create property.");
    }

    return await response.json();
}

async function deleteProperty(id) {
    const response = await fetch(`${API.properties}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete property.");
    }

    return true;
}

async function sendInquiry(inquiryData) {
    const response = await fetch(API.inquiries, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inquiryData)
    });

    if (!response.ok) {
        throw new Error("Failed to send inquiry.");
    }

    return await response.json();
}



async function updateProperty(id, propertyData) {
    const response = await fetch(`${API.properties}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(propertyData)
    });

    if (!response.ok) {
        throw new Error("Failed to update property.");
    }

    return await response.json();
}


async function getInquiries() {
    const response = await fetch(API.inquiries);

    if (!response.ok) {
        throw new Error("Failed to fetch inquiries.");
    }

    return await response.json();
}


async function getAdminStats() {
    const response = await fetch(API.adminStats);

    if (!response.ok) {
        throw new Error("Failed to fetch admin stats.");
    }

    return await response.json();
}



async function getInquiryById(id) {
    const response = await fetch(`${API.inquiries}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch inquiry.");
    }

    return await response.json();
}

async function updateInquiryStatus(id, status) {
    const response = await fetch(`${API.inquiries}/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: status
        })
    });

    if (!response.ok) {
        throw new Error("Failed to update inquiry status.");
    }

    return await response.json();
}

async function deleteInquiry(id) {
    const response = await fetch(`${API.inquiries}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete inquiry.");
    }

    return true;
}