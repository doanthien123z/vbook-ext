load('config.js');
function execute(key, page) {
    if (!page) page = '1';
    let searchUrl = BASE_URL + "/novel/search?key_word=" + encodeURIComponent(key);
    if (page !== '1') {
        searchUrl += "&page=" + page;
    }
    let response = fetch(searchUrl);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        let elements = doc.select(".dx-novel-list li");
        if (elements.size() === 0) elements = doc.select(".index-content li");
        elements.forEach(e => {
            let linkNode = e.select("a").first();
            if (!linkNode) return;
            let link = linkNode.attr("href");
            if (link.indexOf("http") === -1) link = BASE_URL + link;
            let img = e.select("img").first();
            let cover = img ? (img.attr("data-src") || img.attr("src")) : "";
            if (cover) {
                if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
                cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }
            let name = e.select("h2").text().trim();
            if (!name) name = e.select("h3").text().trim();
            if (!name) name = e.select(".truncate").text().trim();
            if (!name && img) name = img.attr("alt");
            let author = e.select("a[href*=/author/]").text().trim();
            let cat = "";
            let catNodes = e.select("a[href*=/novel/all/]");
            for (let i = 0; i < catNodes.size(); i++) {
                let href = catNodes.get(i).attr("href");
                if (href.indexOf("/author/") === -1) {
                    cat = catNodes.get(i).text().trim();
                    break;
                }
            }
            let time = e.select(".mr-auto").text().trim();
            let descriptionArr = [];
            if (author) descriptionArr.push(author);
            if (cat) descriptionArr.push(cat);
            if (time) descriptionArr.push(time);
            let description = descriptionArr.join(" | ");
            if (name) {
                data.push({
                    name: name,
                    link: link,
                    cover: cover,
                    description: description,
                    host: BASE_URL
                });
            }
        });
        let next = null;
        if (elements.size() > 0) {
             next = (parseInt(page) + 1).toString();
        }
        return Response.success(data, next);
    }
    return null;
}