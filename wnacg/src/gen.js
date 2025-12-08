load('config.js');

function execute(url, page) {
    if (!page || page === '1') {
        if (url === BASE_URL + "/albums-index-page-{{page}}.html") {
            url = BASE_URL + "/albums.html";
        } 
        else {
            url = url.replace("-page-{{page}}", "");
        }
    } else {
        url = url.replace("{{page}}", page);
    }

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

        elems.forEach(function(e) {
            var titleNode = e.select(".title a").first();
            var coverNode = e.select(".pic_box img").first();
            var infoNode = e.select(".info_col").first();

            var name = titleNode.text();
            var link = titleNode.attr("href");
            var cover = coverNode.attr("src");
            var description = infoNode ? infoNode.text() : "";

            if (cover && cover.indexOf("//") === 0) {
                cover = "https:" + cover;
            }

            if (link && link.indexOf("/") === 0) {
                link = BASE_URL + link;
            }

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL
            });
        });

        var next = null;
        var nextBtn = doc.select(".paginator .next a").first();
        if (nextBtn) {
            var currentPage = parseInt(page || '1');
            next = (currentPage + 1).toString();
        }

        return Response.success(data, next);
    }

    return Response.error("Lỗi kết nối: " + response.status);
}