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

        alert("Unable to connect to backend.");

    }

}

// ===============================
// Dashboard Statistics
// ===============================

function updateDashboard(issues) {

    const assigned =
        document.getElementById("assignedCount");

    const pending =
        document.getElementById("pendingCount");

    const progress =
        document.getElementById("progressCount");

    const completed =
        document.getElementById("completedCount");

    const high =
        document.getElementById("highPriorityCount");

    if (assigned)
        assigned.innerText = issues.length;

    if (pending)
        pending.innerText =
            issues.filter(i => i.status === "Pending").length;

    if (progress)
        progress.innerText =
            issues.filter(i => i.status === "In Progress").length;

    if (completed)
        completed.innerText =
            issues.filter(i => i.status === "Resolved").length;

    if (high)
        high.innerText =
            issues.filter(i => i.priority === "High").length;

}
// ===============================
// Display Complaints
// ===============================

function displayComplaints(issues) {

    // Dashboard Page
    const recentTable =
        document.getElementById("recentComplaintsBody");

    if (recentTable) {

        recentTable.innerHTML = "";

        issues.slice(0, 5).forEach(issue => {

            recentTable.innerHTML += `

            <tr>

                <td>CMP${issue.id}</td>

                <td>${issue.name}</td>

                <td>${issue.issue_type}</td>

                <td>
                    <span class="status">
                        ${issue.status}
                    </span>
                </td>

                <td>

                    <button
                        class="staff-manage-button"
                        onclick="updateStatus(${issue.id})">

                        Manage

                    </button>

                </td>

            </tr>

            `;

        });

    }

    // Assigned Complaints Page
    const assignedTable =
        document.getElementById("assignedTableBody");

    if (assignedTable) {

        assignedTable.innerHTML = "";

        const count =
            document.getElementById("assignedCount");

        if (count)
            count.innerText = issues.length;

        const empty =
            document.getElementById("noComplaints");

        if (issues.length === 0) {

            if (empty)
                empty.style.display = "block";

            return;

        }

        if (empty)
            empty.style.display = "none";

        issues.forEach(issue => {

            assignedTable.innerHTML += `

            <tr>

                <td>CMP${issue.id}</td>

                <td>${issue.name}</td>

                <td>${issue.flat_number || "-"}</td>

                <td>${issue.issue_type}</td>

                <td>${issue.priority || "Medium"}</td>

                <td>${issue.status}</td>

                <td>

                    <button
                        class="staff-manage-button"
                        onclick="updateStatus(${issue.id})">

                        Update

                    </button>

                </td>

            </tr>

            `;

        });

    }

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

        }

        else {

            alert(

                data.detail ||

                "Unable to update status."

            );

        }

    }

    catch (error) {

        console.error(error);

        alert("Backend Connection Failed");

    }

}
// ===============================
// Search Complaint
// ===============================

function searchComplaints() {

    const search = document.getElementById("searchComplaint");

    if (!search) return;

    const value = search.value.toLowerCase();

    const rows = document.querySelectorAll("#assignedTableBody tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

    });

}

// ===============================
// Filter by Status
// ===============================

function filterStatus() {

    const filter = document.getElementById("statusFilter");

    if (!filter) return;

    const value = filter.value.toLowerCase();

    const rows = document.querySelectorAll("#assignedTableBody tr");

    rows.forEach(row => {

        const status = row.cells[5].innerText.toLowerCase();

        if (value === "all") {

            row.style.display = "";

        } else {

            row.style.display =
                status.includes(value)
                    ? ""
                    : "none";

        }

    });

}

// ===============================
// Filter by Priority
// ===============================

function filterPriority() {

    const filter = document.getElementById("priorityFilter");

    if (!filter) return;

    const value = filter.value.toLowerCase();

    const rows = document.querySelectorAll("#assignedTableBody tr");

    rows.forEach(row => {

        const priority = row.cells[4].innerText.toLowerCase();

        if (value === "all") {

            row.style.display = "";

        } else {

            row.style.display =
                priority.includes(value)
                    ? ""
                    : "none";

        }

    });

}

// ===============================
// View Complaint Details
// ===============================

function viewComplaint(issueId) {

    localStorage.setItem("selectedIssueId", issueId);

    window.location.href = "complaint_details.html";

}

// ===============================
// Delete Complaint
// ===============================

async function deleteComplaint(issueId) {

    if (!confirm("Delete this complaint?"))
        return;

    try {

        const response = await fetch(

            `${BASE_URL}/issues/${issueId}`,

            {

                method: "DELETE"

            }

        );

        if (response.ok) {

            alert("Complaint Deleted");

            loadAssignedComplaints();

        }

        else {

            alert("Delete Failed");

        }

    }

    catch (error) {

        console.error(error);

        alert("Backend Connection Failed");

    }

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
// Auto Refresh
// ===============================

setInterval(() => {

    loadAssignedComplaints();

}, 10000);

// ===============================
// Event Listeners
// ===============================

const searchBox = document.getElementById("searchComplaint");

if (searchBox) {

    searchBox.addEventListener(

        "keyup",

        searchComplaints

    );

}

const statusFilter = document.getElementById("statusFilter");

if (statusFilter) {

    statusFilter.addEventListener(

        "change",

        filterStatus

    );

}

const priorityFilter = document.getElementById("priorityFilter");

if (priorityFilter) {

    priorityFilter.addEventListener(

        "change",

        filterPriority

    );

}

// ===============================
// Open Complaint Details
// ===============================

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("staff-manage-button")) {

        const row = event.target.closest("tr");

        if (!row) return;

        const complaintId = row.cells[0].innerText.replace("CMP", "");

        localStorage.setItem("selectedIssueId", complaintId);

    }

});