load('config.js');

function execute(url) {
    url = url.replace(/\/$/, "");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        let name = doc.select('.items-center h1').text();
        let author = doc.select('.ml-3 .text-primary').first().text().replace("作者：", "");
        let cover = doc.select('div.flex-1 > div.flex.items-center img').attr('data-src');
        
        if (cover) {
             if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
             cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
        }

        let description = doc.select('meta[name="description"]').attr('content');

        let genres = [];
        doc.select('.line-clamp-1 a, div.mb-2 a').forEach(e => {
            let href = e.attr("href");
            if(href && href.includes("/novel/")) {
                 genres.push({
                    title: e.text(),
                    input: href,
                    script: "gen.js"
                 });
            }
        });

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            host: BASE_URL,
            genres: genres
        });
    }
    return null;
}