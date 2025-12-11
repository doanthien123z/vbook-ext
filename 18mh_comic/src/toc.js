load('config.js');

function execute(url) {
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];

        var elems = doc.select("div.menu-list ul li a");

        for (var i = 0; i < elems.size(); i++) {
            var e = elems.get(i);
            var link = e.attr("href");
            var title = e.text();

            if (link.indexOf("http") === -1) link = BASE_URL + link;

            data.push({
                name: title,
                url: link,
                host: BASE_URL
            });
        }
        
        return Response.success(data);
    }
    return null;
}