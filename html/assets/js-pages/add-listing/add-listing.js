$(document).ready(function () {


// -----------------------------------------------------------------------------------


    // set data to category selectors

    var parentCategoryId = "550e8400-e29b-41d4-a716-446655440000";


    // Load parent categories on page load
    $.ajax({
        url: `http://localhost:8082/api/v1/category/${parentCategoryId}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            let mainCategoryDropdown = $("#mainCategory");
            mainCategoryDropdown.append('<option value="0" selected>Select</option>');
            $.each(data, function (index, category) {
                mainCategoryDropdown.append(`<option value="${category.id}">${category.name}</option>`);
            });
        }
    });

    // Load subcategories when a main category is selected
    $("#mainCategory").change(function () {
        let parentId = $(this).val();
        let subCategoryDropdown = $("#subCategory");
        subCategoryDropdown.html('<option value="0" selected>Select</option>'); // Clear previous options

        if (parentId) {
            $.ajax({
                url: `http://localhost:8082/api/v1/category/${parentId}`,
                method: "GET",
                success: function (data) {
                    subCategoryDropdown.append('<option value="0" selected>Select</option>');
                    $.each(data, function (index, category) {
                        subCategoryDropdown.append(`<option value="${category.id}">${category.name}</option>`);
                    });
                }
            });
        }
    });






// -----------------------------------------------------------------------------------



    // set data to location selectors

    var parentLocationId = "21bf6dc0-07b1-11f0-b8c1-83ce8323275c";

    // Populate District Dropdown
    $.ajax({
        url: 'http://localhost:8082/api/v1/location/parent/' + parentLocationId,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var select = $('#district-select');
            select.empty();
            select.append('<option value="" selected>select</option>');

            if(response && response.length > 0) {
                response.forEach(function(location) {
                    select.append('<option value="' + location.id + '">' + location.name + '</option>');
                });
            } else {
                select.append('<option value="">No districts found</option>');
            }
        },
        error: function(error) {
            console.error("Error fetching districts:", error);
        }
    });

    // When a district is selected, fetch cities
    $('#district-select').change(function() {
        var districtId = $(this).val();

        if (districtId) {

            $.ajax({
                url: 'http://localhost:8082/api/v1/location/parent/' + districtId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    var citySelect = $('#city-select');
                    citySelect.empty();
                    citySelect.append('<option value="" selected>select</option>');

                    if (response && response.length > 0) {
                        response.forEach(function(city) {
                            citySelect.append('<option value="' + city.id + '">' + city.name + '</option>');
                        });
                    } else {
                        citySelect.append('<option value="">No cities found</option>');
                    }
                },
                error: function(error) {
                    console.error("Error fetching cities:", error);
                }
            });
        } else {

            $('#city-select').empty().append('<option value="" selected>select</option>');
        }
    });





// -----------------------------------------------------------------------------------




    // Handle Image Upload
    $("#file2").on("change", function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var newImage = `
                    <div class="gallery-upload">
                        <img src="${e.target.result}" class="img-fluid" alt="Uploaded Image">
                        <a href="javascript:void(0)" class="profile-img-del"><i class="feather-trash-2"></i></a>
                    </div>
                `;
                $(".galleryimg-upload").append(newImage);
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Image Deletion (Event Delegation)
    $(document).on("click", ".profile-img-del", function () {
        $(this).closest(".gallery-upload").remove();
    });



// -----------------------------------------------------------------------------------


// create new add listing



    $("#submitAdBtn").click(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Retrieve JWT token from localStorage (ensure the user is logged in)
        let authToken = localStorage.getItem("token");
        if (!authToken) {
            alert("You need to log in first!");
            return;
        }

        // Collect form data
        let adDTO = {
            title: $("#listingTitle").val(),
            description: $("#listingDescription").val(),
            price: parseFloat($("#listingPrice").val()),
            status: "ACTIVE",  // Assuming default status
            userId: "550e8400-e29b-41d4-a716-446655440000", // Replace with logged-in user ID dynamically
            categoryId: $("#subCategory").val(), // Selected sub-category ID
            locationId: $("#city-select").val() // Selected city ID
        };

        // Convert adDTO to JSON
        let adDTOJson = JSON.stringify(adDTO);

        // Create FormData object
        let formData = new FormData();
        formData.append("adDTO", adDTOJson);

        // Append selected images
        let files = $("#file2")[0].files;
        for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
        }

        // Send AJAX request with Authorization header
        $.ajax({
            url: "http://localhost:8082/api/v1/ad/createAd",
            type: "POST",
            data: formData,
            contentType: false, // Don't set contentType (multipart/form-data issue)
            processData: false, // Prevent jQuery from processing FormData
            headers: {
                "Authorization": "Bearer " + authToken  // Include JWT token
            },
            success: function (response) {
                alert("Ad successfully created!");
                console.log(response);
            },
            error: function (xhr) {
                alert("Failed to create ad: " + xhr.responseText);
                console.error(xhr);
            }
        });
    });















});