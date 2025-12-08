load('config.js');

function execute(url) {
    return Response.success([{
        name: "Đọc ngay",
        url: url,
        host: BASE_URL
    }]);
}