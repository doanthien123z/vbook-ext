load('config.js');

function execute() {
    return Response.success([
        {title: "Mới nhất", input: BASE_URL + "/tongren/", script: "gen.js"},
        {title: "Đồng nhân dài", input: BASE_URL + "/tags-150-0.html", script: "gen.js"},
        {title: "Đồng nhân dài kỳ", input: BASE_URL + "/tags-151-0.html", script: "gen.js"},
        {title: "Bảng xếp hạng", input: BASE_URL + "/rating/", script: "gen.js"}
    ]);
}