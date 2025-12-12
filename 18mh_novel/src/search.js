load('config.js');

function execute(key, page) {
    if (!page) page = '1';
    
    var searchUrl = BASE_URL + "/novel/search?key_word=" + encodeURIComponent(key);
    if (page !== '1') {
        searchUrl += "&page=" + page;
    }

    var response = fetch(searchUrl);

    if (response.ok) {
        var doc = response.html();
        var data = [];

        var elements = doc.select(".index-content li");
        
        elements.forEach(e => {
            var a = e.select("a").first();
            var link = a.attr("href");
            if (link.indexOf("http") === -1) link = BASE_URL + link;

            var img = e.select("img").first();
            var cover = img.attr("data-src");
            if (!cover) cover = img.attr("src");
            
            if (cover) {
                if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
                // Proxy ảnh như bạn đã cấu hình
                cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }

            var name = "";
            var nameNode = e.select(".truncate a").first();
            if (nameNode) {
                name = nameNode.text().trim();
            } else {
                var links = e.select("a");
                if (links.size() > 1) {
                    name = links.get(1).text().trim();
                }
            }
            if (!name && img) name = img.attr("alt");

            var description = "";
            
            var authorNode = e.select(".block .flex.justify-between span").first();
            var author = authorNode ? authorNode.text().trim() : "";

            var timeNode = e.select(".block .flex.items-center .mr-auto").first();
            var time = timeNode ? timeNode.text().trim() : "";

            if (author) description += author;
            if (time) {
                if (description) description += " | ";
                description += time;
            }

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL
            });
        });

        var next = (parseInt(page) + 1).toString();
        if (elements.size() === 0) {
             next = null;
        }

        return Response.success(data, next);
    }
    return null;
}