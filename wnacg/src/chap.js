load('config.js');

function execute(url) {
    var aidMatch = url.match(/aid-(\d+)/);
    if (!aidMatch) return Response.error("Không tìm thấy ID chương");
    var aid = aidMatch[1];
    // Truyện dạng hợp tập (合集): URL chương có thêm -sid-<id hợp tập>
    var sidMatch = url.match(/sid-(\d+)/);
    var sid = sidMatch ? sidMatch[1] : "";
    var suffix = sid ? "-sid-" + sid : "";

    var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    var headers = {
        "User-Agent": UA,
        "Referer": BASE_URL + "/photos-slide-aid-" + aid + suffix + ".html"
    };

    var data = [];
    var lastStatus = "";

    function addImg(imgUrl) {
        if (!imgUrl) return;
        imgUrl = imgUrl.replace(/\\\//g, "/").trim();
        if (imgUrl.indexOf("//") === 0) {
            imgUrl = "https://" + imgUrl.replace(/^\/+/, "");
        } else if (imgUrl.indexOf("/") === 0) {
            imgUrl = BASE_URL + imgUrl;
        }
        if (imgUrl.indexOf("http") === 0 &&
            imgUrl.indexOf("shoucang.jpg") === -1 &&
            imgUrl.indexOf("logo") === -1 &&
            imgUrl.indexOf("userpic") === -1 &&
            imgUrl.indexOf("/themes/") === -1 &&
            imgUrl.indexOf("/data/t/") === -1) {
            if (data.indexOf(imgUrl) === -1) data.push(imgUrl);
        }
    }

    // Trang đọc mới: mReader.initData({"page_url":["http://img5.qy0.ru/...jpg?verify=...", ...], ...})
    // URL ảnh có chữ ký ?verify=... nên PHẢI giữ nguyên query, cắt đi là bị 403.
    function scanInitData(text) {
        var block = text.match(/"page_url"\s*:\s*\[([\s\S]*?)\]/);
        if (!block) return false;
        var re = /"((?:\\.|[^"\\])*)"/g;
        var m;
        while ((m = re.exec(block[1])) !== null) {
            var u = m[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/&amp;/g, "&").trim();
            if (u) u = u.replace(/^http:\/\//i, "https://");
            if (u && data.indexOf(u) === -1) data.push(u);
        }
        return data.length > 0;
    }

    function scanText(text) {
        if (scanInitData(text)) return;
        text = text.replace(/\\\//g, "/");
        var regex = /((?:https?:)?\/\/[^\s"'\\<>]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s"'\\<>]*)?|\/data\/[^\s"'\\<>]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s"'\\<>]*)?)/gi;
        var m;
        while ((m = regex.exec(text)) !== null) addImg(m[1]);
    }

    // 1) Script danh sách ảnh mà trang đọc nạp: /photos-item-aid-<aid>.html
    // 2) Trang đọc kiểu cũ render sẵn thẻ <img>: photos-list (site dùng cho trình duyệt cũ)
    // 3) Các endpoint dự phòng
    var endpoints = [
        BASE_URL + "/photos-item-aid-" + aid + ".html",
        BASE_URL + "/photos-list-aid-" + aid + suffix + ".html",
        BASE_URL + "/photos-list-aid-" + aid + ".html",
        BASE_URL + "/photos-gallery-aid-" + aid + ".html",
        BASE_URL + "/photos-slist-aid-" + aid + ".html"
    ];

    for (var i = 0; i < endpoints.length; i++) {
        var res = fetch(endpoints[i], { headers: headers });
        lastStatus = res.status;
        if (!res.ok) continue;

        var text = res.text();
        scanText(text);

        // Nếu là trang HTML thì đọc thêm thuộc tính của <img>
        if (data.length === 0 && text.indexOf("<img") !== -1) {
            res.html().select("img").forEach(function (el) {
                addImg(el.attr("data-original") || el.attr("data-src") || el.attr("src"));
            });
        }
        if (data.length > 0) return Response.success(data);
    }

    return Response.error("Không lấy được ảnh chương (aid=" + aid + ", status=" + lastStatus + ")");
}