load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    var fetchUrl = url;
    if (page !== '1') {
        fetchUrl = url + "?page=" + page;
    }

    var response = fetch(fetchUrl);
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
            if (titleNode) {
                titleNode.select("span").remove();
                var name = titleNode.text().trim();
            } else {
                var name = "";
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
        if (url.indexOf("rank") !== -1 || elems.size() === 0) {
            next = null; 
        }

        return Response.success(data, next);
    }
    return null;
}