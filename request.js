const request = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");

const url = "https://tophutbd.com/";

const tagExtractor = (tags) => {};

request(url, async (err, res, html) => {
    if(err) {
        console.log("Error Occur : " + err);
    } else {
        let data = cheerio.load(html);
        let h3Tags = data("h3");
        h3Tags.toArray().forEach(h3 => {
           console.log(chalk.green(data(h3).text())) 
        });

        let pTags = data("p");
        console.log(pTags.length);
    }
});