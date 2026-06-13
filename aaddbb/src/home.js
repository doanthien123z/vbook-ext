load('config.js');

function execute() {
    return Response.success([
        {title: "最新小说", input: BASE_URL + "/top/new/", script: "gen.js"},
        {title: "肉量排行", input: BASE_URL + "/top/pornrate/", script: "gen.js"},
        {title: "人气排行", input: BASE_URL + "/top/hot/", script: "gen.js"},
        {title: "收藏排行", input: BASE_URL + "/top/collect/", script: "gen.js"},
        {title: "热门全本", input: BASE_URL + "/top/wanben/", script: "gen.js"}
    ]);
}