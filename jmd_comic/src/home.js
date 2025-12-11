load('config.js');

function execute() {
    return Response.success([
        {title: "Home", input: BASE_URL + "/catalog/all/ob/time/st/all", script: "gen.js"},
        {title: "3D", input: BASE_URL + "/catalog/3D漫画/ob/time/st/all", script: "gen.js"},
        {title: "Mới cập nhật", input: BASE_URL + "/update", script: "gen.js"},
        {title: "Mới ra mắt", input: BASE_URL + "/update/newbook", script: "gen.js"},
        {title: "Đề xuất", input: BASE_URL + "/update/recommend", script: "gen.js"},
        {title: "BXH Tổng", input: BASE_URL + "/rank/all", script: "gen.js"},
        {title: "BXH Ngày", input: BASE_URL + "/rank/daily", script: "gen.js"},
        {title: "BXH Tuần", input: BASE_URL + "/rank", script: "gen.js"},
        {title: "BXH Tháng", input: BASE_URL + "/rank/monthly", script: "gen.js"}
    ]);
}