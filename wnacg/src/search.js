load('config.js');

function execute(key, page) {
    if (!page) page = '1';

    var encodedKey = encodeURIComponent(key).replace(/%20/g, "+");

    var url = BASE_URL + "/search/?q=" + encodedKey + "&f=_all&s=create_time_DESC&syn=yes&p=" + page;

    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];

        var elems = doc.select("li.gallary_item");
        
        if (elems.size() === 0) {
            elems = doc.select("li.box, li.item");
        }

        elems.forEach(function(e) {
            var titleNode = e.select(".title a").first();
            var coverNode = e.select(".pic_box img").first();
            var infoNode = e.select(".info_col").first();

            var name = titleNode.text();
            var link = titleNode.attr("href");
            var cover = coverNode.attr("src");
            
            var description = infoNode ? infoNode.text().replace(/\n/g, " ").trim() : "";

            if (cover) {
                if (cover.indexOf("//") === 0) {
                    cover = "https:" + cover;
                } else if (cover.indexOf("http") !== 0) {
                    cover = BASE_URL + cover;
                }
            }

            if (link && link.indexOf("/") === 0) {
                link = BASE_URL + link;
            }

            if (name && link) {
                data.push({
                    name: name,
                    link: link,
                    cover: cover || "https://i.imgur.com/1j44e4t.png",
                    description: description,
                    host: BASE_URL
                });
            }
        });

        var next = null;
        var nextBtn = doc.select(".paginator .next a").first();
        if (nextBtn) {
            next = (parseInt(page) + 1).toString();
        }

        return Response.success(data, next);
    }

    return Response.error("Lỗi kết nối: " + response.status);
}