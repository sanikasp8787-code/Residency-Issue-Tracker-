// ===============================
// Backend URL
// ===============================
const BASE_URL = "https://residency-issue-tracker.onrender.com";

// ===============================
// Login
// ===============================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch(`${BASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.access_token) {
                    localStorage.setItem("token", data.access_token);
                }
            if (data.user) {

                 localStorage.setItem("loggedInUser", JSON.stringify(data.user));

                 localStorage.setItem("userId", data.user.id);

                 localStorage.setItem("name", data.user.full_name);

                 localStorage.setItem("email", data.user.email);

                 localStorage.setItem("role", data.user.role);

}

                alert("Login Successful!");
                window.location.href = "resident/dashboard.html";
            } else {
                alert(data.detail || "Invalid Email or Password");
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to backend.");
        }
    });
}

// ===============================
// Register
// ===============================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const role = document.getElementById("role").value;

        if (
            !fullName ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword ||
            !role
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    password: password,
                    role: role
                })
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert("Registration Successful!");
                window.location.href = "login.html";
            } else {
                    alert(data.detail || data.message || JSON.stringify(data));
                   }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to backend.");
        }
    });
}

// ===============================
// Forgot Password
// ===============================
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        alert("Password reset feature will be added in backend later.");
        window.location.href = "login.html";
    });
}
