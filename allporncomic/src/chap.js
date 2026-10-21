load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL).replace(/\/$/, "") + "/";

    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let images = doc.select(".page-break img, .reading-content img");
        let listImage = [];

        images.forEach(image => {
            let src = image.attr("data-src") || image.attr("data-lazy-src") || image.attr("src");
            if (src) {
                listImage.push(src.trim());
            }
        });

        return Response.success(listImage);
    }
    return null;
}