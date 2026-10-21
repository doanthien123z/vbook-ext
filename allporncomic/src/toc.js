load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL).replace(/\/$/, "") + "/";

    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let chapters = doc.select(".listing-chapters_wrap ul li.wp-manga-chapter");
        if (chapters.size() === 0) {
            chapters = doc.select(".listing-chapters_wrap ul li");
        }

        let listChapter = [];
        chapters.forEach(chapter => {
            let a = chapter.select("a").first();
            if (a) {
                listChapter.push({
                    name: a.text().trim(),
                    url: a.attr("href"),
                    host: BASE_URL
                });
            }
        });

        return Response.success(listChapter.reverse());
    }
    return null;
}