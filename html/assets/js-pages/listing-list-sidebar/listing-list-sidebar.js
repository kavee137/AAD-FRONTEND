$(document).ready(function () {
    let categoryMap = {};
    let locationMap = {};
    let excludeCategory = "21bf6dc0-07b1-11f0-b8c1-83ce8323275c"; // Excluded category ID

    let categoryDeferred = $.Deferred();
    let locationDeferred = $.Deferred();

    // Fetch all categories
    $.ajax({
        url: "http://localhost:8082/api/v1/category/getAll",
        type: "GET",
        dataType: "json",
        success: function (categories) {
            categories.forEach(category => {
                categoryMap[category.id] = category.name;
            });
            categoryDeferred.resolve(); // Mark category fetch as complete
        },
        error: function(error) {
            console.error("Error fetching categories:", error);
            categoryDeferred.resolve(); // Prevent hanging if error occurs
        }
    });

    // Fetch locations excluding a specific parent category
    $.ajax({
        url: `http://localhost:8082/api/v1/location/allSubCategories/exclude/${excludeCategory}`,
        type: "GET",
        dataType: "json",
        success: function (locations) {
            locations.forEach(location => {
                locationMap[location.id] = location.name;
            });
            locationDeferred.resolve(); // Mark location fetch as complete
        },
        error: function(error) {
            console.error("Error fetching locations:", error);
            locationDeferred.resolve(); // Prevent hanging if error occurs
        }
    });

    // Wait for both AJAX calls to complete before loading ads
    $.when(categoryDeferred, locationDeferred).done(function () {
        loadAllActiveAds();
    });

    // Load active ads function
    function loadAllActiveAds() {
        $.ajax({
            url: "http://localhost:8082/api/v1/ad/getAllActiveAds",
            type: "GET",
            dataType: "json",
            success: function(response) {
                if (response.code === 200) {
                    let adsContainer = $('#ads-container');
                    adsContainer.empty();

                    response.data.forEach(ad => {
                        let categoryName = categoryMap[ad.categoryId] || "Unknown Category";
                        let locationName = locationMap[ad.locationId] || "Unknown Location"; // Get location name

                        let timeAgo = moment(ad.createdAt).fromNow();

                        let adHtml = `
                            <div class="card">
                                <div class="blog-widget">
                                    <div class="blog-img">
                                        <a href="product.html?id=${ad.id}">
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
                                                    <a href="javascript:void(0);"><i class="fa fa-user-circle"></i>${ad.userName}</a>
                                                </div>
                                            </div>
                                            <h6><a href="product.html?id=${ad.id}">${ad.title}</a></h6>
                                            <div class="blog-location-details">
                                                <div class="location-info">
                                                    <i class="feather-map-pin"></i> ${locationName}
                                                </div>
                                                <div class="posted-time">
                                                <i class="fa fa-clock"></i> ${timeAgo}
                                            </div>
                                            </div>
                                            <div class="amount-details">
                                                <div class="amount">
                                                    <span class="validrate">Rs. ${ad.price.toLocaleString()}</span>
                                                </div>
                                                <a href="product.html?id=${ad.id}">View details</a>
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
