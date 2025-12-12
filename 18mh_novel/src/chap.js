load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let htm = doc.select('main.app-content .article').html();
        
        if (htm) {
            htm = htm.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                     .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");
        }
        
        return Response.success(htm);
    }
    return null;
}