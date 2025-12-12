load('config.js');

function execute() {
    return Response.success([
        {title: "Tất cả tiểu thuyết", input: "/novel/all?", script: "gen.js"},
        {title: "Mới cập nhật", input: "/novel/common?type=newest&", script: "gen.js"},
        {title: "Mới thêm vào", input: "/novel/common?type=last_published&", script: "gen.js"},
        {title: "Nổi tiếng", input: "/novel/common?type=hot&", script: "gen.js"},
        {title: "BXH", input: "/novel/rank?", script: "gen.js"}
    ]);
}