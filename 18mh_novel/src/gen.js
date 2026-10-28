load('config.js');
load('parse.js');
function execute(url, page) {
    if (!page) page = '1';
    if (url.indexOf("http") !== 0) url = BASE_URL + url;
    var currentUrl = url;
    if (page !== '1') {
        if (currentUrl.indexOf("?") !== -1) {
            currentUrl = currentUrl + "&page=" + page;
        } else {
            currentUrl = currentUrl.replace(/\/$/, "") + "/page/" + page;
        }
    }
    var response = fetch(currentUrl);
    if (response.ok) {
        var data = parseList(response.html());
        var next = data.length > 0 ? (parseInt(page) + 1).toString() : null;
        return Response.success(data, next);
    }
    return null;
}
