const chalk = require("chalk");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const url = "https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2025-26-1502138/sri-lanka-vs-australia-30th-match-group-b-1512748/full-scorecard";

(async () => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36"
    );
    await page.goto(url, { waitUntil : "domcontentloaded", timeout: 60000 });


    await page.waitForSelector(".ci-team-score a span.ds-text-header-5", { timeout: 20000 });
    const playingTeamName = await page.$$eval(".ci-team-score a span.ds-text-header-5",
         els => els.filter(el => !el.closest(".ci-team-score").classList.contains("ds-opacity-50"))
         .map(el => el.innerText));
    const winningTeamName = playingTeamName[0];
    // console.log(winningTeamName);
    

    // await page.waitForSelector(".ds-mb-2 .ds-mb-4", { timeout: 20000 });
    // const teamScorecardHtml = await page.$$eval(".ds-mb-2 .ds-mb-4", els => els.map(
    //     el => {
    //         const scorecardTeamName = el.querySelector(".ds-text-title-1.ds-font-semibold.ds-capitalize.ds-text-color-text");
    //         return scorecardTeamName ? scorecardTeamName.innerText.trim() : null;
    //     }
    // ));
    // console.log(teamScorecardHtml);

    // for (let i = 0; i < teamScorecardHtml.length; i++) {
    //     if (teamScorecardHtml[i] === winningTeamName) {
    //         console.log("Matched Team Found:", teamScorecardHtml[i]);
    //     }
    // }

    const winningBowlingTable = await page.$$eval( ".ds-mb-2 .ds-mb-4",
        (blocks, winningTeamName) => {
            for (let block of blocks) {
                const titleEl = block.querySelector(
                    ".ds-text-title-1.ds-font-semibold.ds-capitalize.ds-text-color-text"
                );
                // console.log(titleEl.innerText.trim());

                if (titleEl && titleEl.innerText.trim() !== winningTeamName) {
                    const tables = block.querySelectorAll(".ds-w-full.ds-v2-table.ds-v2-table-md.ds-table-auto");
                    const filteredTables = Array.from(tables).find(
                        table => !table.classList.contains("ci-scorecard-table")
                    );
                    // return filteredTables.map(table => table.outerHTML);
                    if (!filteredTables) return null;
                        const rows = filteredTables.querySelectorAll("tbody tr");

                        return Array.from(rows).filter(row => row.querySelectorAll("td").length >= 5).map(row => {
                            const cols = row.querySelectorAll("td");
                            return {
                                bowler: cols[0]?.innerText.trim(),
                                overs: cols[1]?.innerText.trim(),
                                runs: cols[3]?.innerText.trim(),
                                wickets: cols[4]?.innerText.trim()
                            };
                        }
                    );
                }
            }
            return null;
        },
        winningTeamName
    );

    // if (winningBowlingTable) {
    //     console.log("Bowling Table Found:");
    //     console.log(winningBowlingTable);
    // }
    // console.log(winningBowlingTable);
    winningBowlingTable.sort((a, b) => 
        Number(b.wickets) - Number(a.wickets)
    );

    console.log(winningBowlingTable[0]);

    await browser.close();
})();
