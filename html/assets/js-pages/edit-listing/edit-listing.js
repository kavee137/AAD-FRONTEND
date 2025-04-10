$(document).ready(function () {
    const adData = JSON.parse(sessionStorage.getItem("editAd"));

    console.log("Ad details: " + JSON.stringify(adData));


    if (!adData) {
        alert("No ad data found. Please go back and try again.");
        window.location.href = "your-listing-page.html";
        return;
    }

    // Set basic ad data
    $("#listingTitle").val(adData.title);
    $("#listingPrice").val(adData.price);
    $("#listingDescription").val(adData.description);
    $("#status").val(adData.status);
    $("#adId").val(adData.id);

    if (adData.imageUrls && adData.imageUrls.length > 0) {
        $("#previewImage").attr("src", adData.imageUrls[0]);
    }


    // Step 1: Get the subcategory's parent (main category)
    $.ajax({
        url: `http://localhost:8082/api/v1/category/cid/${adData.categoryId}`,
        method: "GET",
        success: function (subCategory) {

            let subCategoryDropdown = $("#subCategory");
            let mainCategory = $("#mainCategory");

            const selected = "selected";
            subCategoryDropdown.append(`<option value="${subCategory[0].id}" ${selected}>${subCategory[0].name}</option>`);
            mainCategory.append(`<option value="${subCategory[0].parentCategoryId}" ${selected}>${subCategory[0].parentCategoryName}</option>`);

            // Step 2: Load main categories and set selected
            const parentCategoryGroupId = "550e8400-e29b-41d4-a716-446655440000";
            $.ajax({
                url: `http://localhost:8082/api/v1/category/${parentCategoryGroupId}`,
                method: "GET",
                dataType: "json",
                success: function (mainCats) {
                    let mainCategoryDropdown = $("#mainCategory");

                    mainCats.forEach(cat => {
                        mainCategoryDropdown.append(`<option value="${cat.id}">${cat.name}</option>`);
                    });

                    // Step 3: Load subcategories under the selected main category
                    loadSubCategories(mainCategory.val());
                }
            });
        }
    });

    function loadSubCategories(parentId) {
        let subCategoryDropdown = $("#subCategory");

        $.ajax({
            url: `http://localhost:8082/api/v1/category/${parentId}`,
            method: "GET",
            success: function (subCats) {


                subCats.forEach(sub => {
                    subCategoryDropdown.append(`<option value="${sub.id}">${sub.name}</option>`);
                });
            }
        });
    }

    $("#mainCategory").change(function () {

        let subCategoryDropdown = $("#subCategory");
        subCategoryDropdown.empty();
        subCategoryDropdown.append(`<option value=""> select</option>`);
        loadSubCategories($(this).val());
    });


    console.log("Location id: " + adData.locationId);


    // Step 1: Get the location
    $.ajax({
        url: `http://localhost:8082/api/v1/location/${adData.locationId}`,
        method: "GET",
        success: function (districts) {

            let citySelector = $("#city-select");
            let districtSelector = $("#district-select");

            const selected = "selected";
            citySelector.append(`<option value="${districts.id}" ${selected}>${districts.name}</option>`);
            districtSelector.append(`<option value="${districts.parentLocationId}" ${selected}>${districts.parentLocationName}</option>`);


            // Load locations
            const parentLocationId = "21bf6dc0-07b1-11f0-b8c1-83ce8323275c";
            $.ajax({
                url: 'http://localhost:8082/api/v1/location/parent/' + parentLocationId,
                type: 'GET',
                dataType: 'json',
                success: function (districts) {
                    let districtSelect = $('#district-select');
                    // districtSelect.html('<option value="">Select</option>');

                    districts.forEach(d => {
                        const selected = d.id === districts.id ? "selected" : "";
                        districtSelect.append(`<option value="${d.id}" ${selected}>${d.name}</option>`);
                    });


                    loadCities(districtSelect.val());
                }
            });
        }
    });

    function loadCities(districtId, selectedCityId) {
        if (!districtId) return;

        $.ajax({
            url: 'http://localhost:8082/api/v1/location/parent/' + districtId,
            type: 'GET',
            dataType: 'json',
            success: function (cities) {
                let citySelect = $('#city-select');


                cities.forEach(city => {
                    const selected = city.id === selectedCityId ? "selected" : "";
                    citySelect.append(`<option value="${city.id}" ${selected}>${city.name}</option>`);
                });
            }
        });
    }

    $('#district-select').change(function () {
        let citySelector = $("#city-select");
        citySelector.empty();
        citySelector.append(`<option value=""> select</option>`);
        loadCities($(this).val());
    });













    // Image set

    loadAdImages(adData.id); // make sure adData.id is a valid UUID

    console.log("Ad UUID: " + adData.id);

    // Event delegation for the remove image click
    $(document).on('click', '.profile-img-del', function () {
        $(this).closest('.gallery-upload').remove();
    });

// Handle new uploads
    $('#file2').on('change', function (e) {
        let files = e.target.files; // Get the selected files
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();

            // When the file is read, append the image preview
            reader.onload = function (event) {
                $('.galleryimg-upload').append(generateImageBox(event.target.result, files[i].name));
            };

            reader.readAsDataURL(files[i]); // Read the file as Data URL
        }
    });

// Function to generate HTML for the image preview
    function generateImageBox(src, name) {
        return `
        <div class="gallery-upload" data-name="${name}">
            <img src="${src}" alt="${name}" class="img-fluid" />
            <a href="javascript:void(0)" class="profile-img-del">
                <i class="feather-trash-2"></i>
            </a>
        </div>
    `;
    }








    let selectedFiles = []; // new uploads
    let existingImages = []; // from DB

// Load existing images when editing
    function loadAdImages(adId) {
        $.ajax({
            url: 'http://localhost:8082/api/v1/ad/get-ad-images/' + adId,
            type: 'GET',
            success: function (images) {
                $('.galleryimg-upload').empty();
                existingImages = images; // save to reuse on submit

                images.forEach(image => {
                    const imageBox = `
                <div class="gallery-upload existing" data-name="${image.name}">
                    <img src="${image.base64}" class="img-fluid" alt="Image" />
                    <a href="javascript:void(0)" class="profile-img-del" onclick="removeExistingImage(this)">
                        <i class="feather-trash-2"></i>
                    </a>
                </div>`;
                    $('.galleryimg-upload').append(imageBox);
                });
            },
            error: () => alert('Failed to load images.')
        });
    }


// New uploads
    $("#file2").on("change", function (e) {
        let files = Array.from(e.target.files);
        files.forEach(file => {
            if (!selectedFiles.some(f => f.name === file.name)) {
                selectedFiles.push(file);

                let reader = new FileReader();
                reader.onload = function (e) {
                    const imgBox = `
                <div class="gallery-upload" data-name="${file.name}">
                    <img src="${e.target.result}" class="img-fluid" />
                    <a href="javascript:void(0)" class="profile-img-del" onclick="removeNewImage(this)">
                        <i class="feather-trash-2"></i>
                    </a>
                </div>`;
                    $(".galleryimg-upload").append(imgBox);
                };
                reader.readAsDataURL(file);
            }
        });
        $(this).val('');
    });

// Remove new image
    function removeNewImage(el) {
        const name = $(el).closest('.gallery-upload').data('name');
        selectedFiles = selectedFiles.filter(f => f.name !== name);
        $(el).closest('.gallery-upload').remove();
    }

// Submit edited ad
    $("#submitAdBtn").click(function (e) {
        e.preventDefault();

        let adDTO = {
            id: adData.id,
            title: $("#listingTitle").val(),
            description: $("#listingDescription").val(),
            price: parseFloat($("#listingPrice").val()),
            status: "ACTIVE",
            userId: localStorage.getItem("loggedInUserId"),
            categoryId: $("#subCategory").val(),
            locationId: $("#city-select").val(),
            existingImageNames: existingImages.map(img => img.name) // <-- pass to backend
        };

        let formData = new FormData();
        formData.append("adDTO", JSON.stringify(adDTO));

        selectedFiles.forEach(file => formData.append("images", file));

        $.ajax({
            url: "http://localhost:8082/api/v1/ad/updateAd",
            type: "PUT",
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") },
            success: res => Swal.fire("Updated!", "Ad updated successfully.", "success").then(() => location.href = "my-listing.html"),
            error: err => Swal.fire("Error", "Failed to update ad: " + err.responseText, "error")
        });
    });







});
