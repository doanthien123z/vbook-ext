load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    
    var currentUrl = BASE_URL + url + (page === '1' ? 'index.html' : 'index_' + page + '.html');
    var response = fetch(currentUrl);
    
    if (response.ok) {
        var doc = response.html();
        var data = [];
        
        var elements = doc.select(".book-like a");
        for (var i = 0; i < elements.size(); i++) {
            var e = elements.get(i);
            
            var coverImg = e.select("img").first().attr("src");
            
            if (coverImg && coverImg.indexOf("static.aaccnn.com") !== -1) {
                coverImg = coverImg.replace("static.aaccnn.com", "static.aaddbb.com");
            }

            data.push({
                name: e.select("h4").first().text(),
                link: BASE_URL + e.attr("href"),
                cover: coverImg,
                description: e.select("span").first().text(),
                host: BASE_URL
            });
        }

        var next = (parseInt(page) + 1).toString();
        return Response.success(data, next);
    }
    return null;
}