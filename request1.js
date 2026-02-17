const axios = require("axios"); 

const url = "https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2025-26-1502138/sri-lanka-vs-australia-30th-match-group-b-1512748/ball-by-ball-commentary";

axios.get(url, {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml"
    }
})
.then(res => {
    console.log("HTML:", res.data);
})
.catch(err => {
    console.log("Error:", err.response?.status + err);
});