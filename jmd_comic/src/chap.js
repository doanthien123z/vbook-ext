load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        let el = doc.select(".content img[data-original]");
        
        let data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let imgUrl = e.attr("data-original");
            
            if (!imgUrl) imgUrl = e.attr("src");
            
            if (imgUrl) {
                if (imgUrl.startsWith("//")) {
                    imgUrl = "https:" + imgUrl;
                }
                data.push(imgUrl);
            }
        }
        
        return Response.success(data);
    }
    return null;
}