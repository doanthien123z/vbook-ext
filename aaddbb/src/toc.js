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
        var data = [];
        var elements = doc.select(".book-chapter a");
        
        for (var i = 0; i < elements.size(); i++) {
            var e = elements.get(i);
            var name = e.text();
            var link = e.attr("href");
            
            if (link && link.indexOf("http") === -1) {
                link = BASE_URL + link;
            }
            
            data.push({
                name: name,
                url: link,
                host: BASE_URL
            });
        }
        
        return Response.success(data);
    }
    
    return null;
}