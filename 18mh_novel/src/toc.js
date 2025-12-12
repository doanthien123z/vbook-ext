load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url + "/");
    
    if (response.ok) {
        let doc = response.html();
        let chapters = [];
        
        let el = doc.select(".menu-list li a");
        
        el.forEach(e => {
            let link = e.attr("href");
            if (link.indexOf("http") === -1) link = BASE_URL + link;
            
            chapters.push({
                name: e.text(),
                url: link,
                host: BASE_URL
            })
        });
        return Response.success(chapters);
    }
    return null;
}