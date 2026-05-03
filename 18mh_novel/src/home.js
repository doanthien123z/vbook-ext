load('config.js');

function execute() {
    return Response.success([
        {title: "Tất cả tiểu thuyết", input: "/novel/all", script: "gen.js"},
        {title: "Mới cập nhật", input: "/novel/newest", script: "gen.js"},
        {title: "Mới tải lên", input: "/novel/last_published", script: "gen.js"},
        {title: "Nổi tiếng", input: "/novel/hot", script: "gen.js"},
        {title: "Truyện gốc", input: "/novel/original", script: "gen.js"}
    ]);
}