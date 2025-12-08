load('config.js');

function execute(url) {
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        var doc = response.html();

        // Lấy nội dung trong thẻ div class="article"
        var content = doc.select(".article").html();
        
        // Xử lý làm sạch nội dung (nếu cần)
        // Xóa các thẻ script hoặc quảng cáo chèn vào (nếu có)
        content = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                         .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");

        return Response.success(content);
    }
    return null;
}