// ======================================
// Backend Configuration
// ======================================

const BASE_URL = "http://127.0.0.1:8000";


// ======================================
// HTML Elements
// ======================================

const tableBody =
    document.getElementById("complaintsTableBody");


const totalComplaintCount =
    document.getElementById("totalComplaintCount");


const noComplaintsMessage =
    document.getElementById("noComplaintsMessage");



// ======================================
// Page Load
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadComplaints();

    }
);



// ======================================
// Load Complaints From Backend
// ======================================

async function loadComplaints(){

    try{

        const response =
            await fetch(`${BASE_URL}/issues/`);


        if(!response.ok){

            throw new Error(
                "Unable to load complaints"
            );

        }


        const complaints =
            await response.json();


        displayComplaints(complaints);


    }

    catch(error){

        console.error(error);

        alert(
            "Backend Connection Failed"
        );

    }

}



// ======================================
// Display Complaints
// ======================================

function displayComplaints(complaints){


    tableBody.innerHTML = "";


    totalComplaintCount.innerText =
        complaints.length;



    if(complaints.length === 0){


        noComplaintsMessage.style.display =
            "block";


        return;

    }


    noComplaintsMessage.style.display =
        "none";



    complaints.forEach(issue => {


        const row =
            document.createElement("tr");



        row.innerHTML = `

        <td>
            CMP${issue.id}
        </td>


        <td>
            ${issue.name}
        </td>


        <td>
            ${issue.issue_type}
        </td>


        <td>
            ${issue.description}
        </td>


        <td>

            <select
            onchange="updateStatus(${issue.id}, this.value)"
            >

                <option value="Pending"
                ${issue.status === "Pending" ? "selected" : ""}>
                    Pending
                </option>


                <option value="In Progress"
                ${issue.status === "In Progress" ? "selected" : ""}>
                    In Progress
                </option>


                <option value="Resolved"
                ${issue.status === "Resolved" ? "selected" : ""}>
                    Resolved
                </option>

            </select>

        </td>


        <td>

            <button
            onclick="deleteComplaint(${issue.id})"
            >
                Delete
            </button>

        </td>


        `;


        tableBody.appendChild(row);


    });


}
// ======================================
// Update Complaint Status
// ======================================

async function updateStatus(issueId, status){

    try{

        const response =
            await fetch(
                `${BASE_URL}/issues/${issueId}/status`,
                {
                    method:"PATCH",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({
                        status: status
                    })
                }
            );


        const data =
            await response.json();


        if(response.ok){

            alert(
                "Status Updated Successfully"
            );

            loadComplaints();

        }

        else{

            alert(
                data.message ||
                data.detail ||
                "Status Update Failed"
            );

        }


    }

    catch(error){

        console.error(error);

        alert(
            "Backend Connection Failed"
        );

    }

}



// ======================================
// Delete Complaint
// ======================================

async function deleteComplaint(issueId){


    const confirmDelete =
        confirm(
            "Delete this complaint?"
        );


    if(!confirmDelete){

        return;

    }



    try{


        const response =
            await fetch(
                `${BASE_URL}/issues/${issueId}`,
                {
                    method:"DELETE"
                }
            );



        const data =
            await response.json();



        if(response.ok){

            alert(
                "Complaint Deleted Successfully"
            );


            loadComplaints();

        }

        else{

            alert(
                data.message ||
                "Delete Failed"
            );

        }


    }

    catch(error){

        console.error(error);

        alert(
            "Backend Connection Failed"
        );

    }

}



// ======================================
// Search Complaint
// ======================================

const searchComplaint =
    document.getElementById(
        "searchComplaint"
    );



if(searchComplaint){


    searchComplaint.addEventListener(
        "keyup",
        function(){


            const value =
                searchComplaint.value
                .toLowerCase();



            const rows =
                tableBody.querySelectorAll(
                    "tr"
                );



            rows.forEach(row => {


                row.style.display =
                    row.innerText
                    .toLowerCase()
                    .includes(value)

                    ? ""

                    : "none";


            });


        }
    );

}
// ======================================
// Category + Status Filter
// ======================================

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


const statusFilter =
    document.getElementById(
        "statusFilter"
    );



function applyFilter(){


    const categoryValue =
        categoryFilter.value
        .toLowerCase();



    const statusValue =
        statusFilter.value
        .toLowerCase();



    const rows =
        tableBody.querySelectorAll(
            "tr"
        );



    rows.forEach(row => {


        const category =
            row.cells[2]
            .innerText
            .toLowerCase();



        const status =
            row.cells[4]
            .innerText
            .toLowerCase();



        const categoryMatch =
            categoryValue === "all" ||
            category.includes(categoryValue);



        const statusMatch =
            statusValue === "all" ||
            status.includes(statusValue);



        if(categoryMatch && statusMatch){

            row.style.display = "";

        }

        else{

            row.style.display = "none";

        }


    });


}



if(categoryFilter){

    categoryFilter.addEventListener(
        "change",
        applyFilter
    );

}



if(statusFilter){

    statusFilter.addEventListener(
        "change",
        applyFilter
    );

}



// ======================================
// Auto Refresh
// ======================================

setInterval(()=>{

    loadComplaints();

},10000);



// ======================================
// Logout
// ======================================

function logout(){

    localStorage.removeItem(
        "loggedInUser"
    );


    fetch()
    
    );


    window.location.href =
        "../login.html";

}