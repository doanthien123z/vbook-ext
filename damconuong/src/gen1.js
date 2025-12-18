load('config.js');
function execute(url, page) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        let els = doc.select("h3:contains(Đề cử) + div.grid > div");
        if (els.size() === 0) {
            els = doc.select(".gap-3.grid > div");
        }
        for (let i = 0; i < els.size(); i++) {
            let e = els.get(i);
            let name = e.select(".font-semibold").text();
            let link = e.select("a").attr("href");
            let cover = e.select("img").attr("data-src") || e.select("img").attr("src");
            if (link) {
                if (link.indexOf("http") < 0) link = BASE_URL + link;
                if (cover && cover.indexOf("http") < 0) cover = BASE_URL + cover;
                data.push({
                    name: name,
                    link: link,
                    cover: cover,
                    host: BASE_URL
                });
            }
        }
        return Response.success(data);
    }
    return null;
}