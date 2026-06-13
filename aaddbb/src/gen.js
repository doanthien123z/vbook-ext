load('config.js');

function execute(url, page) {
    if (!page) {
        page = '1';
    }

    var fetchUrl = url;
    if (page !== '1') {
        if (fetchUrl.charAt(fetchUrl.length - 1) !== '/') {
            fetchUrl = fetchUrl + '/';
        }
        fetchUrl = fetchUrl + "index_" + page + ".html";
    }

    var response = fetch(fetchUrl, {
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
        
        var next = null;
        var nextEl = doc.select(".page a");
        for (var j = 0; j < nextEl.size(); j++) {
            if (nextEl.get(j).text().indexOf("下一页") !== -1) {
                var nextUrl = nextEl.get(j).attr("href");
                var match = nextUrl.match(/index_(\d+)\.html/);
                if (match) {
                    next = match[1];
                }
                break;
            }
        }
        
        if (!next && data.length > 0) {
            var currentPage = parseInt(page);
            var maxPageText = doc.select(".page span").text();
            if (maxPageText && maxPageText.indexOf("/") !== -1) {
                var maxPage = parseInt(maxPageText.split("/")[1]);
                if (currentPage < maxPage) {
                    next = (currentPage + 1).toString();
                }
            } else {
                next = (currentPage + 1).toString();
            }
        }
        
        return Response.success(data, next);
    }
    
    return null;
}