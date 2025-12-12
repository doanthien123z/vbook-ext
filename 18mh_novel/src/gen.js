load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let currentUrl = BASE_URL + url + "&page=" + page;
    
    let response = fetch(currentUrl);
    if (response.ok) {
        let doc = response.html();
        const data = [];
        
        let elements = doc.select(".index-content li");
        
        elements.forEach(e => {
            let a = e.select("a").first();
            let link = a.attr("href");
            
            let img = e.select("img").first();
            let cover = img.attr("data-src");
            if (!cover) cover = img.attr("src");
            
            if (cover) {
                if (cover.indexOf("http") === -1) cover = BASE_URL + cover;
                cover = "https://dt123z-bypass.takiyasha123z.workers.dev/proxy?url=" + cover;
            }

            let name = "";
            let nameNode = e.select(".truncate a").first();
            if (nameNode) {
                name = nameNode.text().trim();
            } else {
                let links = e.select("a");
                if (links.size() > 1) {
                    name = links.get(1).text().trim();
                }
            }
            if (!name) name = img.attr("alt");

            let description = "";
            
            let authorNode = e.select(".block .flex.justify-between span").first();
            let author = authorNode ? authorNode.text().trim() : "";

            let timeNode = e.select(".block .flex.items-center .mr-auto").first();
            let time = timeNode ? timeNode.text().trim() : "";

            if (author) description += author;
            if (time) {
                if (description) description += " | ";
                description += time;
            }

            data.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL
            });
        });

        let next = (parseInt(page) + 1).toString();
        if (elements.size() === 0) {
             next = null;
        }
        
        return Response.success(data, next);
    }
    return null;
}