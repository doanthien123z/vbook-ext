load('config.js');

function execute(url) {
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();
        
        var el = doc.select(".menu-list ul li a");
        var data = [];
        
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);
            var link = e.attr("href");
            if (link.indexOf("http") === -1) link = BASE_URL + link;
            
            data.push({
                name: e.text().trim(),
                url: link,
                host: BASE_URL
            });
        }
        
        return Response.success(data);
    }
    return null;
}