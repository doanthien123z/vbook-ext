load('config.js'); 
function execute(url) {
    url = url.replace(/\/$/, "");
    let currentUrl = url;
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let name = doc.select('.detail-page__title').text().trim();
        if (!name) name = doc.select('meta[property="og:title"]').attr('content').split('|')[0].trim();
        let author = "Unknown";
        let jsonLd = doc.select('script[type="application/ld+json"]').html();
        if (jsonLd) {
            try {
                let jsonBlocks = jsonLd.match(/\{[\s\S]*?\}/g);
                for(let i=0; i<jsonBlocks.length; i++){
                    let json = JSON.parse(jsonBlocks[i]);
                    if (json.author && json.author.name) {
                        author = json.author.name;
                        break;
                    }
                }
            } catch (e) {}
        }
        if (author === "Unknown") {
            author = doc.select('a[href*="/author/"]').text();
        }
        let cover = doc.select('.detail-page__poster-img').attr('data-src');
        if (!cover) cover = doc.select('meta[property="og:image"]').attr('content');
        if (cover) {
            if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
            cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
        }
        let description = doc.select('meta[property="og:description"]').attr('content');
        if (description) description = description.trim();
        let category = doc.select('meta[property="article:tag"]').first().attr("content") || "";
        let pages = "";
        let catalogItems = doc.select('a.detail-page__catalog-item');
        if (catalogItems.size() > 0) {
            pages = catalogItems.size() + " chương";
        }
        if(!pages) pages = "Không rõ";
        let genres = [];
        let tagNames = [];
        let tagElements = doc.select('.detail-page__tag');
        tagElements.forEach(e => {
            let title = e.text().trim();
            let href = e.attr("href");
            if (title && href) {
                if (href.indexOf("?") === -1) href += "?";
                tagNames.push(title);
                genres.push({
                    title: title,
                    input: href,
                    script: "gen.js"
                });
            }
        });
        let detailHtml = "Tên: " + name + "<br>Thể loại: " + category + "<br>Số trang: " + pages + "<br>Nhãn: " + tagNames.join(", ");
        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: detailHtml,
            host: BASE_URL,
            genres: genres,
            suggests: [
                {
                    title: "Truyện đề xuất",
                    input: currentUrl,
                    script: "suggests.js"
                }
            ]
        });
    }
    return null;
}