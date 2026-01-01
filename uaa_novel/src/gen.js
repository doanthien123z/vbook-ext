load('config.js');

function execute(url, page) {
    if (!page) page = '1';

    var newUrl = url;
    if (url.indexOf("page=") !== -1) {
        newUrl = url.replace(/page=\d+/, "page=" + page);
    }

    var doc = Http.get(newUrl).html();
    var data = [];
    var elems = doc.select(".novel_list_box li");

    elems.forEach(function(e) {
        var name = e.select(".title a").text();
        var link = e.select(".title a").attr("href");
        var cover = e.select(".cover").attr("src");
        var status = e.select(".state").text();
        
        var percent = "";
        var otherSpans = e.select(".other_box span");
        if (otherSpans.size() > 0) {
            percent = otherSpans.get(otherSpans.size() - 1).text();
        }
        
        var description = status;
        if (percent) {
            description += " - " + percent;
        }
        
        if (link.startsWith("/")) {
            link = BASE_URL + link;
        }
        
        data.push({
            name: name,
            link: link,
            cover: cover,
            description: description,
            host: BASE_URL
        });
    });

    var next = "";
    if (data.length > 0 && url.indexOf("page=") !== -1) {
        next = (parseInt(page) + 1).toString();
    }

    return Response.success(data, next);
}