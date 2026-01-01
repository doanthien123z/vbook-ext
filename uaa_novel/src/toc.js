load('config.js');

function execute(url) {
    var doc = Http.get(url).html();
    var data = [];
    var elems = doc.select(".catalog_ul li a");
    elems.forEach(function(e) {
        var name = e.text();
        var link = e.attr("href");
        if (link.startsWith("/")) {
            link = BASE_URL + link;
        }
        data.push({
            name: name,
            url: link,
            host: BASE_URL
        });
    });
    return Response.success(data);
}