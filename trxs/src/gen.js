load('config.js');

function execute(url, page) {
    if (!page) page = 1;
    var p = parseInt(page);

    var fetchUrl = url;
    
    if (url.indexOf("searchid") !== -1) {
        var pageIdx = p - 1;
        if (url.indexOf("page=") !== -1) {
            fetchUrl = url.replace(/page=\d+/, "page=" + pageIdx);
        } else {
            fetchUrl = url + "&page=" + pageIdx;
        }
    } else if (url.indexOf("tags-") !== -1) {
        var pageIdx = p - 1;
        fetchUrl = url.replace(/-\d+\.html$/, "-" + pageIdx + ".html");
    } else {
        fetchUrl = url.replace(/\/index_\d+\.html$/, "/");
        if (fetchUrl.slice(-1) !== "/") fetchUrl += "/";
        
        if (p > 1) {
            fetchUrl = fetchUrl + "index_" + p + ".html";
        }
    }

    var response = fetch(fetchUrl);
    if (response.ok) {
        var doc = response.html('gbk');
        var data = [];
        var elems = doc.select(".books .bk");
        
        if (elems.length === 0) {
            elems = doc.select(".list_box li, .news_list li");
        }

        elems.forEach(function(e) {
            var a = e.select("a").first();
            var link = a.attr("href");
            var title = e.select("h3").text();
            if (!title) title = a.text();

            var cover = e.select(".pic img").attr("src");
            var author = "";
            
            var booknews = e.select(".booknews").text();
            if (booknews.indexOf("作者:") !== -1) {
                author = booknews.split("作者:")[1].split(" ")[0].trim();
            } else if (e.select(".author").length > 0) {
                author = e.select(".author").text();
            }

            if (link.indexOf("http") === -1) link = BASE_URL + link;
            if (cover && cover.indexOf("http") === -1) cover = BASE_URL + cover;

            data.push({
                name: title,
                link: link,
                cover: cover || "https://i.imgur.com/1j44e4t.png",
                description: author,
                host: BASE_URL
            });
        });

        var next = null;
        if (data.length > 0) {
            next = (p + 1).toString();
        }

        return Response.success(data, next);
    }
    return null;
}