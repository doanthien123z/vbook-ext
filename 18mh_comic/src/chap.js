load('config.js');

function execute(url) {
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL
        }
    });

    if (response.ok) {
        var doc = response.html();
        var data = [];

        var elems = doc.select("main.app-content section img");

        for (var i = 0; i < elems.size(); i++) {
            var e = elems.get(i);
            
            var img = e.attr("data-src");
            if (!img || img.indexOf("loading") !== -1) {
                img = e.attr("src");
            }

            if (img && img.indexOf("loading") === -1) {
                if (img.indexOf("http") === -1) img = BASE_URL + img;

                img = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + img;

                data.push(img);
            }
        }
        return Response.success(data);
    }
    return null;
}