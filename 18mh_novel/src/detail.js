load('config.js'); 
function execute(url) {
    url = url.replace(/\/$/, "");
    let currentUrl = url;
    let response = fetch(url);
    
    if (response.ok) {
        let doc = response.html();
        
        // 1. Tên truyện
        let name = doc.select('.detail-page__title').text().trim();
        if (!name) name = doc.select('meta[property="og:title"]').attr('content').split('|')[0].trim();
        
        // 2. Tác giả
        let author = "Unknown";
        let jsonLd = doc.select('script[type="application/ld+json"]').html();
        if (jsonLd) {
            try {
                // Lấy block JSON chứa tác giả
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

        // 3. Ảnh bìa
        let cover = doc.select('.detail-page__poster-img').attr('data-src');
        if (!cover) cover = doc.select('meta[property="og:image"]').attr('content');
        
        if (cover) {
            if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
            cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
        }

        // 4. Mô tả
        let description = doc.select('meta[property="og:description"]').attr('content');
        if (description) description = description.trim();

        // 5. Thể loại (Category)
        let category = doc.select('meta[property="article:tag"]').first().attr("content") || "";

        // 6. Số trang (Không thấy trong HTML, tạm bỏ qua hoặc gán mặc định)
        let pages = doc.select('.dx-tab-item:contains(Trang)').text().replace("Trang", "").replace(":", "").trim();
        if(!pages) pages = "Không rõ";

        // 7. Nhãn (Tags/Genres)
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

        // 8. Định dạng HTML chi tiết
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