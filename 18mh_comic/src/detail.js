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
        if (!name) name = doc.select(".truncate").first().text().trim();

        var imgNode = doc.select(".poster img").first();
        var cover = "";
        if (imgNode) {
             cover = imgNode.attr("data-src") || imgNode.attr("src");
        }
        if (cover && cover.indexOf("http") === -1) cover = BASE_URL + cover;
        if (cover) cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;

        var author = "Unknown";
        var divs = doc.select("div");
        for (var i = 0; i < divs.size(); i++) {
            var div = divs.get(i);
            if (div.text().indexOf("作者：") !== -1) {
                var a = div.select("a").first();
                if (a) {
                    author = a.text().replace(/单本/g, "").replace(/小说/g, "").trim();
                    break;
                }
            }
        }

        var genres = [];

        function getLinksFromContainer(label) {
            var listText = [];
            var elements = doc.select("div.line-clamp-1, div.mb-1, div.mb-2"); 
            
            for (var i = 0; i < elements.size(); i++) {
                var el = elements.get(i);
                if (el.text().indexOf(label) !== -1) {
                    var links = el.select("a");
                    for (var j = 0; j < links.size(); j++) {
                        var link = links.get(j);
                        
                        var txt = link.text().trim(); 
                        var href = link.attr("href");

                        if (txt && label.indexOf(txt) === -1) {
                            listText.push(txt);
                            genres.push({
                                title: txt,
                                input: BASE_URL + href,
                                script: "gen.js"
                            });
                        }
                    }
                    return listText.join(", ");
                }
            }
            return "";
        }

        var categoryText = getLinksFromContainer("分类：");
        if (!categoryText) categoryText = getLinksFromContainer("题材：");

        var tagsText = getLinksFromContainer("标签：");
        if (!tagsText) tagsText = getLinksFromContainer("Tags");

        var latest = "Đang cập nhật";
        var ongoing = true;
        
        for (var k = 0; k < divs.size(); k++) {
            var text = divs.get(k).text();
            if (text.indexOf("最新：") !== -1) {
                latest = text.replace("最新：", "").trim();
            }
            if (text.indexOf("状态：") !== -1) {
                ongoing = text.indexOf("连载") !== -1 || text.indexOf("Đang diễn ra") !== -1;
            }
        }

        var description = "";
        var introDiv = doc.select(".intro-content").first();
        if (introDiv) {
            description = introDiv.text().trim();
        } else {
             for (var m = 0; m < divs.size(); m++) {
                 var d = divs.get(m);
                 if (d.text().indexOf("简介：") !== -1 && d.text().length > 20) {
                     description = d.text().replace(/.*简介：/, "").trim();
                     break;
                 }
             }
        }
        if (!description) description = doc.select('meta[name="description"]').attr('content');

        var detailHtml = "<b>Tên:</b> " + name + "<br>" +
                         "<b>Tác giả:</b> " + author + "<br>" +
                         "<b>Thể loại:</b> " + categoryText + "<br>" +
                         "<b>Mới nhất:</b> " + latest + "<br>" +
                         "<b>Thẻ:</b> " + tagsText;

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