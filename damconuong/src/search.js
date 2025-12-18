load('config.js');
function execute(key, page) {
    if (!page) page = '1';
    let url = BASE_URL + "/tim-kiem?sort=-updated_at&filter%5Bname%5D=" + encodeURIComponent(key) + "&filter%5Bstatus%5D=2,1&page=" + page;
    
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        let el = doc.select(".gap-3.grid > div");
        
        if (el.size() === 0) {
            el = doc.select(".manga-vertical");
        }

        let data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            
            let name = e.select(".font-semibold").text();
            if (!name) name = e.select("h3 a").text();
            
            let link = e.select("a").attr("href");
            
            let cover = e.select("img").attr("data-src") || e.select("img").attr("src");
            
            let description = e.select(".text-xs").first().text();
            if (!description) description = e.select("h4 a").text();
            
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