load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let el = doc.select(".module-player-list .scroll-content a.detail-write");
        
        const data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let link = e.attr("href");
            if (link.startsWith("/")) {
                link = BASE_URL + link;
            }
            
            data.push({
                name: e.text().trim(),
                url: link,
                host: BASE_URL
            })
        }
        
        return Response.success(data);
    }
    return null;
}