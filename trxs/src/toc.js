load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var response = fetch(url);
    if (response.ok) {
        var doc = response.html('gbk');
        var el = doc.select(".book_list ul li a");
        var data = [];
        
        el.forEach(function(e) {
            var name = e.text();
            var link = e.attr("href");

            if (link.indexOf("http") === -1) link = BASE_URL + link;

            data.push({
                name: name,
                url: link,
                host: BASE_URL
            });
        });
        return Response.success(data);
    }
    return null;
}