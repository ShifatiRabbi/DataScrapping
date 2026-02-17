const request = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");

const url = "https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2025-26-1502138/sri-lanka-vs-australia-30th-match-group-b-1512748/ball-by-ball-commentary";

request(url, async (err, res, html) => {
    if(err) {
        console.log("Error Occur : " + err);
    } else {
        let $ = cheerio.load(html);
        const commentaryBlocks = $(".ds-hover-parent.ds-relative .ds-text-color-text");
        const lastCommentary = $(commentaryBlocks[0]).text();
        console.log(lastCommentary);
    }
});