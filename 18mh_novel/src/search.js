load('config.js');

function execute(key, page) {
    if (!page) page = '1';
    
    var searchUrl = BASE_URL + "/novel/search?key_word=" + encodeURIComponent(key);
    
    if (page !== '1') {
        searchUrl += "&page=" + page;
    }

    var response = fetch(searchUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];

        var elems = doc.select(".novel-card");
        
        for (var i = 0; i < elems.size(); i++) {
            var e = elems.get(i);

            var linkNode = e.select("a").first();
            var link = linkNode.attr("href");
            if (link.indexOf("http") === -1) link = BASE_URL + link;

            var imgNode = e.select("img").first();
            var cover = imgNode.attr("data-src");
            if (!cover) cover = imgNode.attr("src");
            if (cover && cover.indexOf("http") === -1 && cover.indexOf("data:image") === -1) {
                 cover = BASE_URL + cover;
            }

            if (cover) {
                 cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }

            var titleNode = e.select(".dx-title").first();
            var name = "";
            if (titleNode) {
                titleNode.select("span").remove();
                name = titleNode.text().trim();
            }

            var description = "";
            var descNode = e.select(".ml-1 div.mb-1").first();
            if (descNode) {
                description = descNode.text().replace("作者：", "").trim();
            }

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL
            });
        }

        var next = parseInt(page) + 1;
        if (elems.size() === 0) {
            next = null;
        }

        return Response.success(data, next);
    }
    return null;
}