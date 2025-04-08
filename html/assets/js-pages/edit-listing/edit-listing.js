$(document).ready(function () {
    const adData = JSON.parse(sessionStorage.getItem("editAd"));

    console.log("Ad details : " + adData);

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

            const selected = "selected" ;
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

            const selected = "selected" ;
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
});
