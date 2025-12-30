load('config.js');

function execute(url) {
    if (url.indexOf("http") === -1) {
        url = BASE_URL + url;
    }

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];

        let elements = doc.select("ul.grid.grid-cols-1 li");

        elements.forEach(e => {
            let a = e.select("a").first();
            let link = a.attr("href");
            
            if (link && link.indexOf("http") === -1) {
                link = BASE_URL + link;
            }

            let img = e.select("img").first();
            let cover = img.attr("data-src");
            if (!cover) cover = img.attr("src");
            
            if (cover) {
                if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
                cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }

            let name = e.select("h3").text().trim();
            if (!name) name = img.attr("alt");

            let description = e.select(".line-clamp-4").text().trim();

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL
            });
        });

        return Response.success(data);
    }
    return null;
}