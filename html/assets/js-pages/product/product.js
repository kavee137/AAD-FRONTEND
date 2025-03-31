$(document).ready(function () {
    // Get adId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const adId = urlParams.get("id");

    console.log("Ad id : " + adId);

    if (!adId) {
        console.error("No Ad ID found in the URL");
        return;
    }

    // Fetch ad details using AJAX
    $.ajax({
        url: `http://localhost:8082/api/v1/ad/getAdDetailsByAdId/${adId}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (!data || Object.keys(data).length === 0) {
                console.error("Ad data not found");
                return;
            }

            // Set title, category, and price
            $(".product-title").text(data.title);
            $(".views-count").text(data.categoryName || "Unknown Category");
            $(".price").text(`Rs ${data.price.toLocaleString()}`);

            // Set description
            let descriptionHTML = `<h2 class="description-title">Description</h2>`;
            data.description.split("\n").forEach(para => {
                descriptionHTML += `<p>${para}</p>`;
            });
            $(".description").html(descriptionHTML);

            // Set main image
            if (data.imageUrls && data.imageUrls.length > 0) {
                $(".product-image").attr("src", data.imageUrls[0]);

                // Set thumbnails
                let thumbnailHTML = "";
                data.imageUrls.forEach((imgUrl, index) => {
                    thumbnailHTML += `<img src="${imgUrl}" class="thumbnail ${index === 0 ? 'active' : ''}" alt="Thumbnail ${index + 1}">`;
                });

                $(".thumbnail-container").html(thumbnailHTML);

                // Add click event to change main image
                $(".thumbnail").click(function () {
                    $(".product-image").attr("src", $(this).attr("src"));
                    $(".thumbnail").removeClass("active");
                    $(this).addClass("active");
                });
            }

            // Set seller info
            $(".seller-name").text(data.userName || "Unknown Seller");
            $(".contact-btn div div").text(data.phone || "Not Available");

        },
        error: function (error) {
            console.error("Error fetching ad details:", error);
        }
    });
});
