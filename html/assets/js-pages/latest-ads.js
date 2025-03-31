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






    // Ensure Moment.js is loaded
    if (typeof moment === "undefined") {
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js");
    }

    function loadAllActiveAds() {
        $.ajax({
            url: `http://localhost:8082/api/v1/ad/getAllActiveAds?_=${new Date().getTime()}`, // Cache Bypass
            type: "GET",
            dataType: "json",
            success: function (response) {
                console.log("Ads data:", response);  // Log the response
                if (response.code === 200) {
                    let adsContainer = $('.lateestads-content .row');
                    adsContainer.html("");

                    response.data.forEach(ad => {
                        let timeAgo = moment(new Date(ad.createdAt)).fromNow(); // Convert createdAt to "time ago" format
                        let categoryName = categoryMap[ad.categoryId] || "Unknown Category";
                        let locationName = locationMap[ad.locationId] || "Unknown Location";
                        let firstImage = ad.imageUrls.length > 0 ? ad.imageUrls[0] : "html/assets/img/placeholder.png";

                        let adHtml = `
                    <div class="col-lg-3 col-md-4 col-sm-6 d-flex">
                        <div class="card aos flex-fill" data-aos="fade-up">
                            <div class="blog-widget">
                                <div class="blog-img">
                                    <a href="html/service-details.html?id=${ad.id}">
                                        <img src="${firstImage}" class="img-fluid" alt="${ad.title}">
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
                                                <a href="javascript:void(0)"><span><i class="fa-regular fa-circle-stop"></i> ${categoryName}</span></a>
                                            </div>                                                                  
                                            <div class="blog-author text-end"> 
                                            </div>
                                        </div> 
                                        <h6><a href="html/service-details.html?id=${ad.id}">${ad.title}</a></h6>
                                        <div class="blog-location-details">
                                            <div class="location-info">
                                                <i class="feather-map-pin"></i> ${locationName}
                                            </div>
                                            <div class="location-info">
                                                <i class="fa-solid fa-calendar-days"></i> ${timeAgo}
                                            </div>
                                        </div>
                                        <div class="amount-details">
                                            <div class="amount">
                                                <span class="validrate">Rs. ${ad.price.toLocaleString()}</span>
                                            </div>
                                        </div>    
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
            error: function (error) {
                console.error("Error fetching ads:", error);
                setInterval(loadAllActiveAds, 30000); // Auto-refresh every 30 seconds
            }
        });
    }



    });
