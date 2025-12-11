load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        let coverImg = doc.select(".video-cover img");
        let cover = coverImg.attr("data-original");
        if (!cover) cover = coverImg.attr("src");
        
        let name = doc.select("h1.page-title").text();
        let author = doc.select(".video-info-items:contains(作者：) .video-info-item").text().trim();
        let updateStatus = doc.select(".video-info-items:contains(更新：) .video-info-item").text().trim();
        let description = doc.select(".video-info-content span").html();
        
        let ongoing = true;
        if (updateStatus.includes("已完结")) {
            ongoing = false;
        }

        let genres = [];
        let tagNames = [];
        
        let tagElements = doc.select(".video-info-aux .tag-link a, .video-info-items:contains(TAG：) .video-info-item a");
        
        tagElements.forEach(e => {
            let title = e.text().trim();
            let link = e.attr("href");
            
            if (title && link) {
                if (link.startsWith("/")) link = BASE_URL + link;
                
                tagNames.push(title);
                
                genres.push({
                    title: title,
                    input: link,
                    script: "gen.js"
                });
            }
        });
        
        let tagStr = tagNames.join(", ");

        var detailHtml = "Tên: " + name + "<br>" +
                         "Tác giả: " + (author || "Unknown") + "<br>" +
                         "Trạng thái: " + updateStatus + "<br>" +
                         "Nhãn: " + tagStr;

        return Response.success({
            name: name,
            cover: cover,
            author: author || "Unknown",
            description: description,
            detail: detailHtml,
            ongoing: ongoing,
            host: BASE_URL,
            genres: genres,
            suggests: [
                {
                    title: "Đề xuất truyện tranh",
                    input: url,
                    script: "gen.js"
                }
            ]
        });
    }
    return null;
}