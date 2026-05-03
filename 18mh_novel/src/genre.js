load('config.js');

function execute() {
    return Response.success([
        {title: "Đấu La", input: "/novel/search?key_word=斗罗", script: "gen.js"},
        {title: "Tiểu Vũ", input: "/novel/search?key_word=小舞", script: "gen.js"},
        {title: "Ninh Vinh Vinh", input: "/novel/search?key_word=宁荣荣", script: "gen.js"},
        {title: "Đấu Phá", input: "/novel/search?key_word=斗破", script: "gen.js"},
        {title: "都市激情", input: "/novel/all/dsjq", script: "gen.js"},
        {title: "校园春色", input: "/novel/all/xycs", script: "gen.js"},
        {title: "乡村爱情", input: "/novel/all/xcaq", script: "gen.js"},
        {title: "系统异能", input: "/novel/all/xtyn", script: "gen.js"},
        {title: "家庭乱伦", input: "/novel/all/jtll", script: "gen.js"},
        {title: "穿越重生", input: "/novel/all/cycs", script: "gen.js"},
        {title: "经典武侠", input: "/novel/all/jdwx", script: "gen.js"},
        {title: "同人改编", input: "/novel/all/trgb", script: "gen.js"},
        {title: "科学幻想", input: "/novel/all/kxhx", script: "gen.js"},
        {title: "东方玄幻", input: "/novel/all/dfxh", script: "gen.js"},
        {title: "娱乐明星", input: "/novel/all/ylmx", script: "gen.js"},
        {title: "历史架空", input: "/novel/all/lsjk", script: "gen.js"},
        {title: "西方魔幻", input: "/novel/all/xfmh", script: "gen.js"},
        {title: "贤者小说", input: "/novel/all/xzxs", script: "gen.js"}
    ]);
}