load('config.js');

function execute(url) {
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var name = doc.select("h2").text();

        var cleanName = name;
        cleanName = cleanName.replace(/(\[.*?\]|\{.*?\}|\(.*?\)|【.*?】|（.*?）)/g, " ");
        cleanName = cleanName.replace(/(vol|ch|chapter|volume)\.?\s*\d+([.,]\d+)?/gi, " ");
        cleanName = cleanName.replace(/(第|卷|巻|話)/g, " ");
        cleanName = cleanName.replace(/(上|中|下|完|End|Final)/gi, " ");
        cleanName = cleanName.replace(/(\d+([.,]\d+)?(\s*[-~]\s*\d+([.,]\d+)?)?)\s*$/g, "");
        cleanName = cleanName.replace(/[:_,\-]/g, " ").trim().replace(/\s+/g, " ");

        if (!cleanName || cleanName.length < 2) {
            cleanName = name;
        }

        var cover = doc.select(".uwthumb img").attr("src");
        if (cover) {
            if (cover.indexOf("//") === 0) {
                cover = "https:" + cover;
            } else if (cover.indexOf("http") !== 0) {
                cover = BASE_URL + cover;
            }
        }

        var author = doc.select(".uwuinfo a p").text();
        var authorMatch = name.match(/^(?:\[|【)(.*?)(?:\]|】)/);
        if (authorMatch && authorMatch[1]) {
            author = authorMatch[1];
        }

        var category = "N/A";
        var pages = "N/A";
        var labels = doc.select(".uwconn label");
        labels.forEach(function(label) {
            var text = label.text();
            if (text.indexOf("分類：") !== -1) category = text.replace("分類：", "").trim();
            if (text.indexOf("頁數：") !== -1) pages = text.replace("頁數：", "").trim();
        });

        var genres = [];
        var tagNames = [];
        doc.select(".addtags a.tagshow").forEach(function(tag) {
            var tagName = tag.text();
            tagNames.push(tagName);
            genres.push({
                title: tagName,
                input: BASE_URL + "/albums-index-page-{{page}}-tag-" + encodeURIComponent(tagName) + ".html",
                script: "gen.js"
            });
        });

        var detailHtml = "Tên: " + name + "<br>Thể loại: " + category + "<br>Số trang: " + pages + "<br>Nhãn: " + tagNames.join(", ") + "<br>Tìm kiếm nhanh: " + author + " | " + cleanName;
        var description = doc.select(".uwconn p").html().replace("簡介：", "");

        return Response.success({
            name: name,
            cover: cover || "https://i.imgur.com/1j44e4t.png",
            author: author || "Unknown",
            description: description,
            detail: detailHtml,
            host: BASE_URL,
            genres: genres,
            suggests: [
                {
                    title: "Theo bộ: " + cleanName,
                    input: cleanName,
                    script: "search.js"
                },
                {
                    title: "Truyện cùng tác giả: " + author,
                    input: author,
                    script: "search.js"
                }
            ]
        });
    }
    return null;
}