load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let el = doc.select("img[data-original-src]");
        if (el.size() === 0) {
            el = doc.select("img[data-src]");
        }
        let data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let img = e.attr("data-original-src");
            if (!img) img = e.attr("data-src");
            if (!img) img = e.attr("src");
            if (img) {
                if (img.indexOf("http") < 0) img = BASE_URL + img;
                if (img.indexOf("loading.gif") === -1) {
                    data.push(img);
                }
            }
        }
        return Response.success(data);
    }
    return null;
}