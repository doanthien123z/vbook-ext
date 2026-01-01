load('config.js');

function execute() {
    return Response.success([
        {
            title: "Trang chủ",
            input: BASE_URL + "/novel/list?keyword=&searchType=1&author=&category=&finished=&space=&source=&tag=&sort=2&page=1",
            script: "gen.js"
        },
        {
            title: "Mới phát hành",
            input: BASE_URL + "/novel/new?keyword=&sort=1&page=1",
            script: "gen.js"
        },
        {
            title: "BXH",
            input: BASE_URL + "/novel/rank",
            script: "gen.js"
        },
        {
            title: "TOP Bình luận",
            input: BASE_URL + "/novel/rank?type=4",
            script: "gen.js"
        },
        {
            title: "Bảng tuần",
            input: BASE_URL + "/novel/rank?type=1",
            script: "gen.js"
        },
        {
            title: "Bảng tháng",
            input: BASE_URL + "/novel/rank?type=2",
            script: "gen.js"
        },
        {
            title: "Bảng năm",
            input: BASE_URL + "/novel/rank?type=3",
            script: "gen.js"
        }
    ]);
}