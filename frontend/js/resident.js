// ==========================================
// Backend Configuration
// ==========================================

const BASE_URL = "http://127.0.0.1:8000";

// ==========================================
// Dashboard Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("totalComplaints")) {

        loadDashboard();

    }

});

// ==========================================
// Load Dashboard Data
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(`${BASE_URL}/issues/`);

        if (!response.ok) {

            throw new Error("Unable to load data");

        }

        const issues = await response.json();

        updateStatistics(issues);

        loadRecentComplaints(issues);

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to backend.");

    }

}
// ==========================================
// Update Dashboard Statistics
// ==========================================

function updateStatistics(issues) {

    document.getElementById("totalComplaints").innerText =
        issues.length;

    document.getElementById("openComplaints").innerText =
        issues.filter(
            issue => issue.status === "Pending"
        ).length;

    document.getElementById("progressComplaints").innerText =
        issues.filter(
            issue => issue.status === "In Progress"
        ).length;

    document.getElementById("completedComplaints").innerText =
        issues.filter(
            issue => issue.status === "Resolved"
        ).length;

}


// ==========================================
// Load Recent Complaints
// ==========================================

function loadRecentComplaints(issues) {

    const table =
        document.getElementById("complaintsTable");

    if (!table) return;

    table.innerHTML = "";

    issues.slice(0, 5).forEach(issue => {

        table.innerHTML += `
<tr>
    <td>CMP${issue.id}</td>
    <td>${issue.issue_type}</td>
    <td>${issue.priority || "Medium"}</td>
    <td>${issue.status}</td>
    <td>-</td>
    <td><button>View</button></td>
</tr>
`;

    });

}
// ==========================================
// Auto Refresh Dashboard
// ==========================================

setInterval(() => {

    if (document.getElementById("totalComplaints")) {

        loadDashboard();

    }

}, 10000);


// ==========================================
// Logout
// ==========================================

function logout() {
    await fetch("http://localhost:8000/issues", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});}


// ==========================================
// Dashboard Ready
// ==========================================

window.onload = function () {

    if (document.getElementById("totalComplaints")) {

        loadDashboard();

    }

};
// ==========================================
// Submit New Complaint
// ==========================================

const complaintForm =
    document.getElementById("complaintForm");


if (complaintForm) {

    complaintForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const complaintData = {
            name: document.getElementById("residentName").value,
            email: localStorage.getItem("email") || "resident@gmail.com",
            issue_type: document.getElementById("category").value,
            description: document.getElementById("description").value,
            status: "Pending",
            flat_number: document.getElementById("flatNumber").value,
            priority: document.getElementById("priority").value
        };

        try {

            const response = await fetch(`${BASE_URL}/issues/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(complaintData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Complaint Submitted Successfully");
                complaintForm.reset();
                window.location.href = "my_complaints.html";
            } else {
                alert(data.message || "Failed to submit complaint");
            }

        } catch (error) {
            console.log(error);
            alert("Backend Connection Failed");
        }

    });

}
// ==========================================
// Load My Complaints
// ==========================================

async function loadMyComplaints() {

    const tableBody = document.getElementById("complaintsTableBody");

    if (!tableBody) return;

    try {

        const response = await fetch(`${BASE_URL}/issues/`);
        const complaints = await response.json();

        tableBody.innerHTML = "";

        complaints.forEach(issue => {

            tableBody.innerHTML += `
            <tr>
                <td>CMP${issue.id}</td>
                <td>${issue.issue_type}</td>
                <td>${issue.priority}</td>
                <td>${issue.status}</td>
                <td>-</td>
                <td><button>View</button></td>
            </tr>
            `;

        });

    } catch (error) {

        console.log(error);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    loadMyComplaints();

});
function submitFeedback() {

    const rating =
        document.querySelector(
            'input[name="rating"]:checked'
        );

    const feedback =
        document.getElementById("feedback").value;

    if (!rating) {

        alert("Please select rating");

        return;

    }

    alert(
        "Thank You!\n\nRating : "
        + rating.value +
        "\nFeedback Submitted Successfully."
    );

}