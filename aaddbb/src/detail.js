load('config.js');

function execute(url) {
    url = url.replace(/\/$/, "");
    var currentUrl = url;
    
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });
    
    if (response.ok) {
        var doc = response.html();
        
        var name = doc.select(".txt h1").text();
        if (!name) {
            name = doc.select('meta[property="og:title"]').attr("content");
        }
        
        var author = doc.select(".detail .authors a").text();
        if (!author) {
             author = doc.select('meta[property="og:novel:author"]').attr("content");
        }
        if (!author) {
             author = "Unknown";
        }
        
        var cover = doc.select(".cover img").attr("src");
        if (!cover) {
            cover = doc.select('meta[property="og:image"]').attr("content");
        }
        if (cover && cover.indexOf("static.aaccnn.com") !== -1) {
            cover = cover.replace("static.aaccnn.com", "static.aaddbb.com");
        }
        if (cover && cover.indexOf("http") === -1) {
            if (cover.indexOf("//") === 0) {
                cover = "https:" + cover;
            } else {
                cover = BASE_URL + cover;
            }
        }
        
        var description = doc.select(".book-desc").html();
        if (description) {
            var tagIndex = description.indexOf('<div class="tag">');
            if (tagIndex !== -1) {
                description = description.substring(0, tagIndex);
            }
        }
        if (!description) {
            description = doc.select('meta[property="og:description"]').attr("content");
        }
        
        var category = "";
        var catElements = doc.select(".detail .categories a");
        var catList = [];
        for (var c = 0; c < catElements.size(); c++) {
            catList.push(catElements.get(c).text());
        }
        category = catList.join(", ");
        if (!category) {
             category = doc.select('meta[property="og:novel:category"]').attr("content") || "";
        }
        
        var pages = "Không rõ";
        var catalogItems = doc.select(".book-chapter a");
        if (catalogItems.size() > 0) {
            pages = catalogItems.size() + " chương";
        }
        
        var genres = [];
        var tagNames = [];
        var tagElements = doc.select('.book-desc .tag a');
        for (var i = 0; i < tagElements.size(); i++) {
            var tagEl = tagElements.get(i);
            var title = tagEl.text().trim();
            var href = tagEl.attr("href");
            
            if (title && href) {
                tagNames.push(title);
                var fullHref = href;
                if (fullHref.indexOf("http") === -1) {
                     fullHref = BASE_URL + fullHref;
                }
                genres.push({
                    title: title,
                    input: fullHref,
                    script: "gen2.js"
                });
            }
        }
        
        var status = doc.select(".detail .status dd").text();
        var ongoing = true;
        if (status && status.indexOf("已完结") !== -1) {
            ongoing = false;
        }
        
        var detailHtml = "Tên: " + name + "<br>Thể loại: " + category + "<br>Số chương: " + pages + "<br>Nhãn: " + tagNames.join(", ");
        
        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: detailHtml,
            ongoing: ongoing,
            host: BASE_URL,
            genres: genres,
            suggests: [
                {
                    title: "猜你喜欢",
                    input: currentUrl,
                    script: "suggest.js"
                }
            ]
        });
    }
    return null;
}