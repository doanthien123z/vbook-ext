var BASE_URL = 'https://damconuong.win';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL.replace(/\/$/, "");
    }
} catch (error) {}