load('config.js');

function execute(url) {
    if (url.indexOf("http") === -1) {
        url = BASE_URL + url;
    }

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];

        let elements = doc.select("a.detail-page__hot-card");

        elements.forEach(e => {
            let link = e.attr("href");
            
            if (link && link.indexOf("http") === -1) {
                link = BASE_URL + link;
            }

            let img = e.select("img.detail-page__hot-img").first();
            if (!img) img = e.select("img").first();
            let cover = img ? (img.attr("data-src") || img.attr("src")) : "";
            
            if (cover) {
                if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
                cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }

            let nameEl = e.select("h3.detail-page__hot-name").first();
            if (!nameEl) nameEl = e.select("h3").first();
            let name = nameEl ? nameEl.text().trim() : (img ? img.attr("alt") : "");

            let description = "";

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

        return Response.success(data);
    }
    return null;
}