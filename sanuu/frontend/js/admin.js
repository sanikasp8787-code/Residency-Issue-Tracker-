const BASE_URL = "https://residency-issue-tracker.onrender.com";

// ======================================
// Page Load
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

});

// ======================================
// Load Dashboard
// ======================================

async function loadDashboard() {

    try {

        const response = await fetch(`${BASE_URL}/issues/`);

        if (!response.ok) {

            throw new Error("Unable to load issues");

        }

        const issues = await response.json();

        updateDashboard(issues);

        loadRecentComplaints(issues);

    }

    catch (error) {

        console.error(error);

        alert("Backend Connection Failed");

    }

}

// ======================================
// Dashboard Statistics
// ======================================

function updateDashboard(issues) {

    document.getElementById("totalComplaints").innerText =
        issues.length;

    document.getElementById("openComplaints").innerText =
        issues.filter(i => i.status === "Pending").length;

    document.getElementById("progressComplaints").innerText =
        issues.filter(i => i.status === "In Progress").length;

    document.getElementById("completedComplaints").innerText =
        issues.filter(i => i.status === "Resolved").length;

    const emergency =
        issues.filter(i =>
            i.issue_type &&
            i.issue_type.toLowerCase().includes("emergency")
        );

    document.getElementById("emergencyIssues").innerText =
        emergency.length;

}
// ======================================
// Load Recent Complaints
// ======================================

function loadRecentComplaints(issues) {

    const table =
        document.getElementById("recentComplaintsBody");

    if (!table) return;

    table.innerHTML = "";

    if (issues.length === 0) {

        const noComplaints =
            document.getElementById("noComplaints");

        if (noComplaints) {

            noComplaints.style.display = "block";

        }

        return;

    }

    issues.slice(0, 5).forEach(issue => {

        table.innerHTML += `

        <tr>

            <td>CMP${issue.id}</td>

            <td>${issue.name}</td>

            <td>${issue.issue_type}</td>

            <td>

                <span class="priority medium">

                    Medium

                </span>

            </td>

            <td>

                <span class="status">

                    ${issue.status}

                </span>

            </td>

            <td>

                <a href="complaints.html">

                    Manage

                </a>

            </td>

        </tr>

        `;

    });

}

// ======================================
// Auto Refresh
// ======================================

setInterval(() => {

    loadDashboard();

}, 10000);
// ======================================
// Logout
// ======================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("loggedInUser");

    window.location.href = "../login.html";

}


// ======================================
// Export Report
// ======================================

function exportReport() {

    window.print();

}


// ======================================
// View Complaint
// ======================================

function viewIssue(issueId) {

    localStorage.setItem(
        "selectedIssueId",
        issueId
    );

    window.location.href =
        "complaint_details.html";

}


// ======================================
// Delete Complaint
// ======================================

async function deleteIssue(issueId) {

    const confirmDelete =
        confirm("Delete this complaint?");


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(

                `${BASE_URL}/issues/${issueId}`,

                {

                    method: "DELETE"

                }

            );


        if (response.ok) {

            alert("Complaint Deleted Successfully");

            loadDashboard();

        }

        else {

            alert("Delete Failed");

        }


    }

    catch(error) {

        console.error(error);

        alert("Backend Connection Failed");

    }

}
