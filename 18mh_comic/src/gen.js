load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    if (page === '1') {
        url = url.replace("?page={{page}}", "").replace("&page={{page}}", "");
    } else {
        url = url.replace("{{page}}", page);
    }

    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];
        var elems = doc.select("ul.dx-novel-list li");

        for (var i = 0; i < elems.size(); i++) {
            var e = elems.get(i);
            
            var link = e.select("a").first().attr("href");
            var name = e.select(".truncate").first().text();
            
            var imgNode = e.select(".poster img").first();
            var cover = "";
            
            if (imgNode) {
                cover = imgNode.attr("data-src");
                if (!cover) cover = imgNode.attr("src");
            }
            
            if (!name && imgNode) name = imgNode.attr("alt");

            if (link.indexOf("http") === -1) link = BASE_URL + link;
            if (cover && cover.indexOf("http") === -1) cover = BASE_URL + cover;

            if (cover) {
                 cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: "",
                host: BASE_URL
            });
        }
        
        if (data.length === 0 || url.indexOf("rank") !== -1) {
            return Response.success(data, null);
        }
        var next = parseInt(page) + 1;
        return Response.success(data, next.toString());
    }
    return null;
}