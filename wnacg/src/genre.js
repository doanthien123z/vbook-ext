load('config.js');

function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/albums-index-page-{{page}}.html", script: "gen.js" },
        { title: "Truyện tranh 3D", input: BASE_URL + "/albums-index-page-{{page}}-cate-22.html", script: "gen.js" },
        { title: "Cosplay", input: BASE_URL + "/albums-index-page-{{page}}-cate-3.html", script: "gen.js" },
        { title: "Hán hóa (Trung)", input: BASE_URL + "/albums-index-page-{{page}}-cate-1.html", script: "gen.js" },
        { title: "Tiếng Nhật", input: BASE_URL + "/albums-index-page-{{page}}-cate-12.html", script: "gen.js" },
        { title: "Tiếng Anh", input: BASE_URL + "/albums-index-page-{{page}}-cate-16.html", script: "gen.js" }
    ]);
}