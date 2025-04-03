$(document).ready(function () {
    $.ajax({
        url: "http://localhost:8082/api/v1/category/getAll",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let tableBody = $("#categoryTable-body");
            tableBody.empty(); // Clear previous data

            let defaultImage = "assets/img/default-category-image.png"; // Default image path
            let parentCategoryId = "550e8400-e29b-41d4-a716-446655440000"; // Target parent category ID

            let filteredData = data.filter(category => category.parentCategoryId === parentCategoryId);

            filteredData.forEach(function (category, index) {
                let imageUrl = category.imageUrl ? "http://localhost:8082/" + category.imageUrl : defaultImage; // Check if imageUrl is null

                // Create URL parameters for category details
                let editUrl = `edit-categories.html?id=${category.id}&name=${encodeURIComponent(category.name)}&imageUrl=${encodeURIComponent(category.imageUrl || '')}&parentCategoryId=${encodeURIComponent(category.parentCategoryId || '')}`;

                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <div class="table-imgname">
                                <img src="${imageUrl}" class="me-2" alt="img">
                            </div>
                        </td>
                        <td>${category.name}</td>
                        <td>
                            <div class="table-actions d-flex">
                                <a class="delete-table me-2" href="${editUrl}">
                                    <img src="assets/img/icons/edit.svg" alt="edit">
                                </a>
                                <a class="delete-table" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete-item">
                                    <img src="assets/img/icons/delete.svg" alt="delete">
                                </a>
                            </div>
                        </td>
                    </tr>
                `;

                tableBody.append(row);
            });

            if (filteredData.length === 0) {
                tableBody.append(`<tr><td colspan="4" class="text-center">No categories found</td></tr>`);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching categories:", error);
        }
    });
});
