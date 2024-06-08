const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const pluginAnonymizeUA = require('puppeteer-extra-plugin-anonymize-ua');

const convertLogic = async (res) => {
  try {
    const startTime = process.hrtime(); // Start time

    puppeteer.use(pluginStealth());
    puppeteer.use(pluginAnonymizeUA());

    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath: puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    const url = 'https://convertbetcodes.com/c/free-bet-codes-for-today';
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract pagination content
    const paginationContent = await page.$eval('ul.pagination.pagination-sm.mg-y-20', ul => ul.innerHTML);

    // Extract page numbers from pagination content
    const pageNumbers = paginationContent.match(/page=(\d+)/g).map(match => parseInt(match.match(/page=(\d+)/)[1]));

    // Find maximum page number
    const maxPage = Math.max(...pageNumbers);

    console.log('Total number of pages:', maxPage);

    const extractedData = [];

    // Loop through each page
    for (let pageNum = 1; pageNum <= maxPage; pageNum++) {
      const pageUrl = `${url}?page=${pageNum}`;
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

      const pageData = await page.evaluate(() => {
        const data = [];
        const containers = document.querySelectorAll('.col-md-4.mg-y-5');
        containers.forEach(container => {
          const fromOddsElement = container.querySelector('div.row > div.col-6 > p > span');
          const toOddsElement = container.querySelector('div.row > div.col-6.text-right > p > span');
          const fromCountryElement = container.querySelector('.tx-10.flag-icon');
          const arrowElement = container.querySelector('.fa.fa-long-arrow-alt-right.conversion-arrow');
          const toCountryElement = arrowElement ? arrowElement.nextElementSibling.querySelector('.tx-10.flag-icon') : null;
          if (fromOddsElement && toOddsElement && fromCountryElement) {
            const fromOddsText = fromOddsElement.innerText.trim();
            const toOddsText = toOddsElement.innerText.trim();
            const fromEvent = fromOddsText.split('\n@')[0].trim();
            const fromOdds = fromOddsText.split('\n@')[1].trim();
            const toEvent = toOddsText.split('\n@')[0].trim();
            const toOdds = toOddsText.split('\n@')[1].trim();
            const fromCountry = fromCountryElement.className.replace('tx-10 flag-icon flag-icon-', '').trim();
            const toCountry = toCountryElement ? toCountryElement.className.replace('tx-10 flag-icon flag-icon-', '').trim() : '';
            const fromBookmarkerFull = container.querySelector('h4 span:first-child').innerText.trim();
            const toBookmarkerFull = container.querySelector('h4 span:last-child').innerText.trim();
            const fromBookmarkerParts = fromBookmarkerFull.split('\n\n');
            const toBookmarkerParts = toBookmarkerFull.split('\n\n');
            const fromBookmarkerCode = fromBookmarkerParts[0];
            const fromBookmarkerName = fromBookmarkerParts[1];
            const toBookmarkerCode = toBookmarkerParts[0];
            const toBookmarkerName = toBookmarkerParts[1];
            const afterContentFull = container.querySelector('i.fab.fa-long-arrow-alt-right').nextElementSibling.innerText.trim();
            const afterContentParts = afterContentFull.split('\n\n');
            const toBookmarkerCodeExtracted = afterContentParts[0];
            const toBookmarkerNameExtracted = afterContentParts[1];
            const timestamp = new Date().toUTCString(); // Convert to UTC string
            data.push({
              from_event: fromEvent,
              from_odds: fromOdds,
              from_country: fromCountry,
              to_event: toEvent,
              to_odds: toOdds,
              to_country: toCountry,
              from_bookmarker_code: fromBookmarkerCode,
              from_bookmarker_name: fromBookmarkerName,
              to_bookmarker_code: toBookmarkerCodeExtracted,
              to_bookmarker_name: toBookmarkerNameExtracted,
              timestamp: timestamp // Include timestamp
            });
          }
        });
        return data;
      });

      // Filter out duplicates based on complete similarity across all 11 scraped columns
      const filteredData = pageData.filter(item => {
        return !extractedData.some(existingItem => JSON.stringify(existingItem) === JSON.stringify(item));
      });

      extractedData.push(...filteredData);
    }

    await browser.close();

    if (extractedData.length === 0) {
      return res.status(500).json({ message: 'No new records found' });
    }

    // Insert data into Supabase
    const { data, error } = await supabase.from('bet_data').insert(extractedData);
    if (error) {
      console.error('Error inserting data into Supabase:', error.message);
      return res.status(500).json({ message: 'An error occurred while inserting data into Supabase' });
    }

    const endTime = process.hrtime(startTime);
    const executionTimeInSeconds = (endTime[0] + endTime[1] / 1e9).toFixed(3);
    const message = data ? `Data inserted successfully. Execution time: ${executionTimeInSeconds} seconds` : "New records inserted";
    return res.json({ message, execution_time: executionTimeInSeconds });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ message: 'An error occurred' });
  }
};

module.exports = { convertLogic };
