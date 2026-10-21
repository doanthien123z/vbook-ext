load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        // Chỉ lấy đúng danh sách chương (#md-chapter-list).
        // Selector cũ a[href*='/chapter-'] kéo luôn nút "Đọc từ đầu", chương mới nhất
        // ở phần hero và link bình luận -> sai thứ tự, sai tên.
        let el = doc.select("#md-chapter-list a.md-ch");

        // Dự phòng nếu web đổi giao diện
        if (el.size() === 0) {
            el = doc.select(".list-chapter a, .chapter-list a, .scroll-content a, .book-chapter a");
        }

        let data = [];
        let seen = {};
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let link = e.attr("href");
            if (!link || link.indexOf("/chapter-") < 0) continue;
            if (link.indexOf("http") < 0) link = BASE_URL + link;
            link = link.replace(/#.*$/, "");
            if (seen[link]) continue;
            seen[link] = true;

            // Tên chương nằm trong .md-ch-title (không lấy cả "15 giờ trước", lượt xem)
            let name = e.select(".md-ch-title").text().trim();
            if (!name) name = e.select(".text-ellipsis").text().trim();
            if (!name) name = e.text().trim();

            // Slug dạng chapter-103-2 / chapter-75-5: thêm phần lẻ vào tên để không bị trùng tên
            let m = link.match(/\/chapter-(\d+)-(\d+)$/);
            if (m) {
                let full = m[1] + "." + m[2];
                if (name.indexOf(full) < 0) name = name + " (" + full + ")";
            }

            data.push({
                name: name,
                url: link,
                host: BASE_URL
            });
        }

        // Web trả về mới -> cũ; đảo lại để chương 1 nằm đầu danh sách.
        data.reverse();
        return Response.success(data);
    }
    return null;
}
