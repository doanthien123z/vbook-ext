load('config.js');

function execute(url) {
    var aidRegex = /aid-(\d+)/;
    var match = url.match(aidRegex);
    if (!match) return Response.error("Không tìm thấy ID truyện");
    var aid = match[1];

    var galleryScriptUrl = BASE_URL + "/photos-gallery-aid-" + aid + ".html";

    var response = fetch(galleryScriptUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var scriptContent = response.text();
        var data = [];

        var urlRegex = /(\/\/img[^\s"'\\]+\.(jpg|jpeg|png|gif|webp))/gi;

        var urlMatch;
        while ((urlMatch = urlRegex.exec(scriptContent)) !== null) {
            var imgUrl = urlMatch[1]; 

            if (imgUrl.indexOf("//") === 0) {
                imgUrl = "https:" + imgUrl;
            }

            if (imgUrl.indexOf("shoucang.jpg") === -1 && imgUrl.indexOf("logo") === -1) {
                data.push(imgUrl);
            }
        }

        var uniqueData = [];
        for (var i = 0; i < data.length; i++) {
            if (uniqueData.indexOf(data[i]) === -1) {
                uniqueData.push(data[i]);
            }
        }
        data = uniqueData;

        if (data.length > 0) {
            return Response.success(data);
        } else {
            return Response.error("Không tìm thấy link ảnh trong script (Regex fail).");
        }
    }

    return Response.error("Lỗi kết nối đến file gallery: " + response.status);
}