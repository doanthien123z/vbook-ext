load('config.js');
load('parse.js');
function execute(key, page) {
    if (!page) page = '1';
    var searchUrl = BASE_URL + "/novel/search?key_word=" + encodeURIComponent(key);
    if (page !== '1') searchUrl += "&page=" + page;
    var response = fetch(searchUrl);
    if (response.ok) {
        var data = parseList(response.html());
        var next = data.length > 0 ? (parseInt(page) + 1).toString() : null;
        return Response.success(data, next);
    }
    return null;
}
