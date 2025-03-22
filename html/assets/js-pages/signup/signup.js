$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        let name = $("input[placeholder='Name']").val().trim();
        let email = $("input[placeholder='Email Address']").val().trim();
        let password = $("input[placeholder='Password']").val().trim();
        let phone = $("input[placeholder='Phone number']").val().trim();

        // Validation checks
        if (name === "") {
            alert("Name is required");
            return;
        }

        if (email === "" || !validateEmail(email)) {
            alert("Enter a valid email address");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Enter a valid 10-digit phone number");
            return;
        }

        // Prepare data for submission
        let formData = { name, email, password, phone };

        console.log(formData);

        // Send AJAX request
        $.ajax({
            url: "http://localhost:8082/api/v1/user/register",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                alert("Registration Successful!");
                window.location.href = "home.html"; // Redirect to logged home page
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });

    // Email validation function
    function validateEmail(email) {
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
});
