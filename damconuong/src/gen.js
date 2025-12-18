load('config.js');
function execute(url, page) {
    if (!page) page = '1';
    if (url.indexOf("http") === -1) url = BASE_URL + url;
    if (url.indexOf("page=") === -1) {
        if (url.indexOf("?") === -1) {
            url += "?page=" + page;
        } else {
            url += "&page=" + page;
        }
    }
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let el = doc.select(".manga-vertical");
        if (el.size() === 0) {
            el = doc.select(".gap-3.grid > div");
        }
        let data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let name = e.select("h3 a").text();
            let link = e.select("h3 a").attr("href");
            let cover = e.select("img").attr("data-src") || e.select("img").attr("src");
            let description = e.select("h4 a").text();
            if (link) {
                if (link.indexOf("http") < 0) link = BASE_URL + link;
                if (cover && cover.indexOf("http") < 0) cover = BASE_URL + cover;
                data.push({
                    name: name,
                    link: link,
                    cover: cover,
                    host: BASE_URL,
                    description: description
                });
            }
        }
        let next = doc.select(".pagination .next, a[rel=next]").attr("href");
        if (next) {
            let nextPage = next.match(/[?&]page=(\d+)/);
            if (nextPage) next = nextPage[1];
            else next = (parseInt(page) + 1).toString();
        } else {
            next = null;
        }
        return Response.success(data, next);
    }
    return null;
}