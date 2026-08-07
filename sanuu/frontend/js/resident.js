// ==========================================
// Backend Configuration
// ==========================================

const BASE_URL = "http://127.0.0.1:8000";

// ==========================================
// Page Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("totalComplaints")) {
        loadDashboard();
    }

    if (document.getElementById("complaintsTableBody")) {
        loadMyComplaints();
    }

    if (document.getElementById("profileName")) {
        loadProfile();
    }

});

// ==========================================
// Dashboard
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(`${BASE_URL}/issues/`);

        const issues = await response.json();

        updateStatistics(issues);

        loadRecentComplaints(issues);

    }

    catch(error){

        console.log(error);

        alert("Backend Connection Failed");

    }

}

// ==========================================
// Dashboard Statistics
// ==========================================

function updateStatistics(issues){

    document.getElementById("totalComplaints").innerText =
        issues.length;

    document.getElementById("openComplaints").innerText =
        issues.filter(i => i.status === "Pending").length;

    document.getElementById("progressComplaints").innerText =
        issues.filter(i => i.status === "In Progress").length;

    document.getElementById("completedComplaints").innerText =
        issues.filter(i => i.status === "Resolved").length;

}

// ==========================================
// Recent Complaints
// ==========================================

function loadRecentComplaints(issues){

    const table =
        document.getElementById("complaintsTable");

    if(!table) return;

    table.innerHTML = "";

    issues.slice(0,5).forEach(issue=>{

        table.innerHTML += `

<tr>

<td>CMP${issue.id}</td>

<td>${issue.issue_type}</td>

<td>${issue.priority}</td>

<td>${issue.status}</td>

<td>-</td>

<td>

<button onclick="viewComplaint(${issue.id})">

View

</button>

</td>

</tr>

`;

    });

}

// ==========================================
// Open Complaint Details
// ==========================================

function viewComplaint(issueId){

    localStorage.setItem(
        "selectedIssueId",
        issueId
    );

    window.location.href =
        "complaint_details.html";

}
// ==========================================
// Submit New Complaint
// ==========================================

const complaintForm =
document.getElementById("complaintForm");

if (complaintForm) {

    complaintForm.addEventListener("submit", async function(event){

        event.preventDefault();

        const complaintData = {

            name: document.getElementById("residentName").value,

            email: localStorage.getItem("email"),

            issue_type: document.getElementById("category").value,

            description: document.getElementById("description").value,

            flat_number: document.getElementById("flatNumber").value,

            priority: document.getElementById("priority").value

        };

        try{

            const response = await fetch(`${BASE_URL}/issues/`,{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(complaintData)

            });

            const data = await response.json();

            if(response.ok){

                alert("Complaint Submitted Successfully");

                complaintForm.reset();

                window.location.href="my_complaints.html";

            }

            else{

                alert(data.message);

            }

        }

        catch(error){

            console.log(error);

            alert("Backend Connection Failed");

        }

    });

}

// ==========================================
// Load My Complaints
// ==========================================

async function loadMyComplaints(){

    const tableBody =
    document.getElementById("complaintsTableBody");

    if(!tableBody) return;

    try{

        const response =
        await fetch(`${BASE_URL}/issues/`);

        const complaints =
        await response.json();

        tableBody.innerHTML="";

        if(complaints.length===0){

            document.getElementById("noComplaints").style.display="block";

            return;

        }

        document.getElementById("noComplaints").style.display="none";

        complaints.forEach(issue=>{

            tableBody.innerHTML+=`

            <tr>

                <td>CMP${issue.id}</td>

                <td>${issue.issue_type}</td>

                <td>${issue.priority}</td>

                <td>${issue.status}</td>

                <td>-</td>

                <td>

                    <button
                    onclick="viewComplaint(${issue.id})">

                    View

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

// ==========================================
// Search Complaint
// ==========================================

const searchComplaint =
document.getElementById("searchComplaint");

if(searchComplaint){

searchComplaint.addEventListener("keyup",function(){

const value=
searchComplaint.value.toLowerCase();

const rows=
document.querySelectorAll("#complaintsTableBody tr");

rows.forEach(row=>{

row.style.display=
row.innerText.toLowerCase().includes(value)

? ""

: "none";

});

});

}
// ==========================================
// Category Filter
// ==========================================

const categoryFilter =
document.getElementById("categoryFilter");

if(categoryFilter){

categoryFilter.addEventListener("change",applyFilters);

}

// ==========================================
// Priority Filter
// ==========================================

const priorityFilter =
document.getElementById("priorityFilter");

if(priorityFilter){

priorityFilter.addEventListener("change",applyFilters);

}

// ==========================================
// Status Filter
// ==========================================

const statusFilter =
document.getElementById("statusFilter");

if(statusFilter){

statusFilter.addEventListener("change",applyFilters);

}

// ==========================================
// Apply Filters
// ==========================================

function applyFilters(){

const category =
categoryFilter ? categoryFilter.value.toLowerCase() : "all";

const priority =
priorityFilter ? priorityFilter.value.toLowerCase() : "all";

const status =
statusFilter ? statusFilter.value.toLowerCase() : "all";

const rows =
document.querySelectorAll("#complaintsTableBody tr");

rows.forEach(row=>{

const rowCategory =
row.cells[1].innerText.toLowerCase();

const rowPriority =
row.cells[2].innerText.toLowerCase();

const rowStatus =
row.cells[3].innerText.toLowerCase();

const categoryMatch =
category==="all" || rowCategory.includes(category);

const priorityMatch =
priority==="all" || rowPriority.includes(priority);

const statusMatch =
status==="all" || rowStatus.includes(status);

row.style.display =
(categoryMatch && priorityMatch && statusMatch)
? ""
: "none";

});

}

// ==========================================
// Load Profile
// ==========================================

async function loadProfile(){

const userId =
localStorage.getItem("userId");

if(!userId) return;

try{

const response =
await fetch(`${BASE_URL}/users/${userId}`);

const user =
await response.json();

document.getElementById("profileName").innerText =
user.full_name;

document.getElementById("fullName").value =
user.full_name;

document.getElementById("email").value =
user.email;

document.getElementById("phone").value =
user.phone;

}

catch(error){

console.log(error);

}

}

// ==========================================
// Logout
// ==========================================

function logout(){

localStorage.clear();

window.location.href="../login.html";

}

// ==========================================
// Auto Refresh
// ==========================================

setInterval(()=>{

if(document.getElementById("complaintsTableBody")){

loadMyComplaints();

}

},10000);

// ==========================================
// Feedback Submit
// ==========================================

async function submitFeedback(issueId){

const rating =
document.getElementById("rating").value;

const feedback =
document.getElementById("feedback").value;

try{

const response =
await fetch(`${BASE_URL}/issues/${issueId}/feedback`,{

method:"PATCH",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

rating:parseInt(rating),

feedback:feedback

})

});

const data =
await response.json();

if(response.ok){

alert("Feedback Submitted Successfully");

location.reload();

}

else{

alert(data.message);

}

}

catch(error){

console.log(error);

alert("Backend Connection Failed");

}

}