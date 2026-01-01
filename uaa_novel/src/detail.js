load('config.js');

function execute(url) {
    var doc = Http.get(url).html();
    
    var cover = doc.select(".novel_box .cover").attr("src");
    var name = doc.select(".info_box h1").text();
    var author = doc.select(".info_box .item a[href*='author']").text();
    
    var status = doc.select(".update_state").text().replace("状态：", "");
    var latest = doc.select(".info_box .item:contains(最新)").text().replace("最新：", "");
    var genre = doc.select(".info_box .item a[href*='category']").text();
    var source = doc.select(".info_box .item:contains(来源) span").text();
    var score = doc.select(".score_box").text().replace("评分：", "").trim();
    
    var genres = [];
    var tagNames = [];
    
    var tagElements = doc.select(".tag_box li a");
    tagElements.forEach(function(e) {
        var title = e.text().replace("#", "").trim();
        var href = e.attr("href");
        
        tagNames.push(title);
        
        if (href.startsWith("/")) {
            href = BASE_URL + href;
        }
        
        genres.push({
            title: title,
            input: href,
            script: "gen.js"
        });
    });
    
    var intro = doc.select(".brief_box .txt").text().replace("小说简介：", "").trim();
    
    var detailHtml = "<b>Tên: </b>" + name + "<br>";
    detailHtml += "<b>Tác giả: </b>" + author + "<br>";
    detailHtml += "<b>Trạng thái: </b>" + status + "<br>";
    detailHtml += "<b>Mới nhất: </b>" + latest + "<br>";
    detailHtml += "<b>Thể loại: </b>" + genre + "<br>";
    detailHtml += "<b>Nguồn: </b>" + source + "<br>";
    detailHtml += "<b>Điểm: </b>" + score + "<br>";
    detailHtml += "<b>Nhãn: </b>" + tagNames.join(", ");
    
    return Response.success({
        name: name,
        cover: cover,
        author: author,
        description: intro,
        detail: detailHtml,
        host: BASE_URL,
        genres: genres
    });
}