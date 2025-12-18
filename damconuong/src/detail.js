load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let cover = doc.select("meta[property=og:image]").attr("content");
        if (cover && cover.indexOf("http") < 0) cover = BASE_URL + cover;
        let name = doc.select("meta[property=og:title]").attr("content");
        if (!name) name = doc.select("h1").text();
        let author = doc.select(".author p:eq(1), .author-content a, .info-item:contains(Tác giả) span, p:contains(Tác giả) a").text() || "Đang cập nhật";
        let status = doc.select("span:contains(Tình trạng:) + a").text();
        if (!status) status = doc.select(".status p:eq(1), .info-item:contains(Tình trạng) span, p:contains(Tình trạng):not(:has(a))").text().replace("Tình trạng:", "").trim();
        if (!status) status = "Đang cập nhật";
        let updated = doc.select("span:contains(Lần cuối:) + span").text();
        if (!updated) updated = doc.select(".story-detail-info .small, time").first().text();
        let genreList = [];
        let genreEls = doc.select(".kind p:eq(1) a, .kind a, .info-item:contains(Thể loại) a, p:contains(Thể loại) a, span:contains(Thể loại:) ~ a");
        genreEls.forEach(e => {
            genreList.push(e.text());
        });
        let genresText = genreList.join(", ");
        let otherName = doc.select("span:contains(Tên khác:) + span").text();
        if (!otherName) otherName = doc.select(".other-name").text();
        let detailHtml = `Tên: ${name}<br>Tên khác: ${otherName}<br>Tác giả: ${author}<br>Tình trạng: ${status}`;
        if (updated) {
            detailHtml += ` | ${updated}`;
        }
        detailHtml += `<br>Nhãn: ${genresText}`;
        let description = doc.select("meta[property=og:description]").attr("content");
        if (!description) description = doc.select(".detail-content p").html();
        let genres = [];
        genreEls.forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen1.js"
            });
        });
        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: detailHtml,
            host: BASE_URL,
            genres: genres,
            suggests: [
                {
                    title: "Truyện đề cử",
                    input: url,
                    script: "gen1.js"
                }
            ]
        });
    }
    return null;
}