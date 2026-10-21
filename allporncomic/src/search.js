load('config.js');

function execute(key, page) {
    if (!page) page = "1";
    let searchUrl = BASE_URL + "/page/" + page + "/?s=" + encodeURIComponent(key) + "&post_type=wp-manga&op&author&artist&release&adult";

    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let books = doc.select(".c-tabs-item .c-tabs-item__content");
        let listBook = [];

        books.forEach(book => {
            let titleNode = book.select(".post-title h3 a").first();
            let imgNode = book.select(".c-image-hover img").first();
            let descNode = book.select(".summary-content a").first();

            if (titleNode) {
                let cover = imgNode ? (imgNode.attr("data-src") || imgNode.attr("data-lazy-src") || imgNode.attr("src")) : "";
                listBook.push({
                    name: titleNode.text().trim(),
                    link: titleNode.attr("href"),
                    cover: cover ? cover.trim() : "",
                    description: descNode ? descNode.text().trim() : "",
                    host: BASE_URL
                });
            }
        });

        let next = listBook.length === 0 ? null : (parseInt(page) + 1).toString();
        return Response.success(listBook, next);
    }
    return null;
}