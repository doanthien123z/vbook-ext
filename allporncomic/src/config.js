var BASE_URL = "https://allporncomic.com";
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL.replace(/\/$/, "");
    }
} catch (error) {}