load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL).replace(/\/$/, "") + "/";

    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let name = doc.select(".post-title h1").text().trim();
        let img = doc.select(".summary_image a img").first();
        let cover = img ? (img.attr("data-src") || img.attr("data-lazy-src") || img.attr("src")) : "";

        let artist = doc.select(".post-content .artist-content").text().trim();
        let genreText = doc.select(".post-content .genres-content").text().trim();
        let statusText = doc.select(".post-status .summary-content").text().trim();
        let ongoing = statusText.toLowerCase().indexOf("completed") === -1;

        let genres = [];
        doc.select(".post-content .genres-content a").forEach(e => {
            genres.push({
                title: e.text().trim(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        let description = doc.select(".description-summary .summary__content p").html() 
                       || doc.select(".description-summary .summary__content").html() 
                       || "";

        return Response.success({
            name: name,
            cover: cover ? cover.trim() : "",
            host: BASE_URL,
            author: artist || "Unknown",
            description: description,
            ongoing: ongoing,
            genres: genres,
            detail: "Artist: " + (artist || "N/A") + "<br>Genre: " + genreText
        });
    }
    return null;
}