load('config.js');

function execute() {
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let listGenre = [];
        let navItems = doc.select(".sub-nav_list > li");
        
        let genres = navItems.size() > 1 
            ? navItems.get(1).select(".sub-menu li a") 
            : doc.select("a[href*='/porncomic-genre/']");

        genres.forEach(genre => {
            let title = genre.select("span").text().trim() || genre.text().trim();
            let href = genre.attr("href");
            if (title && href && title.toLowerCase() !== "genres") {
                listGenre.push({
                    title: title,
                    input: href,
                    script: "gen.js"
                });
            }
        });

        return Response.success(listGenre);
    }
    return null;
}