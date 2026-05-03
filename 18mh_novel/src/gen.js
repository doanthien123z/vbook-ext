load('config.js');

function execute(url, page) {
    if (!page) page = '1';

    // Xử lý URL chuẩn (bảo vệ nếu đầu vào thiếu http)
    if (url.indexOf("http") === -1) {
        url = BASE_URL + url;
    }

    let currentUrl = url;
    
    // Tạo url cho các trang tiếp theo dựa trên page truyền vào
    if (page !== '1') {
        if (currentUrl.includes("?")) {
            currentUrl = currentUrl + "&page=" + page;
        } else if (currentUrl.match(/\/novel\/(all|hot|rank)$/)) {
            // Nhóm dùng /page/2
            currentUrl = currentUrl.replace(/\/$/, "") + "/page/" + page;
        } else {
            // Nhóm dùng /2 (last_published, original, newest)
            currentUrl = currentUrl.replace(/\/$/, "") + "/" + page;
        }
    }

    let response = fetch(currentUrl);

    if (response.ok) {
        let doc = response.html();
        const data = [];

        // Hỗ trợ cả 2 định dạng danh sách truyện
        let elements = doc.select(".dx-novel-list li");
        if (elements.size() === 0) {
            elements = doc.select(".index-content li");
        }

        elements.forEach(e => {
            let a = e.select("a").first();
            if (!a) return; 
            let link = a.attr("href");

            // Xử lý ảnh bìa
            let img = e.select(".poster img").first();
            if (!img) img = e.select("img").first();
            
            let cover = img ? (img.attr("data-src") || img.attr("src")) : "";
            
            if (cover) {
                if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
                cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }

            // Xử lý tên truyện
            let nameNode = e.select("h3").first();
            if (!nameNode) nameNode = e.select(".truncate a").first();
            
            let name = nameNode ? nameNode.text().trim() : (img ? img.attr("alt") : "");

            // Xử lý mô tả (Tác giả + Thể loại)
            let description = "";
            let flexDivs = e.select(".flex justify-between text-base3").first();
            if (!flexDivs) flexDivs = e.select(".flex.justify-between.text-base3").first(); // Fallback selector

            if (flexDivs) {
                let authorNode = flexDivs.select("span").first();
                let author = authorNode ? authorNode.text().trim() : "";
                
                let catNode = flexDivs.select("a").first();
                let cat = catNode ? catNode.text().trim() : "";

                if (author) description += author;
                if (cat) description += " | " + cat;
            } else {
                 // Giao diện cũ dự phòng
                 let authorNode = e.select(".block .flex.justify-between span").first();
                 let author = authorNode ? authorNode.text().trim() : "";
                 let timeNode = e.select(".block .flex.items-center .mr-auto").first();
                 let time = timeNode ? timeNode.text().trim() : "";
                 if (author) description += author;
                 if (time) {
                     if (description) description += " | ";
                     description += time;
                 }
            }

            if (name) {
                data.push({
                    name: name.replace("poster", "").trim(),
                    link: link,
                    cover: cover,
                    description: description,
                    host: BASE_URL
                });
            }
        });

        // Tự động quét thẻ "link rel=next" của trang để xác định xem có trang kế tiếp hay không
        let next = null;
        let nextLink = doc.select('link[rel="next"]').attr("href");
        
        if (nextLink && elements.size() > 0) {
            next = (parseInt(page) + 1).toString();
        }

        return Response.success(data, next);
    }
    return null;
}