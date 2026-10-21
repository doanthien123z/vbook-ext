load('config.js');
function execute(url, page) {
    // Nếu page chưa có giá trị, mặc định là 1
    if (!page) page = '1';
    
    // Xử lý URL: Thêm domain nếu thiếu
    if (url.indexOf("http") === -1) url = BASE_URL + url;

    // Xử lý tham số page trong URL:
    // 1. Xóa các tham số page cũ (nếu có) để tránh trùng lặp (ví dụ: &page=1&page=2)
    url = url.replace(/&page=[^&]*/g, "");
    url = url.replace(/\?page=[^&]*/g, "");

    // 2. Thêm tham số page mới vào cuối URL
    if (url.indexOf("?") === -1) {
        url += "?page=" + page;
    } else {
        url += "&page=" + page;
    }

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        // Tìm danh sách truyện
        let el = doc.select(".manga-vertical");
        if (el.size() === 0) {
            el = doc.select(".gap-3.grid > div");
        }

        let data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let name = e.select("h3 a").text();
            let link = e.select("h3 a").attr("href");
            let cover = e.select("img").attr("data-src") || e.select("img").attr("src");
            let description = e.select("h4 a").text();

            if (link) {
                if (link.indexOf("http") < 0) link = BASE_URL + link;
                if (cover && cover.indexOf("http") < 0) cover = BASE_URL + cover;
                
                data.push({
                    name: name,
                    link: link,
                    cover: cover,
                    host: BASE_URL,
                    description: description
                });
            }
        }

        // Xử lý tìm trang tiếp theo (Next Page)
        let next = null;

        // Ưu tiên 1: Thử tìm nút Next trong HTML (đề phòng web cập nhật lại code)
        let nextEl = doc.select(".pagination .next, a[rel=next]").attr("href");
        if (nextEl) {
            let nextPage = nextEl.match(/[?&]page=(\d+)/);
            if (nextPage) next = nextPage[1];
            else next = (parseInt(page) + 1).toString();
        } else {
            // Ưu tiên 2 (Quan trọng): Nếu không tìm thấy nút Next nhưng ĐANG CÓ DỮ LIỆU truyện
            // thì giả định là còn trang sau -> tự động +1 trang.
            if (data.length > 0) {
                next = (parseInt(page) + 1).toString();
            }
        }

        return Response.success(data, next);
    }
    return null;
}