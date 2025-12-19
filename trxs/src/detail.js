load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html('gbk');
        
        var name = doc.select(".book_info .infos h1").text();
        name = name.replace(/(\(.*?\)|（.*?）)/g, "").trim();

        var cover = doc.select(".book_info .pic img").attr("src");
        if (cover && cover.indexOf("http") === -1) {
            cover = BASE_URL + cover;
        }

        var authorSpan = doc.select(".book_info .infos .date span");
        var author = authorSpan.text().replace("作者：", "").trim();
        var authorUrl = authorSpan.select("a").attr("href");
        
        if (authorUrl && authorUrl.indexOf("http") === -1) {
            authorUrl = BASE_URL + authorUrl;
        }

        var dateText = doc.select(".book_info .infos .date").text();
        var updateTime = "";
        if (dateText.indexOf("日期：") !== -1) {
            updateTime = dateText.split("日期：")[1].trim();
        }

        var description = doc.select(".book_info .infos p").html();

        var genres = [];
        if (author && authorUrl) {
            genres.push({
                title: author,
                input: authorUrl,
                script: "gen.js"
            });
        }

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: "Tên: " + name + "<br>Tác giả: " + author + "<br>Cập nhật: " + updateTime,
            host: BASE_URL,
            genres: genres
        });
    }
    return null;
}