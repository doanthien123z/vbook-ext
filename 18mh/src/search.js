load('config.js');

function execute(key, page) {
    if (!page) page = '1';
    
    // Sử dụng đường dẫn tìm kiếm dành cho Tiểu Thuyết
    // Tham số là 'key_word' như bạn cung cấp
    var searchUrl = BASE_URL + "/novel/search?key_word=" + encodeURIComponent(key);
    
    // Thêm phân trang nếu cần (thường web này dùng param &page=2)
    if (page !== '1') {
        searchUrl += "&page=" + page;
    }

    var response = fetch(searchUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];

        // Selector giống hệt gen.js
        var elems = doc.select(".novel-card");
        
        elems.forEach(function(e) {
            // Lấy Link
            var linkNode = e.select("a").first();
            var link = linkNode.attr("href");
            if (link.indexOf("http") === -1) link = BASE_URL + link;

            // Lấy Ảnh (Ưu tiên data-src)
            var imgNode = e.select("img").first();
            var cover = imgNode.attr("data-src");
            if (!cover) cover = imgNode.attr("src");
            if (cover && cover.indexOf("http") === -1 && cover.indexOf("data:image") === -1) {
                 cover = BASE_URL + cover;
            }

            // Lấy Tên
            var titleNode = e.select(".dx-title").first();
            titleNode.select("span").remove(); // Xóa tag thừa
            var name = titleNode.text().trim();

            // Lấy Mô tả/Tác giả
            var description = e.select(".ml-1 div.mb-1").first().text().replace("作者：", "").trim();

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL
            });
        });

        // Xử lý trang tiếp theo
        var next = parseInt(page) + 1;
        if (elems.size() === 0) {
            next = null;
        }

        return Response.success(data, next);
    }
    return null;
}