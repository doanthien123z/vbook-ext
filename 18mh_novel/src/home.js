load('config.js');

function execute() {
    return Response.success([
        {title: "Tất cả tiểu thuyết", input: BASE_URL + "/novel/all", script: "gen.js"},
        {title: "Mới cập nhật", input: BASE_URL + "/novel/newest", script: "gen.js"},
        {title: "Mới thêm vào", input: BASE_URL + "/novel/last_published", script: "gen.js"},
        {title: "Nổi tiếng", input: BASE_URL + "/novel/hot", script: "gen.js"},
        {title: "BXH", input: BASE_URL + "/novel/rank", script: "gen.js"}
    ]);
}