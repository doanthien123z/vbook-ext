load('config.js');

function execute() {
    return Response.success([
        {title: "Đấu La", input: "/novel/search?key_word=斗罗", script: "gen.js"},
        {title: "Tiểu Vũ", input: "/novel/search?key_word=小舞", script: "gen.js"},
        {title: "Ninh Vinh Vinh", input: "/novel/search?key_word=宁荣荣", script: "gen.js"},
        {title: "Đấu Phá", input: "/novel/search?key_word=斗破", script: "gen.js"}
    ]);
}