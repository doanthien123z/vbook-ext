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

        var content = doc.select(".article").html();
        
        content = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                         .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");

        return Response.success(content);
    }
    return null;
}