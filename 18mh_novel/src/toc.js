load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url + "/");
    if (response.ok) {
        let doc = response.html();
        let chapters = [];
        let el = doc.select("a.detail-page__catalog-item");
        el.forEach(e => {
            let link = e.attr("href");
            if (link.indexOf("http") === -1) link = BASE_URL + link;
            let nameEl = e.select(".detail-page__chapter-title").first();
            let name = nameEl ? nameEl.text().trim() : e.text().trim();
            chapters.push({
                name: name,
                url: link,
                host: BASE_URL
            })
        });
        return Response.success(chapters);
    }
    return null;
}