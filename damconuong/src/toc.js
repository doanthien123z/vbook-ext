load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let el = doc.select("#chapterList a, .list-chapter a, #list-chapter a, .chapter-list a, .list-chapters a");
        if (el.size() === 0) {
            el = doc.select("a[href*=/chapter-]");
        }
        let data = [];
        for (let i = el.size() - 1; i >= 0; i--) {
            let e = el.get(i);
            let name = e.select(".text-ellipsis").text();
            if (!name) name = e.text();
            let link = e.attr("href");
            if (link) {
                if (link.indexOf("http") < 0) link = BASE_URL + link;
                let exists = false;
                for (let j = 0; j < data.length; j++) {
                    if (data[j].url === link) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    data.push({
                        name: name,
                        url: link,
                        host: BASE_URL
                    });
                }
            }
        }
        return Response.success(data);
    }
    return null;
}