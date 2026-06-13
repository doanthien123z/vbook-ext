load('config.js');

function execute(key, page) {
    if (!page) {
        page = '1';
    }

    var fetchUrl = BASE_URL + "/search/?q=" + key + "&page=" + page;
    var response = fetch(fetchUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];
        var elements = doc.select(".novel-item");

        for (var i = 0; i < elements.size(); i++) {
            var e = elements.get(i);
            var link = e.select("a.title").attr("href");
            var name = e.select("a.title").text();

            var img = e.select("img").first();
            var cover = img.attr("data-src");
            if (!cover) {
                cover = img.attr("src");
            }

            if (cover && cover.indexOf("static.aaccnn.com") !== -1) {
                cover = cover.replace("static.aaccnn.com", "static.aaddbb.com");
            }

            var author = e.select(".author").text();

            if (link && link.indexOf("http") === -1) {
                link = BASE_URL + link;
            }

            if (cover && cover.indexOf("http") === -1) {
                if (cover.indexOf("//") === 0) {
                    cover = "https:" + cover;
                } else {
                    cover = BASE_URL + cover;
                }
            }

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: author,
                host: BASE_URL
            });
        }

        var next = null;
        var nextEl = doc.select(".page a");
        for (var j = 0; j < nextEl.size(); j++) {
            if (nextEl.get(j).text().indexOf("下一页") !== -1) {
                var match = nextEl.get(j).attr("href").match(/page=(\d+)/);
                if (match) {
                    next = match[1];
                }
                break;
            }
        }

        return Response.success(data, next);
    }

    return null;
}