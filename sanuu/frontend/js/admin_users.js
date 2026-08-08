// ======================================
// Admin Users Backend Connection
// ======================================

const BASE_URL = "https://residency-issue-tracker.onrender.com";


// Elements

const usersTableBody =
    document.getElementById("usersTableBody");

const noUsersMessage =
    document.getElementById("noUsersMessage");


// Load Users

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadUsers();

    }
);



// ======================================
// Get Users From Backend
// ======================================

async function loadUsers(){

    try{

        const response =
            await fetch(
                `${BASE_URL}/users/`
            );


        const users =
            await response.json();


        displayUsers(users);

        updateStatistics(users);


    }

    catch(error){

        console.error(error);

        alert(
            "Backend Connection Failed"
        );

    }

}



// ======================================
// Display Users
// ======================================

function displayUsers(users){


    usersTableBody.innerHTML = "";


    if(users.length === 0){

        noUsersMessage.style.display =
            "block";

        return;

    }


    noUsersMessage.style.display =
        "none";



    users.forEach(user => {


        const row =
            document.createElement("tr");



        row.innerHTML = `

        <td>
            ${user.id}
        </td>


        <td>
            ${user.full_name}
        </td>


        <td>
            ${user.email}
        </td>


        <td>
            ${user.phone || "-"}
        </td>


        <td>

            <span class="role">

                ${user.role}

            </span>

        </td>


        <td>

            <span class="user-status active">

                Active

            </span>

        </td>


        <td>

            <button
            onclick="deleteUser(${user.id})">

            Delete

            </button>

        </td>


        `;



        usersTableBody.appendChild(row);


    });


}




// ======================================
// Statistics
// ======================================

function updateStatistics(users){


    let residents =
        users.filter(
            user =>
            user.role.toLowerCase()
            === "resident"
        ).length;



    let staff =
        users.filter(
            user =>
            user.role.toLowerCase()
            === "staff"
        ).length;



    document.getElementById(
        "totalResidents"
    ).innerText =
        residents;



    document.getElementById(
        "totalStaff"
    ).innerText =
        staff;



    document.getElementById(
        "activeUsers"
    ).innerText =
        users.length;



    document.getElementById(
        "inactiveUsers"
    ).innerText =
        0;


}




// ======================================
// Search User
// ======================================

const search =
document.getElementById(
    "userSearch"
);



if(search){


search.addEventListener(
"keyup",
function(){


let value =
search.value.toLowerCase();



let rows =
document.querySelectorAll(
"#usersTableBody tr"
);



rows.forEach(row => {


row.style.display =
row.innerText
.toLowerCase()
.includes(value)

? ""

: "none";


});


});


}




// ======================================
// Delete User (Future Backend)
// ======================================

async function deleteUser(id){

    let confirmDelete =
        confirm("Delete this user?");


    if(!confirmDelete)
        return;


    try{

        const response =
        await fetch(
            `${BASE_URL}/users/${id}`,
            {
                method:"DELETE"
            }
        );


        const data =
        await response.json();


        if(response.ok){

            alert("User Deleted Successfully");

            loadUsers();

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
