load('config.js');

function execute(url) {
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];

        var elements = doc.select(".book-like a");
        for (var i = 0; i < elements.size(); i++) {
            var e = elements.get(i);
            var link = e.attr("href");
            var name = e.select("h4").first().text();
            
            var img = e.select("img").first();
            var cover = img.attr("data-src");
            if (!cover) {
                cover = img.attr("data-original");
            }
            if (!cover) {
                cover = img.attr("src");
            }
            
            if (cover && cover.indexOf("static.aaccnn.com") !== -1) {
                cover = cover.replace("static.aaccnn.com", "static.aaddbb.com");
            }
            
            var author = e.select("span").first().text();
            
            if (!name) {
                name = e.attr("title");
            }
            
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

        return Response.success(data);
    }
    return null;
}