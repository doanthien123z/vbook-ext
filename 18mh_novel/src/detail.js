load('config.js');

function execute(url) {
    url = url.replace(/\/$/, "");
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();
        
        var name = doc.select(".dx-title h1").text().trim();
        var cover = doc.select(".poster img").attr("data-src");
        if (!cover) cover = doc.select(".poster img").attr("src");
        if (cover && cover.indexOf("http") === -1) cover = BASE_URL + cover;
        
        if (cover) {
            cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
        }

        var author = "";

        var genres = [];

        var themeList = [];
        var themeDivs = doc.select("div.line-clamp-1");
        for (var i = 0; i < themeDivs.size(); i++) {
            var div = themeDivs.get(i);
            if (div.text().indexOf("题材：") !== -1) {
                var links = div.select("a");
                for (var j = 0; j < links.size(); j++) {
                    var link = links.get(j);
                    var txt = link.text().trim();
                    themeList.push(txt);
                    
                    genres.push({
                        title: txt,
                        input: BASE_URL + link.attr("href"),
                        script: "gen.js"
                    });
                }
                break;
            }
        }
        var themes = themeList.join(", ");

        var tagList = [];
        var tagDivs = doc.select("div.mb-2");
        for (var k = 0; k < tagDivs.size(); k++) {
            var div2 = tagDivs.get(k);
            if (div2.text().indexOf("标签：") !== -1 || div2.text().indexOf("Thẻ") !== -1) {
                var tLinks = div2.select("a");
                for (var m = 0; m < tLinks.size(); m++) {
                    var tLink = tLinks.get(m);
                    var tTxt = tLink.text().trim();
                    tagList.push(tTxt);

                    genres.push({
                        title: tTxt,
                        input: BASE_URL + tLink.attr("href"),
                        script: "gen.js"
                    });
                }
                break;
            }
        }
        var tags = tagList.join(", ");

        var description = "";
        var descNodes = doc.select("div:contains(小说简介：)");
        if (descNodes.size() > 0) {
            var targetNode = descNodes.get(descNodes.size() - 1);
            description = targetNode.text()
                .replace("小说简介：", "")
                .replace("简介：", "")
                .replace("Tóm tắt:", "")
                .trim();
        }

        var detailHtml = "Thể loại: " + themes + "<br>" +
                         "Thẻ: " + tags;

        var ongoing = doc.html().indexOf("连载") !== -1 || doc.html().indexOf("Đang diễn ra") !== -1;

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: detailHtml,
            ongoing: ongoing,
            genres: genres,
            host: BASE_URL
        });
    }
    return null;
}