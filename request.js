const chalk = require("chalk");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const url = "https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2025-26-1502138/sri-lanka-vs-australia-30th-match-group-b-1512748/ball-by-ball-commentary";

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // important
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
     });
    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector('[itemprop="articleBody"]', { timeout: 20000 });

    const commentary = await page.$$eval(
        '[itemprop="articleBody"]',
        els => els.map(el => el.innerText)
    );

    console.log("Latest ball:");
    console.log(chalk.greenBright(commentary[0]));
    console.log("*******************************")
    console.log(chalk.greenBright(commentary[commentary.length - 1]));

    await browser.close();
})();