load('config.js');
const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function b64ToBytes(str) {
    let out = new Array(Math.floor(str.length * 6 / 8));
    let bits = 0, count = 0, idx = 0;
    for (let i = 0; i < str.length; i++) {
        let val = B64_CHARS.indexOf(str.charAt(i));
        if (val < 0) continue;
        bits = (bits << 6) | val;
        count += 6;
        if (count >= 8) {
            count -= 8;
            out[idx++] = (bits >> count) & 0xff;
        }
    }
    return out;
}

function bytesToB64(bytes) {
    let out = "";
    for (let i = 0; i < bytes.length; i += 3) {
        let b0 = bytes[i] & 0xff;
        let b1 = (i + 1 < bytes.length) ? (bytes[i + 1] & 0xff) : 0;
        let b2 = (i + 2 < bytes.length) ? (bytes[i + 2] & 0xff) : 0;
        let n = (b0 << 16) | (b1 << 8) | b2;
        let limit = Math.min(4, Math.ceil((bytes.length - i) * 8 / 6));
        for (let j = 0; j < limit; j++) {
            out += B64_CHARS.charAt((n >> (18 - 6 * j)) & 0x3f);
        }
    }
    return out;
}

function strToBytes(str) {
    let utf8 = unescape(encodeURIComponent(str));
    let out = new Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
        out[i] = utf8.charCodeAt(i) & 0xff;
    }
    return out;
}

function bytesToStr(bytes) {
    let s = "";
    for (let i = 0; i < bytes.length; i++) {
        s += String.fromCharCode(bytes[i] & 0xff);
    }
    return decodeURIComponent(escape(s));
}

const SHA256_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function rotr(n, x) {
    return (x >>> n) | (x << (32 - n));
}

function sha256(msgBytes) {
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    let l = msgBytes.length;
    let bitLen = l * 8;
    let padLen = ((l + 9 + 63) & ~63);
    let padded = new Array(padLen);
    for (let i = 0; i < padLen; i++) padded[i] = 0;
    for (let i = 0; i < l; i++) padded[i] = msgBytes[i] & 0xff;
    padded[l] = 0x80;
    padded[padLen - 4] = (bitLen >>> 24) & 0xff;
    padded[padLen - 3] = (bitLen >>> 16) & 0xff;
    padded[padLen - 2] = (bitLen >>> 8) & 0xff;
    padded[padLen - 1] = bitLen & 0xff;
    let W = new Array(64);
    for (let i = 0; i < padLen; i += 64) {
        for (let t = 0; t < 16; t++) {
            W[t] = ((padded[i + t * 4] << 24) | (padded[i + t * 4 + 1] << 16) | (padded[i + t * 4 + 2] << 8) | (padded[i + t * 4 + 3])) >>> 0;
        }
        for (let t = 16; t < 64; t++) {
            let s0 = (rotr(7, W[t - 15]) ^ rotr(18, W[t - 15]) ^ (W[t - 15] >>> 3)) >>> 0;
            let s1 = (rotr(17, W[t - 2]) ^ rotr(19, W[t - 2]) ^ (W[t - 2] >>> 10)) >>> 0;
            W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
        }
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        for (let t = 0; t < 64; t++) {
            let S1 = (rotr(6, e) ^ rotr(11, e) ^ rotr(25, e)) >>> 0;
            let ch = ((e & f) ^ (~e & g)) >>> 0;
            let temp1 = (h + S1 + ch + SHA256_K[t] + W[t]) >>> 0;
            let S0 = (rotr(2, a) ^ rotr(13, a) ^ rotr(22, a)) >>> 0;
            let maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
            let temp2 = (S0 + maj) >>> 0;
            h = g; g = f; f = e; e = (d + temp1) >>> 0;
            d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
        }
        H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    let out = new Array(32);
    for (let i = 0; i < 8; i++) {
        out[i * 4] = (H[i] >>> 24) & 0xff;
        out[i * 4 + 1] = (H[i] >>> 16) & 0xff;
        out[i * 4 + 2] = (H[i] >>> 8) & 0xff;
        out[i * 4 + 3] = H[i] & 0xff;
    }
    return out;
}

function hmacSha256(keyBytes, dataBytes) {
    let k = keyBytes.slice(0);
    if (k.length > 64) k = sha256(k);
    while (k.length < 64) k.push(0);
    let o_key = new Array(64), i_key = new Array(64);
    for (let i = 0; i < 64; i++) {
        o_key[i] = k[i] ^ 0x5c;
        i_key[i] = k[i] ^ 0x36;
    }
    return sha256(o_key.concat(sha256(i_key.concat(dataBytes))));
}

const AES_SBOX = [
    0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
    0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
    0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
    0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
    0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
    0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
    0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
    0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
    0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
    0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
    0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
    0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
    0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
    0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
    0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
    0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
];

const AES_RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

function xtime(a) {
    return ((a << 1) ^ (((a >> 7) & 1) * 0x1b)) & 0xff;
}

// Hỗ trợ AES-128 (key 16 byte) và AES-256 (key 32 byte)
function aesExpandKey(key) {
    let nk = key.length / 4;
    let nr = nk + 6;
    let total = 4 * (nr + 1);
    let w = new Array(total * 4);
    for (let i = 0; i < key.length; i++) w[i] = key[i] & 0xff;
    for (let i = nk; i < total; i++) {
        let t0 = w[(i - 1) * 4], t1 = w[(i - 1) * 4 + 1], t2 = w[(i - 1) * 4 + 2], t3 = w[(i - 1) * 4 + 3];
        if (i % nk === 0) {
            let tmp = t0;
            t0 = AES_SBOX[t1] ^ AES_RCON[i / nk];
            t1 = AES_SBOX[t2];
            t2 = AES_SBOX[t3];
            t3 = AES_SBOX[tmp];
        } else if (nk > 6 && i % nk === 4) {
            t0 = AES_SBOX[t0];
            t1 = AES_SBOX[t1];
            t2 = AES_SBOX[t2];
            t3 = AES_SBOX[t3];
        }
        w[i * 4] = w[(i - nk) * 4] ^ t0;
        w[i * 4 + 1] = w[(i - nk) * 4 + 1] ^ t1;
        w[i * 4 + 2] = w[(i - nk) * 4 + 2] ^ t2;
        w[i * 4 + 3] = w[(i - nk) * 4 + 3] ^ t3;
    }
    return w;
}

function aesEncryptBlock(block, w) {
    let s = block.slice(0, 16);
    let rounds = w.length / 16 - 1;
    for (let i = 0; i < 16; i++) s[i] ^= w[i];
    for (let r = 1; r <= rounds; r++) {
        for (let i = 0; i < 16; i++) s[i] = AES_SBOX[s[i]];
        let tmp = s[1]; s[1] = s[5]; s[5] = s[9]; s[9] = s[13]; s[13] = tmp;
        tmp = s[2]; s[2] = s[10]; s[10] = tmp; tmp = s[6]; s[6] = s[14]; s[14] = tmp;
        tmp = s[15]; s[15] = s[11]; s[11] = s[7]; s[7] = s[3]; s[3] = tmp;
        if (r < rounds) {
            for (let c = 0; c < 4; c++) {
                let idx = c * 4;
                let a0 = s[idx], a1 = s[idx + 1], a2 = s[idx + 2], a3 = s[idx + 3];
                let t = a0 ^ a1 ^ a2 ^ a3;
                s[idx] ^= t ^ xtime(a0 ^ a1);
                s[idx + 1] ^= t ^ xtime(a1 ^ a2);
                s[idx + 2] ^= t ^ xtime(a2 ^ a3);
                s[idx + 3] ^= t ^ xtime(a3 ^ a0);
            }
        }
        for (let i = 0; i < 16; i++) s[i] ^= w[r * 16 + i];
    }
    return s;
}

// AES-GCM giải mã = CTR bắt đầu từ counter 2 (bỏ qua xác thực tag)
function aesCtrDecrypt(key, iv12, ciphertextWithTag) {
    let w = aesExpandKey(key);
    let ctLen = ciphertextWithTag.length - 16;
    let out = new Array(ctLen);
    let counterBlock = new Array(16);
    for (let i = 0; i < 12; i++) counterBlock[i] = iv12[i] & 0xff;
    let blocks = Math.ceil(ctLen / 16);
    for (let b = 0; b < blocks; b++) {
        let c = b + 2;
        counterBlock[12] = (c >>> 24) & 0xff;
        counterBlock[13] = (c >>> 16) & 0xff;
        counterBlock[14] = (c >>> 8) & 0xff;
        counterBlock[15] = c & 0xff;
        let keystream = aesEncryptBlock(counterBlock, w);
        let offset = b * 16;
        for (let i = 0; i < 16 && (offset + i) < ctLen; i++) {
            out[offset + i] = (ciphertextWithTag[offset + i] & 0xff) ^ keystream[i];
        }
    }
    return out;
}

// Lấy từ /js/bookmark.js (data-cipher-decoder) của site. Nếu site đổi lại thì cập nhật chuỗi này.
const TOKEN_VERSION = 1;
const MASTER_SECRET = b64ToBytes("YVdGuT8RjDWkeQjt7s7mv53smMpLrcKBuGMs8erg8Bs");
const K_TOKEN = hmacSha256(MASTER_SECRET, strToBytes("tok"));
const K_ENC = hmacSha256(MASTER_SECRET, strToBytes("enc"));

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    console.log("[DEBUG] Fetching chapter URL: " + url);
    
    let response = fetch(url);
    if (!response.ok) {
        console.log("[ERROR] Failed to fetch chapter page. Status: " + response.status);
        return null;
    }
    
    let doc = response.html();
    let contentEl = doc.select("#chapter-content");
    let cipherPath = contentEl.attr("data-cipher-path");
    console.log("[DEBUG] cipherPath found: " + cipherPath);
    
    if (cipherPath) {
        let mac = hmacSha256(K_TOKEN, strToBytes(cipherPath)).slice(0, 16);
        let tokenBytes = [TOKEN_VERSION].concat(mac);
        let token = bytesToB64(tokenBytes);

        // cipherPath = "<slug>/<chapter>" -> /_c/mangas/<slug>/chapters/<chapter>/pages?_=<token>
        let slash = cipherPath.indexOf("/");
        let slug = encodeURIComponent(cipherPath.substring(0, slash));
        let chap = encodeURIComponent(cipherPath.substring(slash + 1));
        let apiUrl = BASE_URL + "/_c/mangas/" + slug + "/chapters/" + chap + "/pages?_=" + token;
        console.log("[DEBUG] Requesting API URL: " + apiUrl);
        
        let apiRes = fetch(apiUrl, {
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": url
            }
        });
        
        console.log("[DEBUG] API Response status: " + apiRes.status);
        if (apiRes.ok) {
            let json = apiRes.json();
            if (json && json.e) {
                console.log("[DEBUG] Encrypted data 'e' received successfully.");
                let raw = b64ToBytes(json.e);
                let iv = raw.slice(0, 12);
                let ct = raw.slice(12);
                // AES-256-GCM: key = HMAC(K_ENC, token) đủ 32 byte, IV 12 byte, AAD = cipherPath
                let aesKey = hmacSha256(K_ENC, strToBytes(token));
                let decryptedBytes = aesCtrDecrypt(aesKey, iv, ct);
                let parsed = JSON.parse(bytesToStr(decryptedBytes));
                
                if (parsed && Array.isArray(parsed.p)) {
                    console.log("[DEBUG] Successfully decrypted " + parsed.p.length + " images.");
                    if (parsed.s && parsed.s.some(function (k) { return k; })) {
                        console.log("[WARN] Chapter có trang bị xáo trộn (key 's'); extension chưa ghép lại ảnh.");
                    }
                    let images = [];
                    for (let i = 0; i < parsed.p.length; i++) {
                        let imgUrl = parsed.p[i];
                        if (imgUrl.indexOf("http") < 0) imgUrl = BASE_URL + imgUrl;
                        images.push(imgUrl.trim());
                    }
                    return Response.success(images);
                } else {
                    console.log("[ERROR] Decrypted JSON does not contain array 'p'.");
                }
            } else {
                console.log("[ERROR] API response missing field 'e'.");
            }
        } else {
            console.log("[ERROR] API request failed with status: " + apiRes.status);
        }
    } else {
        console.log("[DEBUG] No cipherPath found, falling back to standard <img> selectors.");
    }
    
    let el = doc.select(".reading-content img, .chapter-content img, .page-break img, .viewer-content img, #chapter-content img");
    let data = [];
    for (let i = 0; i < el.size(); i++) {
        let e = el.get(i);
        let img = e.attr("data-original-src") || e.attr("data-src") || e.attr("src");
        if (img && img.indexOf("loading") === -1 && img.indexOf("spinner") === -1 && img.indexOf("data:image") === -1) {
            if (img.indexOf("http") < 0) img = BASE_URL + img;
            data.push(img.trim());
        }
    }
    console.log("[DEBUG] Fallback found " + data.length + " images.");
    return Response.success(data);
}