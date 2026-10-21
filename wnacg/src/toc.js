load('config.js');

function execute(url) {
    // Luôn dùng domain hiện tại trong config (site hay đổi domain)
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": BASE_URL + "/",
        "Accept-Language": "zh-TW,zh;q=0.9,vi;q=0.8,en;q=0.7"
    };

    var chapters = [];
    var seen = {};

    function absUrl(href) {
        href = href.replace(/&amp;/g, "&").trim();
        if (href.indexOf("//") === 0) return "https:" + href;
        if (href.indexOf("http") === 0) return href;
        return BASE_URL + (href.indexOf("/") === 0 ? "" : "/") + href;
    }

    function cleanText(s) {
        return s.replace(/<[^>]+>/g, " ")
            .replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#0?39;/g, "'")
            .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ").trim();
    }

    // Đọc thẳng bằng regex từ text của trang (không phụ thuộc bộ chọn của engine).
    // Mỗi chương là <a ... data-chid="..." href="/photos-slide-aid-X-sid-Y.html">Tên</a>
    function extractChaps(text) {
        var re = /<a\b([^>]*\bdata-chid\s*=\s*["']?\d+["']?[^>]*)>([\s\S]*?)<\/a>/gi;
        var m;
        while ((m = re.exec(text)) !== null) {
            var hm = m[1].match(/\bhref\s*=\s*["']([^"']+)["']/i);
            if (!hm) continue;
            var link = absUrl(hm[1]);
            if (seen[link]) continue;
            seen[link] = true;
            var name = cleanText(m[2]);
            if (!name) {
                var tm = m[1].match(/\btitle\s*=\s*["']([^"']+)["']/i);
                name = tm ? cleanText(tm[1]) : "Chương " + (chapters.length + 1);
            }
            chapters.push({ name: name, url: link, host: BASE_URL });
        }
    }

    var res = fetch(url, { headers: headers });
    if (!res.ok) return Response.error("Không thể tải mục lục: status " + res.status);
    var text = res.text();

    extractChaps(text);

    if (chapters.length > 0) {
        // Hợp tập (合集): có phân trang chương
        var pub = text.match(/<[^>]*\bid\s*=\s*["']sr_pub["'][^>]*>/i);
        var order = "asc";
        if (pub) {
            var tag = pub[0];
            var g = function (k) {
                var x = tag.match(new RegExp(k + "\\s*=\\s*[\"']([^\"']*)[\"']", "i"));
                return x ? x[1] : "";
            };
            var total = parseInt(g("data-total") || "0");
            var per = parseInt(g("data-per") || "12");
            var aid = g("data-aid");
            order = g("data-order") || "asc";
            if (per > 0 && aid) {
                var totalPages = Math.ceil(total / per);
                for (var p = 2; p <= totalPages; p++) {
                    var pr = fetch(BASE_URL + "/photos-index-aid-" + aid + "-page-" + p + ".html", { headers: headers });
                    if (pr.ok) extractChaps(pr.text());
                }
            }
        }
        if (order === "desc") chapters.reverse(); // luôn trả theo thứ tự tăng dần
        return Response.success(chapters);
    }

    // Truyện đơn (không có mục lục chương): một nút "Đọc ngay"
    var btn = text.match(/<a\b[^>]*\bid\s*=\s*["']reader-btn["'][^>]*>/i);
    if (btn) {
        var bh = btn[0].match(/\bhref\s*=\s*["']([^"']+)["']/i);
        if (bh) {
            return Response.success([{ name: "Đọc ngay", url: absUrl(bh[1]), host: BASE_URL }]);
        }
    }

    var tt = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return Response.error("Không tìm thấy mục lục (status " + res.status + ", dài " + text.length +
        ", tiêu đề: " + (tt ? cleanText(tt[1]).substring(0, 60) : "không có") + ")");
}