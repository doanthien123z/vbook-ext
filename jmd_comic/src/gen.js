load('config.js');

function execute(url, page) {
    if (!page) page = '1';

    let requestUrl = url;
    if (parseInt(page) > 1) {
        if (requestUrl.endsWith('/')) {
            requestUrl = requestUrl.slice(0, -1);
        }
        requestUrl += '/page/' + page;
    }

    let response = fetch(requestUrl);
    if (response.ok) {
        let doc = response.html();
        let data = [];

        let items = doc.select(".module-item");
        items.forEach(e => {
            let title = e.select(".module-item-title").text();
            let link = e.select(".module-item-pic a").attr("href");
            let cover = e.select(".module-item-pic img").attr("data-original");
            let desc = e.select(".module-item-text").text();

            if (!cover) cover = e.select(".module-item-pic img").attr("src");

            if (link) {
                if (link.startsWith("/")) {
                    link = BASE_URL + link;
                }
                
                data.push({
                    name: title,
                    link: link,
                    cover: cover,
                    description: desc,
                    host: BASE_URL
                });
            }
        });

        let next = null;
        let nextBtn = doc.select("#page a.page-next:contains(下一页)");
        if (nextBtn.length > 0) {
            next = (parseInt(page) + 1).toString();
        }

        return Response.success(data, next);
    }
    return null;
}