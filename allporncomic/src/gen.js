load('config.js');

function execute(url, page) {
    if (!page) page = "1";
    let fetchUrl = "";

    if (url.indexOf("http") !== -1) {
        let cleanUrl = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL).replace(/\/$/, "");
        fetchUrl = cleanUrl + "/page/" + page + "/";
    } else {
        fetchUrl = BASE_URL + "/porncomic/page/" + page + "/?m_orderby=" + url;
    }

    let response = fetch(fetchUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        }
    });

    if (response.ok) {
        let doc = response.html();
        let books = doc.select(".page-content-listing .page-item-detail > .item-thumb");
        let listBook = [];

        books.forEach(book => {
            let a = book.select("a").first();
            let img = book.select("img").first();
            if (a) {
                let cover = img ? (img.attr("data-src") || img.attr("data-lazy-src") || img.attr("src")) : "";
                listBook.push({
                    name: a.attr("title") || (img ? img.attr("alt") : ""),
                    link: a.attr("href"),
                    cover: cover ? cover.trim() : "",
                    description: "",
                    host: BASE_URL
                });
            }
        });

        let next = listBook.length === 0 ? null : (parseInt(page) + 1).toString();
        return Response.success(listBook, next);
    }
    return null;
}