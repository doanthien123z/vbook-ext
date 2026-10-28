load('config.js');

function coverOf(img) {
    var c = img ? (img.attr("data-src") || img.attr("src")) : "";
    if (!c || c.indexOf("loading.svg") !== -1) return "";
    if (c.indexOf("http") !== 0) c = BASE_URL + c;
    return COVER_PROXY + c;
}

function execute(url, page) {
    if (!url) url = "/novel/rank";
    if (url.indexOf("http") !== 0) url = BASE_URL + url;
    
    var response = fetch(url, {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        }
    });
    
    if (!response.ok) return null;
    
    var text = response.text();
    var doc;
    
    try {
        if (text.trim().startsWith("{")) {
            var json = JSON.parse(text);
            var htmlStr = "";
            if (json.data && json.data.html) {
                htmlStr = json.data.html;
            } else if (json.html) {
                htmlStr = json.html;
            } else if (json.data) {
                htmlStr = json.data;
            }
            doc = Html.parse(htmlStr);
        } else {
            doc = Html.parse(text);
        }
    } catch (e) {
        doc = Html.parse(text);
    }

    var items = [];

    function push(e, no, nameSel, subSel, hotSel, statusSel) {
        var link = e.attr("href");
        var name = e.select(nameSel).text().trim();
        if (!link || !name) return;
        
        var parts = [];
        var sub = e.select(subSel).text().trim();
        var hot = e.select(hotSel).text().trim();
        var status = statusSel ? e.select(statusSel).text().trim() : "";
        
        if (sub) parts.push(sub);
        if (status && sub.indexOf(status) === -1) parts.push(status);
        if (hot) parts.push(" " + hot);
        
        items.push({
            no: parseInt(no) || 999,
            data: {
                name: name,
                link: link,
                cover: coverOf(e.select("img").first()),
                description: "#" + no + " | " + parts.join(" | "),
                host: BASE_URL
            }
        });
    }

    var panel = doc.select(".jm-rp-panel").first();
    if (!panel) panel = doc;

    panel.select("a.jm-rp-stand").forEach(function (e) {
        push(e, e.select(".jm-rp-big").text().trim(),
            ".jm-rp-stitle", ".jm-rp-ssub", ".jm-rp-hot", ".jm-rp-status");
    });

    panel.select("a.jm-rkrow").forEach(function (e) {
        push(e, e.select(".jm-rkrow__no").text().trim(),
            ".jm-rkrow__title", ".jm-rkrow__sub", ".jm-rkrow__hot", "");
    });

    items.sort(function (a, b) { return a.no - b.no; });
    var data = items.map(function (x) { return x.data; });
    
    return Response.success(data, null);
}