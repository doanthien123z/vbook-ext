load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let data = [];
        
        let pageTitle = doc.select("title").text();
        let needRotate = false;

        if (typeof BROKEN_COMICS !== 'undefined' && BROKEN_COMICS.length > 0) {
            for (var i = 0; i < BROKEN_COMICS.length; i++) {
                if (pageTitle.toLowerCase().includes(BROKEN_COMICS[i].toLowerCase())) {
                    needRotate = true;
                    break;
                }
            }
        }
        // ----------------------------------------
        
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
                    
                    if (needRotate && typeof WORKERS !== 'undefined' && WORKERS.length > 0) {
                        let worker = WORKERS[Math.floor(Math.random() * WORKERS.length)];
                        
                        imgUrl = worker + "/?url=" + encodeURIComponent(imgUrl);
                    }

                    data.push(imgUrl);
                }
            }
        }
        
        return Response.success(data);
    }
    return null;
}