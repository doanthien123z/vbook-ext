load('config.js');

function execute() {
    return Response.success([
        {title: "Đấu La", input: BASE_URL + "/e/search/result/?searchid=5991556", script: "gen.js"}
    ]);
}