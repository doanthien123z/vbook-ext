load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        
        let el = doc.select(".content div img.lazy");
        
        if (el.size() === 0) {
            el = doc.select(".content img[data-original]");
        }

        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            
            let imgUrl = e.attr("data-original");
            if (!imgUrl) imgUrl = e.attr("src");
            
            if (imgUrl) {
                if (imgUrl.startsWith("//")) {
                    imgUrl = "https:" + imgUrl;
                }
                
                if (imgUrl.match(/\.(jpg|jpeg|png|webp)/i) && 
                    !imgUrl.includes("logo") && 
                    !imgUrl.includes("icon")) {
                    
                    data.push(imgUrl);
                }
            }
        }
        
        return Response.success(data);
    }
    return null;
}