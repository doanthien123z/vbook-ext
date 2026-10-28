function parseList(doc) {
    var data = [];
    var elements = doc.select("li.jm-card, a.jm-rrow");
    if (elements.size() === 0) elements = doc.select(".dx-novel-list li");
    if (elements.size() === 0) elements = doc.select(".index-content li");

    elements.forEach(function (e) {
        var link = e.attr("href");
        if (!link) {
            var linkNode = e.select("a.jm-card__link").first() || e.select("a").first();
            if (linkNode) link = linkNode.attr("href");
        }
        if (!link) return;

        var img = e.select("img").first();
        var cover = img ? (img.attr("data-src") || img.attr("src")) : "";
        if (cover && cover.indexOf("loading.svg") !== -1) cover = "";
        if (cover) {
            if (cover.indexOf("http") !== 0) cover = BASE_URL + cover;
            cover = COVER_PROXY + cover;
        }

        var name = e.select(".jm-card__title, .jm-rrow__title").text().trim();
        if (!name) name = e.select("h2, h3").text().trim();
        if (!name && img) name = img.attr("alt");

        var parts = [];

        var author = e.select("a[href*=/author/]").text().trim();
        var cat = "";
        var catNodes = e.select(".jm-card__cat a");
        for (var i = 0; i < catNodes.size(); i++) {
            var href = catNodes.get(i).attr("href");
            if (href && href.indexOf("/author/") === -1) {
                cat = catNodes.get(i).text().trim();
                break;
            }
        }
        var status = e.select(".jm-card__badge--status").text().trim();
        var time = e.select(".jm-publish-time").text().trim();

        if (author) parts.push(author);
        if (cat) parts.push(cat);
        if (status) parts.push(status);
        if (time) parts.push(time);

        var rowType = e.select(".jm-rrow__type").text().trim();
        var rowChap = e.select(".jm-rrow__m").text().trim();
        var rowCat = e.select(".jm-rrow__c").text().trim();
        var rowTime = e.select(".jm-rrow__time").text().trim();

        if (rowType) parts.push(rowType);
        if (rowChap) parts.push(rowChap);
        if (rowCat) parts.push(rowCat);
        if (rowTime) parts.push(rowTime);

        if (name) {
            data.push({
                name: name,
                link: link,
                cover: cover,
                description: parts.join(" | "),
                host: BASE_URL
            });
        }
    });
    return data;
}