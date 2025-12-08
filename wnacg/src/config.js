var BASE_URL = "https://www.wnacg.ru";
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}