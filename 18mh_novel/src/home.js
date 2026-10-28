load('config.js');

function execute() {
    return Response.success([
        {title: "Tiểu thuyết", input: "/novel/all", script: "gen.js"},
        {title: "Mới nhất", input: "/novel/newest", script: "gen.js"},
        {title: "Mới xuất bản", input: "/novel/last_published", script: "gen.js"},
        {title: "Nổi tiếng", input: "/novel/hot", script: "gen.js"},
        {title: "Truyện gốc", input: "/novel/original", script: "gen.js"},
        
        {title: "BXH Phổ biến", input: "/novel/rank", script: "rank.js"},
        {title: "BXH Sưu tập", input: "/rank/board?theme=novel&sort=favorite&period=day", script: "rank.js"},
        {title: "BXH Phát hành", input: "/rank/board?theme=novel&sort=new&period=day", script: "rank.js"},
        {title: "BXH Hoàn thành", input: "/rank/board?theme=novel&sort=finished&period=day", script: "rank.js"}
    ]);
}