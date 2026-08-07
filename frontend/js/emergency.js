const sosBtn = document.getElementById("sosBtn");
const message = document.getElementById("message");

sosBtn.addEventListener("click", function () {

    const emergency = {
        id: "SOS" + Date.now(),
        residentName: "Resident",
        flatNumber: "A-101",
        emergencyType: "Medical",
        description: "Emergency SOS Request",
        date: new Date().toLocaleString(),
        status: "Pending"
    };

    let emergencyList =
        JSON.parse(localStorage.getItem("emergencyList")) || [];

    emergencyList.push(emergency);

    };
    await fetch("http://localhost:8000/issues", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});

    message.innerHTML =
        "<h3 style='color:red'>Emergency request sent successfully.</h3>";

    alert("SOS Request Sent!");
});