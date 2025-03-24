$(document).ready(function () {
    let storedName = localStorage.getItem("name");

    if (storedName) {
        $("#logged-person-name").text(storedName); // ✅ Replace text inside span with class 'user-name'
    }
});
