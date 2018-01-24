// External dependencies
const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');

// Project level dependencies
const convert = require('./utils/convert');
const exportToJSON = require('./utils/export-to-json');

// Constant variables
const URL = 'https://web.bankin.com/challenge/index.html?start=';

// These are environment variables

// How many transactions per page
const TRANSACTIONS_PER_PAGE = parseInt(process.env.TRANSACTIONS_PER_PAGE) || 50;

// How many pages to scrap (if === 0 then endless mode)
const PAGES = parseInt(process.env.PAGES || 100);

// How many pages to scrap at the same time (only if PAGES > 100 OR endless mode)
const PAGES_PER_CYCLE = parseInt(process.env.PAGES_PER_CYCLE) || 10;

// Starting timestamp to compute the processing time
const startTime = performance.now();

// Mute some Promise errors due to Puppeteer
process.on('unhandledRejection', e=>e);

/**
 * `parse` takes a Puppeteer page Object and return the HTML of the page
 * @param {puppeteer::page}
 * @return {String}
 */
const parse = async (page) => {
  // Wait till the JavaScript command returns true in the browser page
  await page.waitForFunction(`$('tr').length > 0 ||
      $('#fm').contents().find('body').html()`);
  return await page.evaluate(() => {
    // Check if the transactions are shown in an iframe
    if (document.getElementById('fm')) {
      return document.getElementById('fm').contentDocument.body.innerHTML;
    }
    return document.body.innerHTML;
  });
}

/**
 * `load` is a recursive async function.
 * It takes a Puppeteer page Object and the URL to load
 * It returns an Array on success
 * And retry the load on fail
 * @param {puppeteer::page, String}
 * @return {Array}
 */
const load = async (page, urlToParse) => {
  try {
    page.on('dialog', async dialog => {
      await dialog.dismiss();
      await page.click('#btnGenerate');
    });
    await page.goto(urlToParse);
    const result = await parse(page);
    return convert(result);
  } catch (e) {
    return load(page, urlToParse);
  }
}

// The main function
(async () => {
  // Launch a puppeteer browser
  const browser = await puppeteer.launch({ headless : true });

  // In endless mode we need this flag to tell when it has reached the end
  let hasFinished = false;

  // Others self-explanatory init variables
  let promises;
  let results;
  let transactions = [];
  let counter = 0;

  const pagesPerCycle = PAGES || PAGES_PER_CYCLE;

  while (!hasFinished) {
    // Generate an array of promises which will scrap all the pages at once
    promises =
      [...Array(pagesPerCycle)]
        .map((x, i) => {
          return browser.newPage().then(async page => {
            const urlToParse =
              URL + (i * TRANSACTIONS_PER_PAGE + (pagesPerCycle * TRANSACTIONS_PER_PAGE * counter));
            const result = await load(page, urlToParse);
            if (PAGES !== 0) {
              hasFinished = true;
            } else if (result.length === 0) {
              hasFinished = true;
            }
            return result;
          })
        })
    // We wait for all the results
    results = await Promise.all(promises);
    /**
     * results is an Array of Array of transactions (one Array(50) for each page)
     * So we need to flat it with reduce and then add it to the transactions
     */
    transactions.push(...results.reduce((acc, curr) => [...acc, ...curr], []));
    counter += 1;
  }

  // We export the transactions to a JSON file on disk (output.json)
  exportToJSON(transactions);

  // Some logs
  console.log('Took (in seconds):', (performance.now() - startTime) / 1000);
  console.log('Total transactions retrieved:', transactions.length);

  // Closing the puppeteer browser
  await browser.close();
})();
