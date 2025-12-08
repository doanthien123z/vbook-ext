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
        
        elems.forEach(function(e) {
            var linkNode = e.select("a").first();
            var link = linkNode.attr("href");
            if (link.indexOf("http") === -1) link = BASE_URL + link;

            var imgNode = e.select("img").first();
            var cover = imgNode.attr("data-src");
            if (!cover) cover = imgNode.attr("src");
            if (cover && cover.indexOf("http") === -1 && cover.indexOf("data:image") === -1) {
                 cover = BASE_URL + cover;
            }

            var titleNode = e.select(".dx-title").first();
            titleNode.select("span").remove();
            var name = titleNode.text().trim();

            var description = e.select(".ml-1 div.mb-1").first().text().replace("作者：", "").trim();

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL
            });
        });

        var next = parseInt(page) + 1;
        if (url.indexOf("rank") !== -1 || elems.size() === 0) {
            next = null; 
        }

        return Response.success(data, next);
    }
    return null;
}