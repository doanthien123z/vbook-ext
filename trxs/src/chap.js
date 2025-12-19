load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html('gbk');
        var htm = doc.select(".read_chapterDetail").html();
        
        if (htm) {
            htm = htm.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                     .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");
        }
        
        return Response.success(htm);
    }
    return null;
}