load('config.js');

function execute() {
    return Response.success([
        {title: "Tất Cả", input: BASE_URL + "/comic/all?page={{page}}", script: "gen.js"},
        {title: "Mới Cập Nhật", input: BASE_URL + "/comic/newest?page={{page}}", script: "gen.js"},
        {title: "Truyện Mới", input: BASE_URL + "/comic/freshest?page={{page}}", script: "gen.js"},
        {title: "Phổ Biến", input: BASE_URL + "/comic/hot?page={{page}}", script: "gen.js"},
        {title: "Bảng Xếp Hạng", input: BASE_URL + "/comic/rank", script: "gen.js"}
    ]);
}