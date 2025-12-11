load('config.js');

function execute(key, page) {
    if (!page) page = '1';

    // Tạo URL tìm kiếm
    // Ví dụ: https://18mh.net/comic/search?key_word=...&page=1
    var url = BASE_URL + "/comic/search?key_word=" + encodeURIComponent(key) + "&page=" + page;

    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];

        // Selector danh sách truyện (Tương tự gen.js)
        var elems = doc.select(".index-content li");

        for (var i = 0; i < elems.size(); i++) {
            var e = elems.get(i);
            
            var a = e.select("a").first();
            var link = a.attr("href");
            
            // Xử lý tên: Loại bỏ các nhãn (span) trong tên nếu có
            var titleElem = e.select(".dx-title");
            var spanText = titleElem.select("span").text();
            var name = titleElem.text().replace(spanText, "").trim();

            // Ảnh bìa & Proxy
            var imgNode = a.select("img").first();
            var cover = "";
            if (imgNode) {
                cover = imgNode.attr("data-src");
                if (!cover) cover = imgNode.attr("src");
            }

            // Chuẩn hóa URL
            if (link.indexOf("http") === -1) link = BASE_URL + link;
            if (cover && cover.indexOf("http") === -1) cover = BASE_URL + cover;
            
            // Áp dụng Proxy để hiện ảnh
            if (cover) {
                cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }

            // Lấy chương mới nhất làm mô tả
            var latest = e.select("div:contains(最新：)").text().replace("最新：", "").trim();

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: latest,
                host: BASE_URL
            });
        }
        
        // Logic trang tiếp theo
        if (data.length === 0) {
            return Response.success(data, null);
        }

        var next = parseInt(page) + 1;
        return Response.success(data, next.toString());
    }
    return null;
}