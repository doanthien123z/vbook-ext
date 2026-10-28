load('config.js'); 

function execute(url) {
    url = url.replace(/\/$/, "");
    let currentUrl = url;
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        let name = doc.select('.jm-dt-title').text().trim();
        if (!name) name = doc.select('.detail-page__title').text().trim();
        if (!name) name = doc.select('meta[property="og:title"]').attr('content').split('|')[0].trim();
        
        let author = "Unknown";
        let authorEl = doc.select('a[href*="/novel/all/author/"]').first();
        if (!authorEl) authorEl = doc.select('a[href*="/author/"]').first();
        if (authorEl) {
            author = authorEl.text().trim();
        } else {
            let jsonLd = doc.select('script[type="application/ld+json"]').html();
            if (jsonLd) {
                try {
                    let jsonBlocks = jsonLd.match(/\{[\s\S]*?\}/g);
                    for(let i = 0; i < jsonBlocks.length; i++) {
                        let json = JSON.parse(jsonBlocks[i]);
                        if (json.author && json.author.name) {
                            author = json.author.name;
                            break;
                        }
                    }
                } catch (e) {}
            }
        }
        
        let cover = doc.select('.jm-dt-cover__img').attr('data-src');
        if (!cover) cover = doc.select('.detail-page__poster-img').attr('data-src');
        if (!cover) cover = doc.select('meta[property="og:image"]').attr('content');
        if (cover) {
            if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
            cover = COVER_PROXY + cover;
        }
        
        let description = doc.select('.jm-dt-desc__p').html();
        if (!description) description = doc.select('meta[property="og:description"]').attr('content');
        if (description) description = description.replace(/<br\s*[\/]?>/gi, "\n").trim();
        
        let category = doc.select('meta[property="article:tag"]').first().attr("content") || "";
        if (!category) {
            let catEl = doc.select('.jm-dt-meta a[href*="/novel/all/"]').first();
            if (catEl && catEl.attr("href").indexOf("author") === -1) category = catEl.text().trim();
        }
        let status = doc.select('.jm-dt-pill--st').text().trim();
        
        let pages = doc.select('.jm-dt-tabn').first().text().trim();
        let catalogItems = doc.select('.jm-dt-ch');
        if (!pages || pages === "0") {
            if (catalogItems.size() > 0) pages = catalogItems.size() + " chương";
            else {
                catalogItems = doc.select('a.detail-page__catalog-item');
                if (catalogItems.size() > 0) pages = catalogItems.size() + " chương";
                else pages = "Không rõ";
            }
        } else {
            pages = pages + " chương";
        }
        
        let genres = [];
        let tagNames = [];
        let tagElements = doc.select('.jm-dt-chip');
        if (tagElements.size() === 0) tagElements = doc.select('.detail-page__tag');
        
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
        
        let detailHtml = "Tên: " + name + 
                         "<br>Tác giả: " + author +
                         "<br>Thể loại: " + category + 
                         (status ? " (" + status + ")" : "") +
                         "<br>Số chương: " + pages + 
                         (tagNames.length > 0 ? ("<br>Nhãn: " + tagNames.join(", ")) : "");
                         
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