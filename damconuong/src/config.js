var BASE_URL = 'https://damconuong.icu';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL.replace(/\/$/, "");
    }
} catch (error) {}