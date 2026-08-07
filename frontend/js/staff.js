const BASE_URL = "http://127.0.0.1:8000";

// ===============================
// Page Load
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadAssignedComplaints();

});

// ===============================
// Load Complaints
// ===============================

async function loadAssignedComplaints() {

    try {

        const response = await fetch(`${BASE_URL}/issues/`);

        if (!response.ok) {

            throw new Error("Unable to load complaints");

        }

        const issues = await response.json();

        displayComplaints(issues);

        updateDashboard(issues);

    }

    catch (error) {

        console.error(error);

        alert("Unable to load complaints");

    }

}

// ===============================
// Display Complaints
// ===============================

function displayComplaints(issues) {

    const table =
        document.getElementById("staffTableBody") ||
        document.getElementById("staffTable");

    if (!table) return;

    table.innerHTML = "";

    issues.forEach(issue => {

        table.innerHTML += `

        <tr>

            <td>CMP${issue.id}</td>

            <td>${issue.name}</td>

            <td>${issue.issue_type}</td>

            <td>${issue.status}</td>

            <td>

                <button onclick="updateStatus(${issue.id})">

                    Update

                </button>

            </td>

        </tr>

        `;

    });

}

// ===============================
// Dashboard Statistics
// ===============================

function updateDashboard(issues) {

    const total =
        document.getElementById("totalComplaints");

    const pending =
        document.getElementById("pendingComplaints");

    const progress =
        document.getElementById("progressComplaints");

    const resolved =
        document.getElementById("resolvedComplaints");

    if (total)
        total.innerText = issues.length;

    if (pending)
        pending.innerText =
            issues.filter(i => i.status === "Pending").length;

    if (progress)
        progress.innerText =
            issues.filter(i => i.status === "In Progress").length;

    if (resolved)
        resolved.innerText =
            issues.filter(i => i.status === "Resolved").length;

}
// ===============================
// Update Complaint Status
// ===============================

async function updateStatus(issueId) {

    const status = prompt(
        "Enter Status:\n\nPending\nIn Progress\nResolved"
    );

    if (!status) return;

    try {

        const response = await fetch(

            `${BASE_URL}/issues/${issueId}/status`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    status: status

                })

            }

        );

        const data = await response.json();

        if (response.ok) {

            alert("Status Updated Successfully");

            loadAssignedComplaints();

        } else {

            alert(
                data.message ||
                data.detail ||
                "Unable to update status."
            );

        }

    } catch (error) {

        console.error(error);

        alert("Backend Connection Failed");

    }

}



// ===============================
// Delete Complaint
// ===============================

async function deleteComplaint(issueId) {

    if (!confirm("Are you sure you want to delete this complaint?"))
        return;

    try {

        const response = await fetch(

            `${BASE_URL}/issues/${issueId}`,

            {

                method: "DELETE"

            }

        );

        const data = await response.json();

        if (response.ok) {

            alert("Complaint Deleted Successfully");

            loadAssignedComplaints();

        } else {

            alert(
                data.message ||
                "Delete Failed"
            );

        }

    } catch (error) {

        console.error(error);

        alert("Backend Connection Failed");

    }

}



// ===============================
// Search Complaint
// ===============================

function searchComplaints() {

    const search =
        document.getElementById("searchComplaint");

    if (!search) return;

    const value =
        search.value.toLowerCase();

    const rows =
        document.querySelectorAll("#staffTableBody tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(value)

                ? ""

                : "none";

    });

}



// ===============================
// Search Event
// ===============================

const searchBox =
    document.getElementById("searchComplaint");

if (searchBox) {

    searchBox.addEventListener(

        "keyup",

        searchComplaints

    );

}



// ===============================
// Auto Refresh
// ===============================

setInterval(() => {

    loadAssignedComplaints();

}, 10000);

// ===============================
// Filter by Status
// ===============================

function filterStatus() {

    const filter = document.getElementById("statusFilter");

    if (!filter) return;

    const value = filter.value.toLowerCase();

    const rows = document.querySelectorAll("#staffTableBody tr");

    rows.forEach(row => {

        const status = row.cells[3].innerText.toLowerCase();

        if (value === "all") {

            row.style.display = "";

        } else {

            row.style.display = status === value ? "" : "none";

        }

    });

}



// ===============================
// Filter by Category
// ===============================

function filterCategory() {

    const filter = document.getElementById("categoryFilter");

    if (!filter) return;

    const value = filter.value.toLowerCase();

    const rows = document.querySelectorAll("#staffTableBody tr");

    rows.forEach(row => {

        const category = row.cells[2].innerText.toLowerCase();

        if (value === "all") {

            row.style.display = "";

        } else {

            row.style.display = category.includes(value) ? "" : "none";

        }

    });

}



// ===============================
// View Complaint Details
// ===============================

function viewComplaint(issueId) {

await fetch("http://localhost:8000/issues", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});

    window.location.href = "complaint_details.html";

}



// ===============================
// Export Report
// ===============================

function exportReport() {

    window.print();

}



// ===============================
// Logout
// ===============================

function logout() {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");

    window.location.href = "../login.html";

}



// ===============================
// Events
// ===============================

const statusFilter = document.getElementById("statusFilter");

if (statusFilter) {
    statusFilter.addEventListener("change", filterStatus);
}

const categoryFilter = document.getElementById("categoryFilter");

if (categoryFilter) {
    categoryFilter.addEventListener("change", filterCategory);
}