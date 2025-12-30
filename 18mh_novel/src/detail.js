load('config.js');

function execute(url) {
    url = url.replace(/\/$/, "");
    
    let currentUrl = url;

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        let name = doc.select('.dx-title h2').text();
        
        let author = "Unknown";
        let jsonLd = doc.select('script[type="application/ld+json"]').html();
        if (jsonLd) {
            try {
                let json = JSON.parse(jsonLd);
                if (json.author && json.author.name) author = json.author.name;
            } catch (e) {}
        }
        if (author === "Unknown") {
            author = doc.select('a[href*="author"]').text();
            if (!author) {
                 author = doc.select('span:contains(作者) + a').text();
            }
        }

        let cover = doc.select('.poster img').attr('data-src');
        
        if (cover) {
             if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
             cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
        }

        let description = doc.select('meta[property="og:description"]').attr('content');
        if (description) description = description.replace("小说简介：", "").trim();

        let category = doc.select('meta[property="article:tag"]').attr("content");

        let pages = doc.select('.dx-tab-item:contains(目录)').text().replace("目录", "").replace(":", "").trim();

        let genres = [];
        let tagNames = [];
        
        let tagElements = doc.select('a[href*="/novel/tag/"]');
        tagElements.forEach(e => {
            let title = e.select('h2').text().trim();
            if (!title) title = e.text().replace("#", "").trim();
            
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
                    title: "Đề xuất",
                    input: currentUrl,
                    script: "suggests.js"
                }
            ]
        });
    }
    return null;
}