const puppeteer = require("puppeteer");

const url = "https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2025-26-1502138/sri-lanka-vs-australia-30th-match-group-b-1512748/ball-by-ball-commentary";

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector('[itemprop="articleBody"]', { timeout: 15000 });

    const commentary = await page.$$eval(
        '[itemprop="articleBody"]',
        els => els.map(el => el.innerText)
    );

    console.log("Latest ball:");
    console.log(commentary[0]);

    await browser.close();
})();