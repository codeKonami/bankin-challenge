/**
 * convert takes rawHTML and return an Array of each row in a table element
 * @param {String} rawHTML
 * @return {Array}
 */

const cheerio = require('cheerio');

const currencies = require('./currencies-by-symbol');

module.exports = (rawHTML) => {
  // Parse the rawHTML through cheerio
  const $ = cheerio.load(rawHTML);

  // data is an array of all the rows in the table HTML element
  const data = $('tr')
    .toArray()
    .map(x => {
      return x.children.map(x => x.children[0].data)
    })
    .map(x => ({
      account: x[0],
      transaction: parseInt(x[1].replace('Transaction ', '')),
      amount: parseInt(x[2].slice(0, -1)),
      currency: currencies[x[2].slice(-1)] || undefined,
    }));

  // we return the array without the headers
  return data.slice(1);
}
