const isLoggedIn = localStorage.getItem("loggedInUserId"); // Change this based on your authentication system


if (isLoggedIn) {
    $("#navbar-placeholder").load("logged-navbar.html", function (response, status, xhr) {

        let storedName = localStorage.getItem("name");

        if (storedName) {
            $("#logged-person-name").text(storedName); // ✅ Replace text inside span with class 'user-name'
        }

        if (status === "error") {
            console.error("Error loading the navbar:", xhr.status, xhr.statusText);
        }

    });
} else {
    $("#navbar-placeholder").load("non-user-nav.html", function (response, status, xhr) {

        if (status === "error") {
            console.error("Error loading the navbar:", xhr.status, xhr.statusText);
        }

    });
    // window.location.href = "login.html";
}

console.log("logged user: ", isLoggedIn);


