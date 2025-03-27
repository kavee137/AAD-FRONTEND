$(document).ready(function() {


    let categoryMap = {}; // Store category ID to Name mapping

    // First, fetch all categories
    $.ajax({
        url: "http://localhost:8082/api/v1/category/getAll",  // Change to match your API
        type: "GET",
        dataType: "json",
        success: function (categories) {
            categories.forEach(category => {
                categoryMap[category.id] = category.name; // Store ID -> Name
            });

        }
    });





    let excludeCategory = "21bf6dc0-07b1-11f0-b8c1-83ce8323275c";
    let locationMap = {};


    // second, fetch all sub locations
    $.ajax({
        url: "http://localhost:8082/api/v1/location/allSubCategories/exclude/" + excludeCategory,
        type: "GET",
        dataType: "json",
        success: function (locations) {
            locations.forEach(location => {
                categoryMap[location.id] = location.name; // Store ID -> Name
            });

            // Now fetch ads
            loadAllActiveAds();
        }
    });





    function loadAllActiveAds() {
        $.ajax({
            url: "http://localhost:8082/api/v1/ad/getAllActiveAds", // Update with your API endpoint
            type: "GET",
            dataType: "json",
            success: function(response) {
                if (response.code === 200) {
                    let adsContainer = $('#ads-container'); // Ensure you have a container with this ID
                    adsContainer.empty();

                    response.data.forEach(ad => {

                        let categoryName = categoryMap[ad.categoryId] || "Unknown Category";
                        let locationName = locationMap[ad.locationId] || "Unknown Location";


                        let adHtml = `
                        <div class="card">
                            <div class="blog-widget">
                                <div class="blog-img">
                                    <a href="service-details.html?id=${ad.id}">
                                        <img src="${ad.imageUrls[0]}" class="img-fluid" alt="${ad.title}">
                                    </a>
                                    <div class="fav-item">
                                        <a href="javascript:void(0)" class="fav-icon">
                                            <i class="feather-heart"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="bloglist-content">
                                    <div class="card-body">
                                        <div class="blogfeaturelink">
                                            <div class="blog-features">
                                                <a href="javascript:void(0);"><span>${categoryName}</span></a>
                                            </div>
                                            <div class="blog-author">
                                                <div class="blog-author-img">
                                                    <i class="fa fa-user"></i>
                                                </div>
                                                <a href="javascript:void(0);">${ad.userName}</a>
                                            </div>
                                        </div>
                                        <h6><a href="service-details.html?id=${ad.id}">${ad.title}</a></h6>
                                        <div class="blog-location-details">
                                            <div class="location-info">
                                                <i class="feather-map-pin"></i> ${locationName}
                                            </div>
                                        </div>
                                        <div class="amount-details">
                                            <div class="amount">
                                                <span class="validrate">Rs. ${ad.price.toLocaleString()}</span>
                                            </div>
                                            <a href="service-details.html?id=${ad.id}">View details</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                        adsContainer.append(adHtml);
                    });
                }
            },
            error: function(error) {
                console.error("Error fetching ads:", error);
            }
        });
    }
});
