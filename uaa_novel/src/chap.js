load('config.js');

function execute(url) {
    var doc = Http.get(url).html();
    var content = "";
    var lines = doc.select(".article .line");
    lines.forEach(function(line) {
        content += line.text() + "<br>";
    });
    return Response.success(content);
}