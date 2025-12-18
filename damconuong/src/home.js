load('config.js');
function execute() {
    return Response.success([
        {title: "Truyện Nhà Làm", input: BASE_URL + "/nhom-dich/dam-co-nuong", script: "gen.js"},
        {title: "TOP Ngày", input: BASE_URL + "/tim-kiem?sort=-views_day&page=", script: "gen.js"},
        {title: "TOP Tuần", input: BASE_URL + "/tim-kiem?sort=-views_week&page=", script: "gen.js"},
        {title: "TOP Tổng", input: BASE_URL + "/tim-kiem?sort=-views&page=", script: "gen.js"}
    ]);
}