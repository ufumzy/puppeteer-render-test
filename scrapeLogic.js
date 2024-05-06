const puppeteer = require("puppeteer");
const { resolve } = require("path");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const startTime = process.hrtime(); // Start time

  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://www.goal.com", { waitUntil: "domcontentloaded" });

    const title = await page.title();

    console.log("Page title is:", title);

    const endTime = process.hrtime(startTime); // End time
    const executionTime = endTime[0] + endTime[1] / 1e9; // Execution time in seconds

    console.log(`Execution time: ${executionTime.toFixed(2)} seconds`);

    res.send(`The title of the page is: ${title}. Execution time: ${executionTime.toFixed(2)} seconds`);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
