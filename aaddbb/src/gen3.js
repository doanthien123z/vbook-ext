load('config.js');

function execute(url, page) {
    var fetchUrl = url;
    
    if (page) {
        fetchUrl = page;
    }

    if (fetchUrl.indexOf("http") === -1) {
        fetchUrl = BASE_URL + fetchUrl;
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
                var href = nextEl.get(j).attr("href");
                if (href && href.indexOf("javascript") === -1) {
                    if (href.indexOf("http") === -1) {
                        if (href.charAt(0) === '/') {
                            next = BASE_URL + href;
                        } else {
                            var tempUrl = url;
                            if (tempUrl.indexOf("http") === -1) {
                                tempUrl = BASE_URL + tempUrl;
                            }
                            if (tempUrl.charAt(tempUrl.length - 1) !== '/') {
                                tempUrl = tempUrl + '/';
                            }
                            next = tempUrl + href;
                        }
                    } else {
                        next = href;
                    }
                }
                break;
            }
        }
        
        return Response.success(data, next);
    }
    
    return null;
}